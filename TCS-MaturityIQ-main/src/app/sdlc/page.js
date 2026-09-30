'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

const AREAS = [
  { name: 'Requirements', color: '#166534', icon: 'checklist', desc: 'AI-powered idea exploration, backlog refinement, bidirectional traceability, and impact analysis across the full requirements lifecycle.' },
  { name: 'Architecture', color: '#1e40af', icon: 'account_tree', desc: 'Architecture synthesisers, automated diagram generation, PR drift detection, compliance advisors, and FinOps modelling.' },
  { name: 'Development',  color: '#0284c7', icon: 'code', desc: 'AI coding assistants in agent mode, agentic pull requests, custom MCP scripts, orchestrator/sub-agent architecture, and dependency mapping.' },
  { name: 'Testing',      color: '#d97706', icon: 'science', desc: 'E2E workflow automation, synthetic test data creation, defect triaging, test script generation, and vulnerability simulation.' },
  { name: 'Deployment',   color: '#7c3aed', icon: 'rocket_launch', desc: 'Automated release notes, capacity prediction, self-healing systems, CI/CD quality gates, and pipeline creation using AI.' },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional',          color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1', desc: 'Entirely manual workflows. No AI tools integrated into engineering processes.' },
  { label: 'L1', title: 'Assisted / Tool',       color: '#dc2626', bg: '#fee2e2', border: '#fecaca', desc: 'Basic inline autocomplete, chat assistants, and ad-hoc AI scripts.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', desc: 'AI acts as copilot — opening PRs, drafting specs, reviewing code under supervision.' },
  { label: 'L3', title: 'Supervised Agent',      color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: 'AI agents orchestrate multi-step refactoring or test runs with human approval gates.' },
  { label: 'L4', title: 'Autonomous Workforce',  color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', desc: 'Automated safety nets, autonomous task execution over days, and structured evals.' },
  { label: 'L5', title: 'Agentic Enterprise',    color: '#166534', bg: '#dcfce7', border: '#bbf7d0', desc: 'Self-healing production systems, automatic drift remediation, fully autonomous CI/CD workflows.' },
];

