/**
 * backend/db.js  -- PostgreSQL / Supabase edition
 * Uses the `pg` (node-postgres) library with a connection pool.
 *
 * Sanitizes all environment variables (strips accidental surrounding quotes/spaces)
 * and safely supports both individual DB_* parameters and DATABASE_URL.
 */

import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

function cleanValue(val) {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  return str.replace(/^["']|["']$/g, '').trim();
}

let host = cleanValue(process.env.DB_HOST);
let port = cleanValue(process.env.DB_PORT);
let database = cleanValue(process.env.DB_NAME);
let user = cleanValue(process.env.DB_USER);
let password = cleanValue(process.env.DB_PASSWORD);

// If DATABASE_URL is provided, safely parse with URL class (does NOT strip dots in username)
if (process.env.DATABASE_URL) {
  try {
    const rawUrl = cleanValue(process.env.DATABASE_URL);
    const parsed = new URL(rawUrl);
    if (!host) host = parsed.hostname;
    if (!port) port = parsed.port;
    if (!database && parsed.pathname) database = parsed.pathname.replace(/^\//, '');
    if (!user && parsed.username) user = decodeURIComponent(parsed.username);
    if (!password && parsed.password) password = decodeURIComponent(parsed.password);
  } catch (err) {
    console.warn('[db] Failed to parse DATABASE_URL:', err.message);
  }
}

// Project defaults (fallback if env vars not set)
host     = host     || 'aws-0-ap-southeast-2.pooler.supabase.com';
port     = parseInt(port || '5432', 10);
database = database || 'postgres';
user     = user     || 'postgres.dftpmkbyesvxcymbgfrh';
password = password || 'Jaswanth8520874916';

// ─────────────────────────────────────────────────────────
// Connection Pool — individual params bypass pg URL parser
// ─────────────────────────────────────────────────────────
const pool = new Pool({
  host,
  port,
  database,
  user,
  password,
  ssl: { rejectUnauthorized: false },
  // Serverless-friendly limits — Vercel spins up many short-lived instances
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Diagnostic connection test helper — tests primary port and tries 6543 if 5432 fails
export async function testDbConnection() {
  const maskedPass = password ? `${password[0]}***${password.slice(-1)} (length: ${password.length})` : 'MISSING';
  const config = {
    host,
    port,
    database,
    user,
    passwordPreview: maskedPass,
    ssl: true,
  };

  async function tryConnect(p) {
    const testPool = new Pool({
      host,
      port: p,
      database,
      user,
      password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      const client = await testPool.connect();
      try {
        const res = await client.query('SELECT NOW() as now, current_user as "currentUser", current_database() as "currentDb"');
        return { success: true, port: p, result: res.rows[0] };
      } finally {
        client.release();
      }
    } catch (err) {
      return {
        success: false,
        port: p,
        error: {
          message: err.message,
          code: err.code,
        },
      };
    } finally {
      await testPool.end().catch(() => {});
    }
  }

  // Test configured port
  const primaryResult = await tryConnect(port);
  if (primaryResult.success) {
    return { success: true, config, result: primaryResult.result };
  }

  // If primary port failed, try alternate port (5432 <-> 6543)
  const alternatePort = port === 5432 ? 6543 : 5432;
  const altResult = await tryConnect(alternatePort);

  return {
    success: false,
    config,
    primaryPort: { port, ...primaryResult },
    alternatePort: { port: alternatePort, ...altResult },
    error: primaryResult.error,
  };
}

// Generic query helper
async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// ─── Production-Grade Schema Bootstrap ───────────────────────
async function initSchema() {
  const client = await pool.connect();
  try {
    // Extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`).catch(() => {});

    // ── users ──────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id             VARCHAR(50)  PRIMARY KEY,
        email          VARCHAR(255) UNIQUE NOT NULL,
        password_hash  VARCHAR(255),
        password       VARCHAR(255),
        role           VARCHAR(20)  NOT NULL DEFAULT 'user'
                                   CHECK (role IN ('user','admin','viewer')),
        full_name      VARCHAR(255),
        name           VARCHAR(255),
        gender         VARCHAR(30),
        employee_id    VARCHAR(50),
        business_group VARCHAR(255),
        account        VARCHAR(255),
        is_active      BOOLEAN      NOT NULL DEFAULT true,
        last_login_at  TIMESTAMP,
        created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    // Safe column additions for existing tables
    const userCols = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name      VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS name           VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id    VARCHAR(50)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS business_group VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS account        VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active      BOOLEAN NOT NULL DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at  TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMP NOT NULL DEFAULT NOW()`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash  VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS password       VARCHAR(255)`,
    ];
    for (const sql of userCols) await client.query(sql).catch(() => {});

    // Sync password ↔ password_hash and name ↔ full_name for existing rows
    await client.query(`UPDATE users SET password_hash = password WHERE password_hash IS NULL AND password IS NOT NULL`).catch(() => {});
    await client.query(`UPDATE users SET password = password_hash WHERE password IS NULL AND password_hash IS NOT NULL`).catch(() => {});
    await client.query(`UPDATE users SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL`).catch(() => {});
    await client.query(`UPDATE users SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL`).catch(() => {});

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email       ON users (LOWER(email))`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role        ON users (role)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_is_active   ON users (is_active)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users (employee_id)`).catch(() => {});

    // ── questions ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id            SERIAL       PRIMARY KEY,
        framework     VARCHAR(10)  NOT NULL DEFAULT 'SDLC'
                                   CHECK (framework IN ('SDLC','AMS')),
        area          VARCHAR(100) NOT NULL,
        sub_area      VARCHAR(300) NOT NULL,
        practice      VARCHAR(400) NOT NULL,
        question_type VARCHAR(50)  NOT NULL DEFAULT 'extent',
        type          VARCHAR(50)  NOT NULL DEFAULT 'extent',
        question_text TEXT         NOT NULL,
        weightage     NUMERIC(4,2) NOT NULL DEFAULT 1.00,
        is_active     BOOLEAN      NOT NULL DEFAULT true,
        sort_order    INT          NOT NULL DEFAULT 0,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    const qCols = [
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) NOT NULL DEFAULT 'extent'`,
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS weightage     NUMERIC(4,2) NOT NULL DEFAULT 1.00`,
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT true`,
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS sort_order    INT NOT NULL DEFAULT 0`,
      `ALTER TABLE questions ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMP NOT NULL DEFAULT NOW()`,
    ];
    for (const sql of qCols) await client.query(sql).catch(() => {});

    // DB-level unique constraint on questions
    await client.query(`
      ALTER TABLE questions
      ADD CONSTRAINT uq_questions_practice UNIQUE (framework, area, sub_area, practice)
    `).catch(() => {}); // ignore if already exists

    await client.query(`CREATE INDEX IF NOT EXISTS idx_questions_framework ON questions (framework)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_questions_area      ON questions (framework, area)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_questions_active    ON questions (is_active)`);

    // ── assessments ───────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id               VARCHAR(50)   PRIMARY KEY,
        user_id          VARCHAR(50)   NOT NULL,
        user_email       VARCHAR(255),
        project_name     VARCHAR(255)  NOT NULL,
        framework        VARCHAR(10)   NOT NULL DEFAULT 'SDLC'
                                       CHECK (framework IN ('SDLC','AMS')),
        status           VARCHAR(20)   NOT NULL DEFAULT 'completed'
                                       CHECK (status IN ('draft','in_progress','completed','archived')),
        answers          JSONB         NOT NULL DEFAULT '{}',
        scores           JSONB         NOT NULL DEFAULT '{}',
        overall_score    NUMERIC(5,2)  NOT NULL DEFAULT 0.00,
        answer_count     INT           NOT NULL DEFAULT 0,
        remarks          TEXT,
        remarks_provider VARCHAR(50),
        feedback         JSONB,
        created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMP     NOT NULL DEFAULT NOW()
      )
    `);

    const aCols = [
      `ALTER TABLE assessments ADD COLUMN IF NOT EXISTS status       VARCHAR(20) NOT NULL DEFAULT 'completed'`,
      `ALTER TABLE assessments ADD COLUMN IF NOT EXISTS answer_count INT NOT NULL DEFAULT 0`,
      `ALTER TABLE assessments ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMP NOT NULL DEFAULT NOW()`,
    ];
    for (const sql of aCols) await client.query(sql).catch(() => {});

    // Add FK from assessments.user_id → users.id (safe — only works if referential integrity is already met)
    await client.query(`
      ALTER TABLE assessments ADD CONSTRAINT fk_assessments_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    `).catch(() => {}); // silently skip if constraint exists or integrity fails

    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_user_id    ON assessments (user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_framework  ON assessments (framework)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_status     ON assessments (status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments (created_at DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_user_fw    ON assessments (user_id, framework)`);

    // ── assessment_reports ────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessment_reports (
        id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_id       VARCHAR(50)  NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        provider            VARCHAR(50),
        model               VARCHAR(100),
        prompt_version      VARCHAR(20)  NOT NULL DEFAULT 'v1.0',
        report_json         JSONB,
        generation_status   VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                         CHECK (generation_status IN ('pending','generating','completed','failed','fallback')),
        error_message       TEXT,
        generation_time_ms  INT,
        retry_count         SMALLINT     NOT NULL DEFAULT 0,
        created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    const rCols = [
      `ALTER TABLE assessment_reports ADD COLUMN IF NOT EXISTS error_message      TEXT`,
      `ALTER TABLE assessment_reports ADD COLUMN IF NOT EXISTS generation_time_ms INT`,
      `ALTER TABLE assessment_reports ADD COLUMN IF NOT EXISTS retry_count        SMALLINT NOT NULL DEFAULT 0`,
    ];
    for (const sql of rCols) await client.query(sql).catch(() => {});

    await client.query(`CREATE INDEX IF NOT EXISTS idx_reports_assessment_id ON assessment_reports (assessment_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_reports_status        ON assessment_reports (generation_status)`);

    // ── feedback ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id             VARCHAR(50)  PRIMARY KEY,
        assessment_id  VARCHAR(50)  NOT NULL,
        user_id        VARCHAR(50)  NOT NULL,
        user_email     VARCHAR(255),
        rating         SMALLINT     NOT NULL DEFAULT 3,
        comments       TEXT,
        created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW()`).catch(() => {});

    // FK constraints on feedback
    await client.query(`ALTER TABLE feedback ADD CONSTRAINT fk_feedback_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE`).catch(() => {});
    await client.query(`ALTER TABLE feedback ADD CONSTRAINT fk_feedback_user       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`).catch(() => {});

    // CHECK constraint on rating
    await client.query(`ALTER TABLE feedback ADD CONSTRAINT chk_feedback_rating CHECK (rating >= 1 AND rating <= 5)`).catch(() => {});

    // One feedback per user per assessment
    await client.query(`ALTER TABLE feedback ADD CONSTRAINT uq_feedback_user_assessment UNIQUE (assessment_id, user_id)`).catch(() => {});

    await client.query(`CREATE INDEX IF NOT EXISTS idx_feedback_assessment_id ON feedback (assessment_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_feedback_user_id       ON feedback (user_id)`);

    // ── settings ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id                  INT          PRIMARY KEY DEFAULT 1,
        active_ai_provider  VARCHAR(50)  NOT NULL DEFAULT 'expert'
                                         CHECK (active_ai_provider IN ('openai','gemini','claude','ollama','expert')),
        api_keys            JSONB        NOT NULL DEFAULT '{"openai":"","gemini":"","claude":""}',
        api_endpoints       JSONB        NOT NULL DEFAULT '{"openai":"","gemini":"","claude":"","ollama":""}',
        ollama_url          VARCHAR(255) NOT NULL DEFAULT 'http://localhost:11434',
        ollama_model        VARCHAR(100) NOT NULL DEFAULT 'llama3',
        updated_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT settings_single_row CHECK (id = 1)
      )
    `);

    await client.query(`ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW()`).catch(() => {});
    await client.query(`ALTER TABLE settings ADD CONSTRAINT settings_single_row CHECK (id = 1)`).catch(() => {});

    // ── audit_log ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       VARCHAR(50),
        action        VARCHAR(100) NOT NULL,
        entity_type   VARCHAR(50),
        entity_id     VARCHAR(100),
        old_values    JSONB,
        new_values    JSONB,
        ip_address    TEXT,
        user_agent    TEXT,
        created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_user_id    ON audit_log (user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_action     ON audit_log (action)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log (created_at DESC)`);

    // ── auto-update triggers ───────────────────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION trigger_set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    const triggerTargets = [
      ['users',              'trg_users_updated_at'],
      ['assessments',       'trg_assessments_updated_at'],
      ['assessment_reports','trg_reports_updated_at'],
      ['questions',         'trg_questions_updated_at'],
      ['feedback',          'trg_feedback_updated_at'],
      ['settings',          'trg_settings_updated_at'],
    ];
    for (const [tbl, trgName] of triggerTargets) {
      await client.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = '${trgName}') THEN
            CREATE TRIGGER ${trgName}
              BEFORE UPDATE ON ${tbl}
              FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
          END IF;
        END $$
      `).catch(() => {});
    }

    // ── Seeds ─────────────────────────────────────────────────
    try {
      await client.query(`
        INSERT INTO users (id, email, password_hash, password, role, full_name, name)
        VALUES ('admin_user','admin@sdlc.com',
          '$2a$10$e3lC5nLrQEWCmu15W69ux./xMB45aDURPA3skiFXmcmmySIWCAD.G',
          '$2a$10$e3lC5nLrQEWCmu15W69ux./xMB45aDURPA3skiFXmcmmySIWCAD.G',
          'admin','System Administrator','System Administrator')
        ON CONFLICT (id) DO UPDATE SET
          password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash),
          password      = COALESCE(users.password, EXCLUDED.password)
      `);
    } catch {
      await client.query(`
        INSERT INTO users (id, email, password_hash, role, full_name)
        VALUES ('admin_user','admin@sdlc.com',
          '$2a$10$e3lC5nLrQEWCmu15W69ux./xMB45aDURPA3skiFXmcmmySIWCAD.G',
          'admin','System Administrator')
        ON CONFLICT (id) DO UPDATE SET
          password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash)
      `).catch(() => {});
    }

    await client.query(`
      INSERT INTO settings (id, active_ai_provider, api_keys, api_endpoints, ollama_url, ollama_model)
      VALUES (1,'ollama',
        '{"openai":"","gemini":"","claude":""}',
        '{"openai":"","gemini":"","claude":"","ollama":""}',
        'http://localhost:11434','llama3')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✅ PostgreSQL production schema initialised (v2.0)');
  } catch (err) {
    console.error('❌ Schema init error:', err.message);
  } finally {
    client.release();
  }
}

initSchema().catch((err) => {
  console.error('Failed to initialise schema:', err.message);
});

// ── Audit log writer ──────────────────────────────────────────
export async function writeAuditLog({ userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent }) {
  try {
    await query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8)`,
      [
        userId   || null,
        action,
        entityType  || null,
        entityId    ? String(entityId) : null,
        oldValues   ? JSON.stringify(oldValues)   : null,
        newValues   ? JSON.stringify(newValues)   : null,
        ipAddress   || null,
        userAgent   || null,
      ]
    );
  } catch (err) {
    console.warn('[audit] write failed:', err.message); // never block main flow
  }
}


