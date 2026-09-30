'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

const AREAS = [
  {
    name: 'Requirements',
    color: '#166534',
    icon: 'checklist',
    badge: 'STAGE 1',
    desc: 'AI-assisted requirements synthesis, user story decomposition, bidirectional traceability, acceptance criteria generation, and automated impact analysis.',
    capabilities: ['User story decomposition', 'Acceptance criteria synthesis', 'Impact & dependency analysis'],
  },
  {
    name: 'Architecture',
    color: '#1e40af',
    icon: 'account_tree',
    badge: 'STAGE 2',
    desc: 'Automated architectural drift detection, synthetic C4 diagram generation, Architectural Decision Records (ADR) creation, and FinOps cloud modeling.',
    capabilities: ['C4 architecture diagramming', 'ADR synthesis & governance', 'PR drift detection'],
  },
  {
    name: 'Development',
    color: '#0284c7',
    icon: 'code',
    badge: 'STAGE 3',
    desc: 'Context-aware AI coding assistants, agentic pull requests, automated refactoring, Model Context Protocol (MCP) integrations, and code review bots.',
    capabilities: ['Autonomous PR drafting', 'MCP tool orchestration', 'Contextual code synthesis'],
  },
  {
    name: 'Testing',
    color: '#d97706',
    icon: 'science',
    badge: 'STAGE 4',
    desc: 'Self-healing test suites, automated E2E test script generation, synthetic test data synthesizers, defect triage, and automated vulnerability simulation.',
    capabilities: ['Self-healing test runs', 'Synthetic data generation', 'Defect triage & scoring'],
  },
  {
    name: 'Deployment',
    color: '#7c3aed',
    icon: 'rocket_launch',
    badge: 'STAGE 5',
    desc: 'Canary pipeline orchestration, AI-driven log telemetry inspection, release risk scoring, automated release notes, and autonomous CI/CD quality gates.',
    capabilities: ['Canary telemetry analysis', 'Automated release gates', 'Release notes & changelogs'],
  },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1', desc: 'Completely manual workflows with no standardized AI tool integration or automation.' },
  { label: 'L1', title: 'Assisted / Tool', color: '#dc2626', bg: '#fee2e2', border: '#fecaca', desc: 'Basic inline autocomplete, chat assistance, and ad-hoc individual AI tool experimentation.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', desc: 'AI acts as supervised copilot drafting code, analyses, and tickets under human review.' },
  { label: 'L3', title: 'Supervised Agent', color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: 'Autonomous AI agents orchestrate multi-step tasks bounded by human verification gates.' },
  { label: 'L4', title: 'Autonomous Workforce', color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', desc: 'High-trust autonomous execution, automated safety nets, evaluation metrics, and guardrails.' },
  { label: 'L5', title: 'Agentic Enterprise', color: '#166534', bg: '#dcfce7', border: '#bbf7d0', desc: 'Self-optimizing delivery loops, automated drift remediation, and fully autonomous operations.' },
];

function getDomainDiagram(name) {
  switch (name) {
    case 'Requirements':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="40" y="28" width="68" height="8" rx="3" fill="#166534" fillOpacity="0.15" />
          <path d="M40 28H85" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
          <circle cx="46" cy="48" r="5" fill="#DCFCE7" stroke="#166534" strokeWidth="1.5" />
          <path d="M43 48L45 50L49 46" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="58" y="45" width="140" height="6" rx="2" fill="#E2E8F0" />
          <circle cx="46" cy="68" r="5" fill="#DCFCE7" stroke="#166534" strokeWidth="1.5" />
          <path d="M43 68L45 70L49 66" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="58" y="65" width="125" height="6" rx="2" fill="#E2E8F0" />
          <circle cx="46" cy="88" r="5" fill="#E2E8F0" />
          <rect x="58" y="85" width="105" height="6" rx="2" fill="#E2E8F0" />
          <text x="145" y="34" fontFamily="var(--font-heading)" fontSize="9" fontWeight="700" fill="#166534">SYNTHESIS</text>
        </svg>
      );
    case 'Architecture':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="38" y="50" width="46" height="28" rx="6" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="1.5" />
          <text x="61" y="67" fontFamily="var(--font-heading)" fontSize="9" fontWeight="700" fill="#1E40AF" textAnchor="middle">API</text>
          <path d="M84 64H106" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M103 61L106 64L103 67" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="106" y="32" width="48" height="26" rx="5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="130" y="48" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#475569" textAnchor="middle">GATEWAY</text>
          <rect x="106" y="70" width="48" height="26" rx="5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="130" y="86" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#475569" textAnchor="middle">SERVICE</text>
          <path d="M154 45H172V58" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M154 83H172V72" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="162" y="54" width="34" height="22" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="1.5" />
          <text x="179" y="68" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#1E40AF" textAnchor="middle">DATA</text>
        </svg>
      );
    case 'Development':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M25 21C25 17.6863 27.6863 15 31 15H209C212.314 15 215 17.6863 215 21V30H25V21Z" fill="#F1F5F9" />
          <circle cx="35" cy="22" r="3" fill="#EF4444" />
          <circle cx="45" cy="22" r="3" fill="#F59E0B" />
          <circle cx="55" cy="22" r="3" fill="#166534" />
          <text x="70" y="25" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#64748B">agent_copilot.ts</text>
          <path d="M45 42V102" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="52" r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M45 52C55 52 60 62 65 67V82C60 87 55 94 45 94" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <circle cx="65" cy="74" r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="85" y="44" width="95" height="6" rx="2" fill="#E0F2FE" />
          <rect x="85" y="56" width="65" height="6" rx="2" fill="#E2E8F0" />
          <rect x="85" y="68" width="80" height="6" rx="2" fill="#E0F2FE" />
          <rect x="85" y="80" width="110" height="6" rx="2" fill="#E2E8F0" />
          <rect x="85" y="92" width="45" height="6" rx="2" fill="#E2E8F0" />
        </svg>
      );
    case 'Testing':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="38" y="28" width="80" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <text x="78" y="41" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#D97706" textAnchor="middle">TEST SUITE ✓</text>
          <circle cx="165" cy="52" r="22" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="165" cy="52" r="22" stroke="#D97706" strokeWidth="4" strokeDasharray="110 30" strokeDashoffset="25" />
          <text x="165" y="56" fontFamily="var(--font-heading)" fontSize="9" fontWeight="800" fill="#0F172A" textAnchor="middle">98.4%</text>
          <rect x="38" y="58" width="46" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="46" cy="67" r="4" fill="#166534" />
          <text x="54" y="70" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Unit</text>
          <rect x="90" y="58" width="46" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="98" cy="67" r="4" fill="#166534" />
          <text x="106" y="70" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">E2E</text>
          <rect x="38" y="82" width="46" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="46" cy="91" r="4" fill="#166534" />
          <text x="54" y="94" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Regr</text>
          <rect x="90" y="82" width="46" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="98" cy="91" r="4" fill="#166534" />
          <text x="106" y="94" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Sec</text>
        </svg>
      );
    case 'Deployment':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="42" y="65" width="58" height="28" rx="5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="52" y="72" width="38" height="4" rx="2" fill="#94A3B8" />
          <circle cx="56" cy="83" r="2.5" fill="#166534" />
          <circle cx="64" cy="83" r="2.5" fill="#166534" />
          <path d="M145 80C145 80 135 60 150 42C160 60 150 80 150 80" fill="#7C3AED" />
          <path d="M155 80C155 80 165 60 150 42C140 60 150 80 150 80" fill="#7C3AED" />
          <path d="M150 37L155 47H145L150 37Z" fill="#D97706" />
          <circle cx="150" cy="56" r="3" fill="#FFFFFF" />
          <path d="M104 78H128" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M125 75L128 78L125 81" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
          <text x="150" y="96" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#7C3AED" textAnchor="middle">AUTOMATED GATE</text>
        </svg>
      );
    default:
      return null;
  }
}

