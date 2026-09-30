'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

const AMS_AREAS = [
  { name: 'Service Management',  color: '#4f46e5', desc: 'AI-driven SLA monitoring and alerting before breaches occur, automated self-service request fulfilment, and proactive service catalogue governance.' },
  { name: 'Incident Management', color: '#dc2626', desc: 'Automated incident triage and classification, runbook execution and self-healing remediation, escalation intelligence, and real-time impact scoring.' },
  { name: 'Change Management',   color: '#ea580c', desc: 'AI change risk scoring and conflict detection, automated blast radius prediction, downstream impact analysis, and approval workflow automation.' },
  { name: 'Problem Management',  color: '#9333ea', desc: 'AI-assisted root cause analysis, predictive anomaly detection, structured problem resolution, and proactive problem identification from telemetry.' },
  { name: 'Release Management',  color: '#059669', desc: 'AI-powered release gate assessment, end-to-end pipeline orchestration, go/no-go recommendation engine, and automated release readiness scoring.' },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional',          color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1', desc: 'Entirely manual operations. No AI tools embedded in service or incident workflows.' },
  { label: 'L1', title: 'Assisted / Tool',       color: '#dc2626', bg: '#fee2e2', border: '#fecaca', desc: 'Basic AI chatbots, knowledge base search, and ad-hoc ticket classification.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', desc: 'AI assists with triage, drafts RCA reports, and classifies incidents under human review.' },
  { label: 'L3', title: 'Supervised Agent',      color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: 'AI agents execute runbooks and orchestrate multi-step remediation with human approval gates.' },
  { label: 'L4', title: 'Autonomous Workforce',  color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', desc: 'Agents handle known incidents end-to-end with automated rollback and safety guardrails.' },
  { label: 'L5', title: 'Agentic Enterprise',    color: '#166534', bg: '#dcfce7', border: '#bbf7d0', desc: 'Self-healing operations, predictive problem prevention, and fully autonomous release pipelines.' },
];

function getAMSDomainDiagram(name) {
  switch (name) {
    case 'Service Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="80" cy="75" r="28" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="80" cy="75" r="28" stroke="#4F46E5" strokeWidth="4" strokeDasharray="120 55" strokeDashoffset="40" />
          <text x="80" y="72" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#4F46E5" textAnchor="middle">SLA</text>
          <text x="80" y="82" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">98.5%</text>
          <rect x="125" y="32" width="72" height="18" rx="4" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.2" />
          <circle cx="134" cy="41" r="4" fill="#4F46E5" />
          <rect x="143" y="38" width="45" height="4" rx="2" fill="#CBD5E1" />
          <rect x="125" y="56" width="72" height="18" rx="4" fill="#E2E8F0" />
          <circle cx="134" cy="65" r="4" fill="#059669" />
          <rect x="143" y="62" width="38" height="4" rx="2" fill="#CBD5E1" />
          <rect x="125" y="80" width="72" height="18" rx="4" fill="#E2E8F0" />
          <circle cx="134" cy="89" r="4" fill="#D97706" />
          <rect x="143" y="86" width="52" height="4" rx="2" fill="#CBD5E1" />
          <rect x="125" y="104" width="72" height="12" rx="3" fill="#E2E8F0" />
          <rect x="143" y="108" width="30" height="4" rx="2" fill="#CBD5E1" />
        </svg>
      );
    case 'Incident Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M55 100L85 40L115 100H55Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" />
          <text x="85" y="83" fontFamily="var(--font-heading)" fontSize="14" fontWeight="900" fill="#DC2626" textAnchor="middle">!</text>
          <text x="85" y="97" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#DC2626" textAnchor="middle">P1</text>
          <rect x="130" y="38" width="68" height="16" rx="4" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.2" />
          <text x="164" y="49" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#DC2626" textAnchor="middle">TRIAGE</text>
          <path d="M164 54V62" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="130" y="62" width="68" height="16" rx="4" fill="#E2E8F0" />
          <text x="164" y="73" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">CLASSIFY</text>
          <path d="M164 78V86" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="130" y="86" width="68" height="16" rx="4" fill="#E2E8F0" />
          <text x="164" y="97" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">ROUTE</text>
          <path d="M164 102V110" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="130" y="110" width="68" height="12" rx="3" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="164" y="119" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">RESOLVED</text>
        </svg>
      );
    case 'Change Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="38" y="55" width="80" height="10" rx="5" fill="#E2E8F0" />
          <rect x="38" y="55" width="52" height="10" rx="5" fill="#EA580C" />
          <text x="78" y="42" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#EA580C" textAnchor="middle">RISK SCORE</text>
          <text x="78" y="51" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#64748B" textAnchor="middle">Medium</text>
          <rect x="38" y="76" width="80" height="36" rx="5" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.2" />
          <text x="78" y="91" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#EA580C" textAnchor="middle">CHANGE REQUEST</text>
          <rect x="48" y="95" width="60" height="4" rx="2" fill="#CBD5E1" />
          <rect x="48" y="102" width="40" height="4" rx="2" fill="#CBD5E1" />
          <path d="M148 70L165 55L182 70" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="140" y="70" width="45" height="20" rx="4" fill="#E2E8F0" />
          <text x="162" y="83" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">CAB Review</text>
          <path d="M162 90V100" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="140" y="100" width="45" height="18" rx="4" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="162" y="112" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">APPROVED</text>
        </svg>
      );
    case 'Problem Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="120" cy="35" r="10" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.5" />
          <text x="120" y="39" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#9333EA" textAnchor="middle">RCA</text>
          <path d="M120 45V57" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M90 57H150" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M90 57V65" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M120 57V65" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M150 57V65" stroke="#9333EA" strokeWidth="1.5" />
          <rect x="68" y="65" width="44" height="18" rx="4" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.2" />
          <text x="90" y="77" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#9333EA" textAnchor="middle">DB Conn</text>
          <rect x="98" y="65" width="44" height="18" rx="4" fill="#E2E8F0" />
          <text x="120" y="77" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">Network</text>
          <rect x="128" y="65" width="44" height="18" rx="4" fill="#E2E8F0" />
          <text x="150" y="77" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#64748B" textAnchor="middle">Memory</text>
          <rect x="68" y="100" width="104" height="20" rx="5" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="120" y="113" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">Root Cause Identified ✓</text>
        </svg>
      );
    case 'Release Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="35" y="52" width="36" height="26" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="53" y="65" fontFamily="var(--font-heading)" fontSize="6.5" fontWeight="700" fill="#059669" textAnchor="middle">BUILD</text>
          <circle cx="53" cy="72" r="4" fill="#059669" />
          <path d="M71 65H82" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="83" y="52" width="36" height="26" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="101" y="65" fontFamily="var(--font-heading)" fontSize="6.5" fontWeight="700" fill="#059669" textAnchor="middle">TEST</text>
          <circle cx="101" cy="72" r="4" fill="#059669" />
          <path d="M119 65H130" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="131" y="52" width="36" height="26" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          <text x="149" y="63" fontFamily="var(--font-heading)" fontSize="5.5" fontWeight="700" fill="#D97706" textAnchor="middle">GATE</text>
          <text x="149" y="72" fontFamily="var(--font-heading)" fontSize="5.5" fontWeight="700" fill="#D97706" textAnchor="middle">CHECK</text>
          <path d="M167 65H178" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="179" y="52" width="30" height="26" rx="4" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="194" y="65" fontFamily="var(--font-heading)" fontSize="5.5" fontWeight="700" fill="#166534" textAnchor="middle">PROD</text>
          <rect x="60" y="100" width="120" height="18" rx="5" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="120" y="112" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#059669" textAnchor="middle">v2.4.1 — RELEASED ✓</text>
        </svg>
      );
    default:
      return null;
  }
}