// USER METHODS
export async function getUsers() {
  try {
    return await query('SELECT id, email, role, COALESCE(full_name, name) as name, full_name, gender, business_group, employee_id, account, created_at FROM users ORDER BY created_at DESC');
  } catch {
    return await query('SELECT id, email, role, full_name as name, full_name, gender, business_group, employee_id, account, created_at FROM users ORDER BY created_at DESC');
  }
}

export async function createUser(email, password, extraData = {}) {
  const bcrypt = await import('bcryptjs');
  const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  if (existing.length > 0) throw new Error('User already exists');

  const salt = await bcrypt.default.genSalt(10);
  const hashedPassword = await bcrypt.default.hash(password, salt);
  const id = 'user_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const name           = (extraData.name           || '').trim();
  const businessGroup  = (extraData.businessGroup  || '').trim();
  const employeeId     = (extraData.employeeId     || '').trim();
  const account        = (extraData.account        || '').trim();

  try {
    await query(
      'INSERT INTO users (id, email, password, password_hash, role, name, full_name, business_group, employee_id, account) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [id, email.toLowerCase(), hashedPassword, hashedPassword, 'user', name || null, name || null, businessGroup || null, employeeId || null, account || null]
    );
  } catch {
    await query(
      'INSERT INTO users (id, email, password_hash, role, full_name, business_group, employee_id, account) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [id, email.toLowerCase(), hashedPassword, 'user', name || null, businessGroup || null, employeeId || null, account || null]
    );
  }
  return { id, email: email.toLowerCase(), name, businessGroup, employeeId, account };
}

