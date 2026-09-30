'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

const SDLC_AREAS = [
  { name: 'Requirements', color: '#166534', icon: 'checklist', desc: 'AI-assisted requirements synthesis, backlog refinement, impact analysis, and user story decomposition.' },
  { name: 'Architecture', color: '#1e40af', icon: 'account_tree', desc: 'Automated architectural drift detection, diagram synthesis, ADR generation, and compliance gates.' },
  { name: 'Development',  color: '#0284c7', icon: 'code', desc: 'Context-aware AI coding assistants, agentic pull requests, MCP integration, and code refactoring.' },
  { name: 'Testing',      color: '#d97706', icon: 'science', desc: 'Self-healing test suites, synthetic data synthesis, automated unit testing, and defect classification.' },
  { name: 'Deployment',   color: '#7c3aed', icon: 'rocket_launch', desc: 'Canary pipeline orchestration, AI-driven log telemetry analysis, and automated release gates.' },
];

const AMS_AREAS = [
  { name: 'Service Management',  color: '#4f46e5', icon: 'support_agent', desc: 'Proactive SLA anomaly detection, automated service catalog governance, and self-service fulfilment.' },
  { name: 'Incident Management', color: '#dc2626', icon: 'warning_amber', desc: 'Automated incident triage, AI-driven runbook execution, blast radius scoring, and MTTR reduction.' },
  { name: 'Change Management',   color: '#ea580c', icon: 'published_with_changes', desc: 'AI-assisted change risk prediction, conflict detection, blast radius assessment, and approval workflows.' },
  { name: 'Problem Management',  color: '#9333ea', icon: 'manage_search', desc: 'Automated root cause analysis, predictive pattern clustering, and proactive recurrence prevention.' },
  { name: 'Release Management',  color: '#059669', icon: 'rocket_launch', desc: 'Intelligent release readiness verification, pipeline telemetry inspection, and automated go/no-go gates.' },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1', desc: 'Completely manual workflows with no standardized AI tool integration or automation.' },
  { label: 'L1', title: 'Assisted / Tool', color: '#dc2626', bg: '#fee2e2', border: '#fecaca', desc: 'Basic inline autocomplete, chat assistance, and ad-hoc individual AI tool experimentation.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', desc: 'AI acts as supervised copilot drafting code, analyses, and tickets under human review.' },
  { label: 'L3', title: 'Supervised Agent', color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: 'Autonomous AI agents orchestrate multi-step tasks bounded by human verification gates.' },
  { label: 'L4', title: 'Autonomous Workforce', color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', desc: 'High-trust autonomous execution, automated safety nets, evaluation metrics, and guardrails.' },
  { label: 'L5', title: 'Agentic Enterprise', color: '#166534', bg: '#dcfce7', border: '#bbf7d0', desc: 'Self-optimizing delivery loops, automated drift remediation, and fully autonomous operations.' },
];

export default function Home() {
  const { user } = useAuth();
  const [activeFramework, setActiveFramework] = useState('SDLC');
  const [sdlcCount, setSdlcCount] = useState(120);
  const [amsCount, setAmsCount]   = useState(10);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [r1, r2] = await Promise.all([
          fetch('/api/questions?framework=SDLC', { cache: 'no-store' }),
          fetch('/api/questions?framework=AMS',  { cache: 'no-store' }),
        ]);
        if (r1.ok) { const d = await r1.json(); setSdlcCount(d.questions?.length || 120); }
        if (r2.ok) { const d = await r2.json(); setAmsCount(d.questions?.length || 10); }
      } catch (_) {}
    }
    fetchCounts();
  }, []);

  const dashboardLink = user ? '/dashboard' : null;
  const areas = activeFramework === 'SDLC' ? SDLC_AREAS : AMS_AREAS;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '32px' }}>

      {/* ── Hero Section (Enterprise Gateway Pattern) ─────────────────────── */}
      <section style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '64px 36px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        textAlign: 'center',
      }}>
        {/* Subtle Ambient Brand Glow */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '360px',
          background: 'radial-gradient(ellipse at center, rgba(30, 64, 175, 0.09) 0%, rgba(217, 119, 6, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Category Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em',
          marginBottom: '20px',
        }}>
          <span className="material-icons" style={{ fontSize: '1rem' }}>analytics</span>
          TCS MATURITYIQ · ENTERPRISE AI AUDIT ENGINE
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '20px',
          color: '#0f172a',
        }}>
          Measure. Benchmark.<br />
          <span style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #166534 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Elevate Your AI Maturity
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          maxWidth: '740px',
          margin: '0 auto 36px',
          color: '#475569',
          fontSize: '1.08rem',
          lineHeight: 1.75,
          fontWeight: 500,
        }}>
          Precision maturity assessment across two unified enterprise disciplines —{' '}
          <strong style={{ color: '#166534' }}>SDLC Intelligence</strong> for software engineering delivery and{' '}
          <strong style={{ color: '#4f46e5' }}>AMS Intelligence</strong> for application operations and support.
        </p>

        {/* CTA Button Group */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {user ? (
            <Link href={dashboardLink} className="btn-primary-action" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>dashboard</span>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-primary-action" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
                Start Free Assessment →
              </Link>
              <Link href="/login" className="btn-secondary-action" style={{ fontSize: '1rem', padding: '14px 32px' }}>
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
          gap: '28px',
          paddingTop: '24px',
          borderTop: '1px solid #f1f5f9',
          color: '#64748b',
          fontSize: '0.84rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#166534', fontSize: '1.1rem' }}>check_circle</span>
            130+ Evaluated AI Practices
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#1e40af', fontSize: '1.1rem' }}>check_circle</span>
            2 Dual-Core Frameworks (SDLC & AMS)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#4f46e5', fontSize: '1.1rem' }}>check_circle</span>
            10 Operational Delivery Domains
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#d97706', fontSize: '1.1rem' }}>check_circle</span>
            Instant Executive Spider Chart & PDF
          </div>
        </div>
      </section>

      {/* ── Dual Framework Gateway Cards ──────────────────────────────────── */}
      <section style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            Two Specialized Assessment Pathways
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        <div className="row g-4">
          {/* SDLC Intelligence Card */}
          <div className="col-md-6">
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #166534',
              borderRadius: '16px',
              padding: '28px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.22s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(22, 101, 52, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '130px', height: '130px', background: 'radial-gradient(circle at top right, rgba(22, 101, 52, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-icons" style={{ color: '#166534', fontSize: '1.5rem' }}>developer_mode</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>
                    FRAMEWORK 1 · ENGINEERING
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    SDLC Intelligence
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, marginBottom: '20px', flexGrow: 1 }}>
                Audit your engineering teams across the complete software delivery lifecycle — covering AI agent adoption in Requirements, Architecture, Development, Testing, and Deployment.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                {SDLC_AREAS.map(a => (
                  <span key={a.name} style={{ fontSize: '0.72rem', fontWeight: 600, color: a.color, background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: '6px', padding: '3px 9px' }}>
                    {a.name}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <strong style={{ color: '#166534', fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>{sdlcCount}</strong> practices · 5 domains
                </div>
                <Link href="/sdlc" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Framework <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* AMS Intelligence Card */}
          <div className="col-md-6">
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #4f46e5',
              borderRadius: '16px',
              padding: '28px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.22s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 70, 229, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '130px', height: '130px', background: 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-icons" style={{ color: '#4f46e5', fontSize: '1.5rem' }}>support_agent</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>
                    FRAMEWORK 2 · OPERATIONS
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    AMS Intelligence
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, marginBottom: '20px', flexGrow: 1 }}>
                Evaluate your application operations AI capability across incident triage, self-service request automation, change blast radius detection, and release orchestration.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                {AMS_AREAS.map(a => (
                  <span key={a.name} style={{ fontSize: '0.72rem', fontWeight: 600, color: a.color, background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: '6px', padding: '3px 9px' }}>
                    {a.name}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <strong style={{ color: '#4f46e5', fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>{amsCount}</strong> practices · 5 domains
                </div>
                <Link href="/ams" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Framework <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Domain Explorer ───────────────────────────────────── */}
      <section id="domains" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            Assessment Domains & Practices
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        {/* Framework Selector Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '6px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
            <button
              onClick={() => setActiveFramework('SDLC')}
              style={{
                padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-heading)',
                background: activeFramework === 'SDLC' ? '#166534' : 'transparent',
                color: activeFramework === 'SDLC' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              SDLC Domains
            </button>
            <button
              onClick={() => setActiveFramework('AMS')}
              style={{
                padding: '8px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-heading)',
                background: activeFramework === 'AMS' ? '#4f46e5' : 'transparent',
                color: activeFramework === 'AMS' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              AMS Domains
            </button>
          </div>
        </div>

        {/* 5 Dynamic Domain Cards */}
        <div className="row g-3">
          {areas.map((area, idx) => (
            <div className="col-lg col-md-4 col-sm-6 col-12" key={idx}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '20px 18px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `3px solid ${area.color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ width: '40px', height: '40px', background: `${area.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <span className="material-icons" style={{ color: area.color, fontSize: '1.3rem' }}>{area.icon}</span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>{area.name}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Maturity Progression Model (L0 → L5) ───────────────────────── */}
      <section id="maturity" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            L0 → L5 AI Maturity Progression Model
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

      {/* ── Platform Capabilities ─────────────────────────────────────────── */}
      <section id="about" style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            Enterprise Platform Capabilities
          </span>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
        </div>

        <div className="row g-4">
          {[
            {
              icon: 'bar_chart',
              color: '#166534',
              title: 'Dual-Framework Benchmarking',
              desc: 'Benchmark AI maturity across both software engineering delivery (SDLC) and operations (AMS) on a unified deterministic rubric.',
              bullets: [
                '120+ SDLC practices across 5 domains',
                'Comprehensive AMS operations coverage',
                'Unified multi-team benchmark comparison',
              ],
            },
            {
              icon: 'insights',
              color: '#1e40af',
              title: 'Multi-Axis Radar Spider Modeling',
              desc: 'Visualize team maturity strengths and blind spots across every dimension with interactive radar matrices and KPI delta tracking.',
              bullets: [
                'Per-domain score extraction (0–100%)',
                'Visual radar dimension alignment',
                'Historical progression tracking',
              ],
            },
            {
              icon: 'description',
              color: '#d97706',
              title: 'Actionable Executive Reports',
              desc: 'Instant assessment audits complete with executive summaries, maturity levels, and automated gap remediation action roadmaps.',
              bullets: [
                'Instant PDF-ready printable report',
                'Prioritized technical recommendations',
                'Targeted toolchain & governance guidance',
              ],
            },
          ].map((f, i) => (
            <div className="col-md-4" key={i}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTop: `3px solid ${f.color}`,
                borderRadius: '16px',
                padding: '28px 24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${f.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ width: '48px', height: '48px', background: `${f.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', flexShrink: 0 }}>
                  <span className="material-icons" style={{ fontSize: '1.6rem', color: f.color }}>{f.icon}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>{f.title}</h4>
                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.65, margin: '0 0 18px', flexGrow: 1 }}>{f.desc}</p>
                <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '16px' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {f.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                      <span className="material-icons" style={{ fontSize: '1rem', color: f.color }}>check_circle</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing Conversion Banner ─────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        borderRadius: '20px',
        padding: '48px 36px',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(30, 64, 175, 0.25)',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
          Ready to Benchmark Your Organization's AI Maturity?
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 28px', color: '#bfdbfe', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Take the assessment, identify maturity bottlenecks, and generate your strategic AI implementation roadmap today.
        </p>
        <Link
          href={user ? '/dashboard' : '/signup'}
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
          {user ? 'Go to Dashboard →' : 'Launch Free Assessment →'}
        </Link>
      </section>

    </div>
  );
}