export default function AMSPage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '36px' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderTop: '4px solid #4f46e5',
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
          background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.12) 0%, rgba(30, 64, 175, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Framework Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: '#e0e7ff',
          border: '1px solid #c7d2fe',
          color: '#4f46e5',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em',
          marginBottom: '20px',
        }}>
          <span className="material-icons" style={{ fontSize: '1rem' }}>support_agent</span>
          FRAMEWORK 2 — AMS INTELLIGENCE
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
          Application Management Services<br />
          <span style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #1e40af 100%)',
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
          A focused <strong style={{ color: '#4f46e5' }}>10-question audit</strong> across 5 operations domains — measuring how deeply AI is embedded in your organisation&apos;s service management, incident response, change control, problem resolution, and release orchestration.
        </p>

        {/* CTA Group */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {user ? (
            <Link href="/assessment?framework=AMS" className="btn-cta-amber" style={{ fontSize: '0.98rem', padding: '14px 32px' }}>
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
              Start AMS Assessment →
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-cta-amber" style={{ fontSize: '0.98rem', padding: '14px 32px' }}>
                <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
                Get Started Free →
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
            <span className="material-icons" style={{ color: '#4f46e5', fontSize: '1.1rem' }}>check_circle</span>
            10 Questions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#1e40af', fontSize: '1.1rem' }}>check_circle</span>
            5 Operations Domains
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#0284c7', fontSize: '1.1rem' }}>check_circle</span>
            L0–L5 Maturity Scale
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#d97706', fontSize: '1.1rem' }}>check_circle</span>
            AI Powered Analysis
          </div>
        </div>
      </section>

      {/* ── 5 Operations Domains ───────────────────────────────────────────── */}
      <section id="domains" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            5 Operations Domains
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        <div className="row g-4">
          {AMS_AREAS.map((area, idx) => (
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
                <div style={{ width: '100%', height: '140px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                  {getAMSDomainDiagram(area.name)}
                </div>

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="material-icons" style={{ color: area.color, fontSize: '1.2rem' }}>{area.icon}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{area.name}</h3>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>{area.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Maturity Scale ─────────────────────────────────────────────── */}
      <section id="maturity" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            AI Maturity Scale
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
        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
        borderRadius: '20px',
        padding: '48px 36px',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(79, 70, 229, 0.25)',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
          Ready to benchmark your operations team?
        </h2>
        <p style={{ maxWidth: '620px', margin: '0 auto 28px', color: '#c7d2fe', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete the 10-question AMS assessment to receive your personalised AI maturity report with domain-level scores and targeted recommendations for your operations team.
        </p>
        <Link
          href={user ? '/assessment?framework=AMS' : '/signup'}
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
          {user ? 'Start Assessment →' : 'Get Started Free →'}
        </Link>
      </section>

    </div>
  );
}