export async function authenticateUser(email, password) {
  const bcrypt = await import('bcryptjs');
  const rows = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = true', [email]);
  if (rows.length === 0) return null;
  const user = rows[0];

  // Support both password_hash (new) and password (legacy column)
  const hashToCheck = user.password_hash || user.password;
  const valid = await bcrypt.default.compare(password, hashToCheck);
  if (!valid) return null;

  // Stamp last login time
  await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]).catch(() => {});

  return {
    id:            user.id,
    email:         user.email,
    role:          user.role,
    name:          user.full_name || user.name || '',
    businessGroup: user.business_group || '',
    employeeId:    user.employee_id   || '',
    account:       user.account       || '',
  };
}


export async function getUserById(id) {
  let rows;
  try {
    rows = await query(
      'SELECT id, email, role, name, full_name, business_group, employee_id, account, created_at FROM users WHERE id = $1',
      [id]
    );
  } catch {
    rows = await query(
      'SELECT id, email, role, full_name as name, full_name, business_group, employee_id, account, created_at FROM users WHERE id = $1',
      [id]
    );
  }
  if (!rows || !rows[0]) return null;
  const u = rows[0];
  return {
    id:            u.id,
    email:         u.email,
    role:          u.role,
    name:          u.full_name || u.name || '',
    businessGroup: u.business_group  || '',
    employeeId:    u.employee_id    || '',
    account:       u.account        || '',
    createdAt:     u.created_at,
  };
}