export default function SDLCPage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '36px' }}>

      {/* ── Hero Section (UI/UX Pro Max Enterprise Standard) ──────────────── */}
      <section style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderTop: '4px solid #166534',
        borderRadius: '20px',
        padding: '56px 36px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        textAlign: 'center',
      }}>
        {/* Subtle Ambient Brand Glow */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '640px', height: '320px',
          background: 'radial-gradient(ellipse at center, rgba(22, 101, 52, 0.12) 0%, rgba(30, 64, 175, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Framework Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#166534',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em',
          marginBottom: '20px',
        }}>
          <span className="material-icons" style={{ fontSize: '1rem' }}>developer_mode</span>
          FRAMEWORK 1 · SDLC INTELLIGENCE
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '18px',
          color: '#0f172a',
        }}>
          Software Delivery Lifecycle<br />
          <span style={{
            background: 'linear-gradient(135deg, #166534 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AI Maturity Assessment
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          maxWidth: '720px',
          margin: '0 auto 32px',
          color: '#475569',
          fontSize: '1.05rem',
          lineHeight: 1.75,
          fontWeight: 500,
        }}>
          A rigorous <strong style={{ color: '#166534' }}>120-question audit</strong> spanning all 5 software delivery phases. Evaluate your team's autonomous agent adoption, code synthesis maturity, and automated quality gates against industry benchmarks.
        </p>

        {/* CTA Group */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {user ? (
            <Link href="/assessment?framework=SDLC" className="btn-cta-amber" style={{ fontSize: '0.98rem', padding: '14px 32px' }}>
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
              Start SDLC Assessment →
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-cta-amber" style={{ fontSize: '0.98rem', padding: '14px 32px' }}>
                <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
                Start Free Assessment →
              </Link>
              <Link href="/login" className="btn-secondary-action" style={{ fontSize: '0.98rem', padding: '14px 32px' }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Quick Proof Metrics Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          color: '#64748b',
          fontSize: '0.84rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#166534', fontSize: '1.1rem' }}>check_circle</span>
            120 Evaluated Practices
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#1e40af', fontSize: '1.1rem' }}>check_circle</span>
            5 Engineering Domains
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#0284c7', fontSize: '1.1rem' }}>check_circle</span>
            L0 → L5 Deterministic Rubric
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#d97706', fontSize: '1.1rem' }}>check_circle</span>
            Instant Spider Chart Radar
          </div>
        </div>
      </section>

      {/* ── 5 Engineering Domains ─────────────────────────────────────────── */}
      <section id="domains" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            The 5 Core Engineering Domains
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        <div className="row g-4">
          {AREAS.map((area, idx) => (
            <div className="col-lg col-md-6 col-12" key={idx}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTop: `3px solid ${area.color}`,
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${area.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
              >
                {/* SVG Illustration Container */}
                <div style={{ width: '100%', height: '130px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {getDomainDiagram(area.name)}
                </div>

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: area.color, fontFamily: 'var(--font-heading)', background: `${area.color}12`, padding: '2px 8px', borderRadius: '4px' }}>
                      {area.badge}
                    </span>
                    <span className="material-icons" style={{ color: area.color, fontSize: '1.2rem' }}>{area.icon}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>{area.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px', flexGrow: 1 }}>{area.desc}</p>

                  <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '12px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {area.capabilities.map((c, ci) => (
                      <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#64748b' }}>
                        <span className="material-icons" style={{ fontSize: '0.9rem', color: area.color }}>check</span>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Maturity Progression Scale (L0 → L5) ───────────────────────── */}
      <section id="maturity" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            SDLC AI Maturity Rubric (L0 → L5)
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        <div className="row g-3">
          {LEVELS.map((lvl, idx) => (
            <div className="col-lg-4 col-md-6 col-12" key={idx}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${lvl.color}`,
                borderRadius: '12px',
                padding: '18px 20px',
                height: '100%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: lvl.color,
                    background: lvl.bg,
                    border: `1px solid ${lvl.border}`,
                    borderRadius: '6px',
                    padding: '2px 8px',
                  }}>
                    {lvl.label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>{lvl.title}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{lvl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing Conversion Banner ─────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
        borderRadius: '20px',
        padding: '48px 36px',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(22, 101, 52, 0.25)',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
          Ready to Benchmark Your Engineering Team?
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 28px', color: '#bbf7d0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete the 120-question SDLC assessment to receive your personalized radar spider chart, maturity rating, and gap remediation roadmap.
        </p>
        <Link
          href={user ? '/assessment?framework=SDLC' : '/signup'}
          style={{
            background: '#d97706',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 32px',
            fontSize: '0.98rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = '#b45309'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#d97706'; }}
        >
          <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
          {user ? 'Start SDLC Assessment →' : 'Launch Free Assessment →'}
        </Link>
      </section>

    </div>
  );
}