function getDomainDiagram(name) {
  switch (name) {
    case 'Requirements':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="40" y="35" width="60" height="8" rx="2" fill="#166534" fillOpacity="0.15" />
          <path d="M40 35H100" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="55" r="5" fill="#E2E8F0" />
          <path d="M42 55L44 57L48 53" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="60" y="52" width="135" height="6" rx="2" fill="#E2E8F0" />
          <circle cx="45" cy="75" r="5" fill="#E2E8F0" />
          <path d="M42 75L44 77L48 73" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="60" y="72" width="120" height="6" rx="2" fill="#E2E8F0" />
          <circle cx="45" cy="95" r="5" fill="#E2E8F0" />
          <rect x="60" y="92" width="100" height="6" rx="2" fill="#E2E8F0" />
          <text x="140" y="42" fontFamily="var(--font-heading)" fontSize="10" fontWeight="700" fill="#166534">BACKLOG</text>
        </svg>
      );
    case 'Architecture':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="40" y="55" width="45" height="30" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="1.5" />
          <text x="62" y="73" fontFamily="var(--font-heading)" fontSize="9" fontWeight="700" fill="#1E40AF" textAnchor="middle">API</text>
          <path d="M85 70H110" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M107 67L110 70L107 73" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="110" y="35" width="45" height="30" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="132" y="53" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#64748B" textAnchor="middle">API GW</text>
          <rect x="110" y="75" width="45" height="30" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="132" y="93" fontFamily="var(--font-heading)" fontSize="8" fontWeight="600" fill="#64748B" textAnchor="middle">Service</text>
          <path d="M155 50H175V60" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M155 90H175V80" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="165" y="60" width="30" height="20" rx="3" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="1.5" />
          <text x="180" y="72" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#1E40AF" textAnchor="middle">DB</text>
        </svg>
      );
    case 'Development':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M25 26C25 22.6863 27.6863 20 31 20H209C212.314 20 215 22.6863 215 26V35H25V26Z" fill="#F1F5F9" />
          <circle cx="35" cy="27" r="3" fill="#EF4444" />
          <circle cx="45" cy="27" r="3" fill="#F59E0B" />
          <circle cx="55" cy="27" r="3" fill="#166534" />
          <text x="70" y="30" fontFamily="var(--font-heading)" fontSize="8" fontWeight="500" fill="#64748B">main.js</text>
          <path d="M45 50V110" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="60" r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M45 60C55 60 60 70 65 75V95C60 100 55 110 45 110" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <circle cx="65" cy="85" r="4" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="85" y="50" width="100" height="6" rx="2" fill="#E0F2FE" />
          <rect x="85" y="62" width="70" height="6" rx="2" fill="#E2E8F0" />
          <rect x="85" y="74" width="85" height="6" rx="2" fill="#E0F2FE" />
          <rect x="85" y="86" width="115" height="6" rx="2" fill="#E2E8F0" />
          <rect x="85" y="98" width="50" height="6" rx="2" fill="#E2E8F0" />
        </svg>
      );
    case 'Testing':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="40" y="35" width="75" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <text x="77" y="47" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#D97706" textAnchor="middle">TEST PASSED</text>
          <circle cx="165" cy="55" r="20" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="165" cy="55" r="20" stroke="#D97706" strokeWidth="4" strokeDasharray="100 25" strokeDashoffset="25" />
          <text x="165" y="58" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#0F172A" textAnchor="middle">92%</text>
          <rect x="40" y="65" width="45" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="48" cy="74" r="4" fill="#166534" />
          <text x="56" y="77" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Unit</text>
          <rect x="90" y="65" width="45" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="98" cy="74" r="4" fill="#166534" />
          <text x="106" y="77" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">E2E</text>
          <rect x="40" y="90" width="45" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="48" cy="99" r="4" fill="#EF4444" />
          <text x="56" y="102" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Load</text>
          <rect x="90" y="90" width="45" height="18" rx="3" fill="#F1F5F9" />
          <circle cx="98" cy="99" r="4" fill="#166534" />
          <text x="106" y="102" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569">Sec</text>
        </svg>
      );
    case 'Deployment':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFFFF" />
          <rect x="25" y="20" width="190" height="100" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="50" y="75" width="60" height="30" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="60" y="82" width="40" height="4" rx="2" fill="#94A3B8" />
          <circle cx="63" cy="94" r="2" fill="#166534" />
          <circle cx="71" cy="94" r="2" fill="#166534" />
          <path d="M150 90C150 90 140 70 155 50C165 70 155 90 155 90" fill="#7C3AED" />
          <path d="M160 90C160 90 170 70 155 50C145 70 155 90 155 90" fill="#7C3AED" />
          <path d="M155 45L160 55H150L155 45Z" fill="#D97706" />
          <circle cx="155" cy="65" r="3" fill="#FFFFFF" />
          <path d="M110 90H135" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M132 87L135 90L132 93" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
          <text x="155" y="105" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#7C3AED" textAnchor="middle">PROD DEPLOY</text>
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

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
          FRAMEWORK 1 — SDLC INTELLIGENCE
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
          A comprehensive <strong style={{ color: '#166534' }}>120-question audit</strong> across 5 engineering domains — measuring how deeply AI is embedded in your team&apos;s software delivery practices, from requirements to production deployment.
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
            <span className="material-icons" style={{ color: '#166534', fontSize: '1.1rem' }}>check_circle</span>
            120 Questions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#1e40af', fontSize: '1.1rem' }}>check_circle</span>
            5 Engineering Domains
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

      {/* ── 5 Engineering Domains ─────────────────────────────────────────── */}
      <section id="domains" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            5 Engineering Domains
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
                <div style={{ width: '100%', height: '140px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                  {getDomainDiagram(area.name)}
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
        background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
        borderRadius: '20px',
        padding: '48px 36px',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(22, 101, 52, 0.25)',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
          Ready to benchmark your engineering team?
        </h2>
        <p style={{ maxWidth: '620px', margin: '0 auto 28px', color: '#bbf7d0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete the 120-question SDLC assessment to receive your personalised AI maturity report with domain-level scores and recommendations.
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
          {user ? 'Start Assessment →' : 'Get Started Free →'}
        </Link>
      </section>

    </div>
  );
}