export async function ensureAdminUser(passwordHash) {
  const rows = await query("SELECT * FROM users WHERE email = 'admin@sdlc.com'");
  if (rows.length === 0) {
    try {
      await query(
        `INSERT INTO users (id, email, password, password_hash, role, name, full_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['admin_user', 'admin@sdlc.com', passwordHash, passwordHash, 'admin', 'System Administrator', 'System Administrator']
      );
    } catch {
      await query(
        `INSERT INTO users (id, email, password_hash, role, full_name)
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin_user', 'admin@sdlc.com', passwordHash, 'admin', 'System Administrator']
      );
    }
    return { id: 'admin_user', email: 'admin@sdlc.com', role: 'admin', name: 'System Administrator' };
  }
  const row = rows[0];
  if (!row.password_hash && passwordHash) {
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, row.id]).catch(() => {});
  }
  return { id: row.id, email: row.email, role: row.role, name: row.full_name || row.name || '' };
}

export async function updateUserProfile(userId, name) {
  try {
    await query('UPDATE users SET name = $1, full_name = $1, updated_at = NOW() WHERE id = $2', [name, userId]);
  } catch {
    await query('UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2', [name, userId]);
  }
  return getUserById(userId);
}

// ASSESSMENT METHODS
export async function getAssessments(userId = null) {
  const rows = userId
    ? await query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId])
    : await query('SELECT * FROM assessments ORDER BY created_at DESC');
  return rows.map(parseAssessmentRow);
}

export async function getAssessmentById(id) {
  const rows = await query('SELECT * FROM assessments WHERE id = $1', [id]);
  if (rows.length === 0) return null;
  return parseAssessmentRow(rows[0]);
}

export async function saveAssessment(assessmentData) {
  const id = assessmentData.id || 'asm_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const existing = await query('SELECT id FROM assessments WHERE id = $1', [id]);

  const answers      = JSON.stringify(assessmentData.answers  || {});
  const scores       = JSON.stringify(assessmentData.scores   || {});
  const feedback     = JSON.stringify(assessmentData.feedback || null);
  const overallScore = parseInt(assessmentData.overallScore   || 0);
  const framework    = assessmentData.framework || 'SDLC';

  if (existing.length > 0) {
    await query(`
      UPDATE assessments
      SET user_id=$1, user_email=$2, project_name=$3, framework=$4, answers=$5::jsonb,
          scores=$6::jsonb, overall_score=$7, remarks=$8, remarks_provider=$9,
          feedback=$10::jsonb, updated_at=NOW()
      WHERE id=$11
    `, [
      assessmentData.userId || assessmentData.user_id,
      assessmentData.userEmail || assessmentData.user_email || '',
      assessmentData.projectName || assessmentData.project_name || '',
      framework, answers, scores, overallScore,
      assessmentData.remarks || null,
      assessmentData.remarksProvider || assessmentData.remarks_provider || null,
      feedback, id
    ]);
  } else {
    await query(`
      INSERT INTO assessments
        (id, user_id, user_email, project_name, framework, answers, scores, overall_score,
         remarks, remarks_provider, feedback)
      VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9,$10,$11::jsonb)
    `, [
      id,
      assessmentData.userId || assessmentData.user_id,
      assessmentData.userEmail || assessmentData.user_email || '',
      assessmentData.projectName || assessmentData.project_name || '',
      framework, answers, scores, overallScore,
      assessmentData.remarks || null,
      assessmentData.remarksProvider || assessmentData.remarks_provider || null,
      feedback
    ]);
  }
  return getAssessmentById(id);
}

function parseAssessmentRow(row) {
  const scores = typeof row.scores === 'string' ? JSON.parse(row.scores || '{}') : (row.scores || {});
  let overallScore = row.overall_score != null ? parseInt(row.overall_score) : null;
  if (overallScore == null) {
    const vals = Object.values(scores);
    const avg  = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    overallScore = Math.round((avg / 5) * 100);
  }
  return {
    id:              row.id,
    userId:          row.user_id,
    userEmail:       row.user_email,
    projectName:     row.project_name,
    framework:       row.framework || 'SDLC',
    answers:         typeof row.answers  === 'string' ? JSON.parse(row.answers  || '{}') : (row.answers  || {}),
    scores,
    overallScore,
    remarks:         row.remarks,
    remarksProvider: row.remarks_provider,
    feedback:        typeof row.feedback === 'string' ? JSON.parse(row.feedback || 'null') : (row.feedback || null),
    createdAt:       row.created_at,
    updatedAt:       row.updated_at
  };
}

// FEEDBACK METHODS
export async function getFeedback() {
  return query('SELECT * FROM feedback ORDER BY created_at DESC');
}

export async function saveFeedback(feedbackData) {
  const id = 'fb_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  // UPSERT: one feedback per user per assessment (enforced by DB UNIQUE constraint)
  await query(
    `INSERT INTO feedback (id, assessment_id, user_id, user_email, rating, comments)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (assessment_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating,
                   comments = EXCLUDED.comments,
                   updated_at = NOW()`,
    [id, feedbackData.assessmentId, feedbackData.userId,
     feedbackData.userEmail || '',
     feedbackData.rating, feedbackData.comments || '']
  );
  return {
    id,
    assessmentId: feedbackData.assessmentId,
    userId:       feedbackData.userId,
    userEmail:    feedbackData.userEmail,
    rating:       feedbackData.rating,
    comments:     feedbackData.comments,
    createdAt:    new Date().toISOString()
  };
}

// QUESTION METHODS
export async function getQuestions(framework = null) {
  const rows = framework
    ? await query('SELECT * FROM questions WHERE framework = $1 ORDER BY id ASC', [framework.toUpperCase()])
    : await query('SELECT * FROM questions ORDER BY id ASC');
  return rows.map(row => ({
    id:           row.id,
    framework:    row.framework || 'SDLC',
    area:         row.area,
    subArea:      row.sub_area,
    practice:     row.practice,
    type:         row.type,
    questionText: row.question_text
  }));
}

export async function saveQuestion(questionData) {
  const framework = (questionData.framework || 'SDLC').toUpperCase();
  if (questionData.id) {
    const existing = await query('SELECT id FROM questions WHERE id = $1', [questionData.id]);
    if (existing.length > 0) {
      await query(
        `UPDATE questions
         SET area=$1, sub_area=$2, practice=$3, question_type=$4, type=$4, question_text=$5, updated_at=NOW()
         WHERE id=$6`,
        [questionData.area, questionData.subArea, questionData.practice,
         questionData.type || 'extent', questionData.questionText, questionData.id]
      );
      return true;
    }
  }
  // DB-level unique constraint will throw 23505 on true duplicate
  await query(
    `INSERT INTO questions (framework, area, sub_area, practice, question_type, type, question_text)
     VALUES ($1,$2,$3,$4,$5,$5,$6)`,
    [framework, questionData.area, questionData.subArea, questionData.practice,
     questionData.type || 'extent', questionData.questionText]
  );
  return true;
}

export async function deleteQuestion(id) {
  const rows = await query('DELETE FROM questions WHERE id = $1 RETURNING id', [parseInt(id)]);
  return rows.length > 0;
}

// SETTINGS METHODS
export async function getSettings() {
  const rows = await query('SELECT * FROM settings WHERE id = 1');
  const row  = rows[0] || null;

  const apiKeys      = row ? (typeof row.api_keys      === 'string' ? JSON.parse(row.api_keys      || '{}') : (row.api_keys      || {})) : { openai: '', gemini: '', claude: '' };
  const apiEndpoints = row ? (typeof row.api_endpoints === 'string' ? JSON.parse(row.api_endpoints || '{}') : (row.api_endpoints || {})) : { openai: '', gemini: '', claude: '', ollama: '' };

  const activeAIProvider =
    process.env.ACTIVE_AI_PROVIDER ||
    (row ? row.active_ai_provider : null) ||
    'expert';

  if (process.env.OPENAI_API_KEY) apiKeys.openai = process.env.OPENAI_API_KEY;
  if (process.env.GEMINI_API_KEY) apiKeys.gemini = process.env.GEMINI_API_KEY;
  if (process.env.CLAUDE_API_KEY) apiKeys.claude = process.env.CLAUDE_API_KEY;

  return {
    activeAIProvider,
    apiKeys,
    ollamaUrl:   (row ? row.ollama_url   : null) || process.env.OLLAMA_URL   || 'http://localhost:11434',
    ollamaModel: (row ? row.ollama_model : null) || process.env.OLLAMA_MODEL || 'llama3',
    apiEndpoints,
  };
}

export async function updateSettings(settingsData) {
  const current = await getSettings();
  const merged  = { ...current, ...settingsData };
  const apiKeys      = JSON.stringify(merged.apiKeys      || { openai: '', gemini: '', claude: '' });
  const apiEndpoints = JSON.stringify(merged.apiEndpoints || { openai: '', gemini: '', claude: '', ollama: '' });

  await query(`
    INSERT INTO settings (id, active_ai_provider, api_keys, ollama_url, ollama_model, api_endpoints)
    VALUES (1, $1, $2::jsonb, $3, $4, $5::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      active_ai_provider = EXCLUDED.active_ai_provider,
      api_keys           = EXCLUDED.api_keys,
      ollama_url         = EXCLUDED.ollama_url,
      ollama_model       = EXCLUDED.ollama_model,
      api_endpoints      = EXCLUDED.api_endpoints
  `, [
    merged.activeAIProvider || 'ollama',
    apiKeys,
    merged.ollamaUrl  || 'http://localhost:11434',
    merged.ollamaModel || 'llama3',
    apiEndpoints
  ]);
  return getSettings();
}

export async function updateAssessmentRemarks(id, remarks, provider) {
  await query(
    'UPDATE assessments SET remarks = $1, remarks_provider = $2 WHERE id = $3',
    [remarks, provider || 'AI', id]
  );
  return getAssessmentById(id);
}

// ASSESSMENT REPORT METHODS
export async function createReport(assessmentId, promptVersion = 'v1.0') {
  const rows = await query(`
    INSERT INTO assessment_reports (assessment_id, generation_status, prompt_version)
    VALUES ($1, 'pending', $2)
    RETURNING *
  `, [assessmentId, promptVersion]);
  return parseReportRow(rows[0]);
}

export async function updateReport(reportId, updates) {
  const allowed = ['generation_status', 'report_json', 'provider', 'model', 'prompt_version'];
  const fields  = Object.keys(updates).filter(k => allowed.includes(k));
  if (fields.length === 0) return getReportById(reportId);

  const setClauses = fields.map((f, i) => f + ' = $' + (i + 1)).join(', ');
  const values = fields.map(f => {
    const v = updates[f];
    return (f === 'report_json' && typeof v === 'object') ? JSON.stringify(v) : v;
  });
  values.push(reportId);

  const rows = await query(
    'UPDATE assessment_reports SET ' + setClauses + ', updated_at = NOW() WHERE id = $' + values.length + ' RETURNING *',
    values
  );
  return rows.length > 0 ? parseReportRow(rows[0]) : getReportById(reportId);
}

export async function getLatestReport(assessmentId) {
  const rows = await query(`
    SELECT * FROM assessment_reports
    WHERE assessment_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `, [assessmentId]);
  if (rows.length === 0) return null;
  return parseReportRow(rows[0]);
}

export async function getReportById(reportId) {
  const rows = await query('SELECT * FROM assessment_reports WHERE id = $1', [reportId]);
  if (rows.length === 0) return null;
  return parseReportRow(rows[0]);
}

function parseReportRow(row) {
  return {
    id:               row.id,
    assessmentId:     row.assessment_id,
    provider:         row.provider,
    model:            row.model,
    promptVersion:    row.prompt_version,
    reportJson:       typeof row.report_json === 'string' ? JSON.parse(row.report_json || 'null') : (row.report_json || null),
    generationStatus: row.generation_status,
    createdAt:        row.created_at,
    updatedAt:        row.updated_at,
  };
}
