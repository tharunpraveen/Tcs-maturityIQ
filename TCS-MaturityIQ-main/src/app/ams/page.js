'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

const AMS_AREAS = [
  {
    name: 'Service Management',
    color: '#4f46e5',
    icon: 'support_agent',
    badge: 'OPERATIONS 1',
    desc: 'AI-driven SLA monitoring and predictive breach alerting, automated self-service request fulfillment, and proactive service catalog governance.',
    capabilities: ['Predictive SLA monitoring', 'Zero-touch catalog requests', 'Automated ticket routing'],
  },
  {
    name: 'Incident Management',
    color: '#dc2626',
    icon: 'warning_amber',
    badge: 'OPERATIONS 2',
    desc: 'Automated incident triage and classification, AI-driven runbook execution, blast radius scoring, MTTR reduction, and automated escalation intelligence.',
    capabilities: ['Autonomous runbook execution', 'Blast radius calculation', 'Automated MTTR mitigation'],
  },
  {
    name: 'Change Management',
    color: '#ea580c',
    icon: 'published_with_changes',
    badge: 'OPERATIONS 3',
    desc: 'AI change risk prediction and schedule conflict detection, automated downstream impact analysis, CAB dossier synthesis, and approval workflow automation.',
    capabilities: ['Change risk scoring', 'Conflict detection matrix', 'Automated CAB approvals'],
  },
  {
    name: 'Problem Management',
    color: '#9333ea',
    icon: 'manage_search',
    badge: 'OPERATIONS 4',
    desc: 'Automated root cause analysis (RCA), predictive anomaly clustering from telemetry, structured problem resolution, and proactive recurrence prevention.',
    capabilities: ['Automated RCA generation', 'Telemetry pattern clustering', 'Proactive defect prevention'],
  },
  {
    name: 'Release Management',
    color: '#059669',
    icon: 'rocket_launch',
    badge: 'OPERATIONS 5',
    desc: 'AI-powered release readiness gates, end-to-end pipeline telemetry inspection, automated go/no-go recommendation engine, and rollback risk scoring.',
    capabilities: ['Autonomous go/no-go gates', 'Pipeline telemetry auditing', 'Release readiness scoring'],
  },
];

const LEVELS = [
  { label: 'L0', title: 'Traditional', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1', desc: 'Completely manual operations with no standardized AI tool integration or workflow automation.' },
  { label: 'L1', title: 'Assisted / Tool', color: '#dc2626', bg: '#fee2e2', border: '#fecaca', desc: 'Basic inline autocomplete, chat assistance, and ad-hoc individual AI tool experimentation.' },
  { label: 'L2', title: 'Delegated / Assistant', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', desc: 'AI acts as supervised copilot drafting tickets, RCA reports, and alerts under human review.' },
  { label: 'L3', title: 'Supervised Agent', color: '#d97706', bg: '#fef3c7', border: '#fde68a', desc: 'Autonomous AI agents execute runbooks and orchestrate remediation with approval gates.' },
  { label: 'L4', title: 'Autonomous Workforce', color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', desc: 'High-trust autonomous execution, automated safety nets, evaluation metrics, and guardrails.' },
  { label: 'L5', title: 'Agentic Enterprise', color: '#166534', bg: '#dcfce7', border: '#bbf7d0', desc: 'Self-optimizing delivery loops, automated drift remediation, and fully autonomous operations.' },
];

function getAMSDomainDiagram(name) {
  switch (name) {
    case 'Service Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="75" cy="65" r="28" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="75" cy="65" r="28" stroke="#4F46E5" strokeWidth="4" strokeDasharray="130 50" strokeDashoffset="35" />
          <text x="75" y="62" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#4F46E5" textAnchor="middle">SLA GOAL</text>
          <text x="75" y="73" fontFamily="var(--font-heading)" fontSize="9" fontWeight="800" fill="#0F172A" textAnchor="middle">99.8%</text>
          <rect x="122" y="28" width="76" height="18" rx="4" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.2" />
          <circle cx="132" cy="37" r="4" fill="#4F46E5" />
          <rect x="142" y="35" width="46" height="4" rx="2" fill="#CBD5E1" />
          <rect x="122" y="52" width="76" height="18" rx="4" fill="#F1F5F9" />
          <circle cx="132" cy="61" r="4" fill="#059669" />
          <rect x="142" y="59" width="40" height="4" rx="2" fill="#CBD5E1" />
          <rect x="122" y="76" width="76" height="18" rx="4" fill="#F1F5F9" />
          <circle cx="132" cy="85" r="4" fill="#D97706" />
          <rect x="142" y="83" width="50" height="4" rx="2" fill="#CBD5E1" />
        </svg>
      );
    case 'Incident Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M52 92L80 36L108 92H52Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" />
          <text x="80" y="76" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" fill="#DC2626" textAnchor="middle">!</text>
          <text x="80" y="89" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#DC2626" textAnchor="middle">P1 TRIAGE</text>
          <rect x="126" y="32" width="74" height="16" rx="4" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.2" />
          <text x="163" y="43" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#DC2626" textAnchor="middle">AUTO-TRIAGE</text>
          <path d="M163 48V56" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="126" y="56" width="74" height="16" rx="4" fill="#F1F5F9" />
          <text x="163" y="67" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569" textAnchor="middle">RUNBOOK RUN</text>
          <path d="M163 72V80" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="126" y="80" width="74" height="16" rx="4" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="163" y="91" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">RESOLVED ✓</text>
        </svg>
      );
    case 'Change Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="36" y="48" width="82" height="10" rx="5" fill="#E2E8F0" />
          <rect x="36" y="48" width="56" height="10" rx="5" fill="#EA580C" />
          <text x="77" y="38" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#EA580C" textAnchor="middle">RISK BLAST RADIUS</text>
          <rect x="36" y="68" width="82" height="34" rx="5" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.2" />
          <text x="77" y="82" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#EA580C" textAnchor="middle">RFC AUTOMATION</text>
          <rect x="46" y="87" width="62" height="4" rx="2" fill="#CBD5E1" />
          <path d="M148 60L165 46L182 60" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="140" y="60" width="50" height="20" rx="4" fill="#F1F5F9" />
          <text x="165" y="73" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569" textAnchor="middle">CAB Review</text>
          <path d="M165 80V90" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="140" y="90" width="50" height="16" rx="4" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="165" y="101" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">APPROVED</text>
        </svg>
      );
    case 'Problem Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="120" cy="32" r="11" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.5" />
          <text x="120" y="36" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#9333EA" textAnchor="middle">RCA</text>
          <path d="M120 43V54" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M90 54H150" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M90 54V62" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M120 54V62" stroke="#9333EA" strokeWidth="1.5" />
          <path d="M150 54V62" stroke="#9333EA" strokeWidth="1.5" />
          <rect x="68" y="62" width="44" height="18" rx="4" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.2" />
          <text x="90" y="74" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#9333EA" textAnchor="middle">Telemetry</text>
          <rect x="98" y="62" width="44" height="18" rx="4" fill="#F1F5F9" />
          <text x="120" y="74" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569" textAnchor="middle">Latency</text>
          <rect x="128" y="62" width="44" height="18" rx="4" fill="#F1F5F9" />
          <text x="150" y="74" fontFamily="var(--font-heading)" fontSize="7" fontWeight="600" fill="#475569" textAnchor="middle">Memory</text>
          <rect x="68" y="90" width="104" height="18" rx="5" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="120" y="102" fontFamily="var(--font-heading)" fontSize="7" fontWeight="700" fill="#166534" textAnchor="middle">Root Cause Prevented ✓</text>
        </svg>
      );
    case 'Release Management':
      return (
        <svg width="100%" height="100%" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC" />
          <rect x="25" y="15" width="190" height="100" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="36" y="46" width="38" height="26" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="55" y="58" fontFamily="var(--font-heading)" fontSize="6.5" fontWeight="700" fill="#059669" textAnchor="middle">AUDIT</text>
          <circle cx="55" cy="65" r="3.5" fill="#059669" />
          <path d="M74 59H86" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="86" y="46" width="38" height="26" rx="4" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="105" y="58" fontFamily="var(--font-heading)" fontSize="6.5" fontWeight="700" fill="#059669" textAnchor="middle">STAGE</text>
          <circle cx="105" cy="65" r="3.5" fill="#059669" />
          <path d="M124 59H136" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="136" y="46" width="38" height="26" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          <text x="155" y="57" fontFamily="var(--font-heading)" fontSize="5.5" fontWeight="700" fill="#D97706" textAnchor="middle">GATE</text>
          <text x="155" y="66" fontFamily="var(--font-heading)" fontSize="5.5" fontWeight="700" fill="#D97706" textAnchor="middle">CHECK</text>
          <path d="M174 59H186" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="186" y="46" width="26" height="26" rx="4" fill="#DCFCE7" stroke="#166534" strokeWidth="1.2" />
          <text x="199" y="59" fontFamily="var(--font-heading)" fontSize="6" fontWeight="700" fill="#166534" textAnchor="middle">PROD</text>
          <rect x="60" y="88" width="120" height="18" rx="5" fill="#ECFDF5" stroke="#059669" strokeWidth="1.2" />
          <text x="120" y="100" fontFamily="var(--font-heading)" fontSize="8" fontWeight="700" fill="#059669" textAnchor="middle">v3.2.0 DEPLOYED ✓</text>
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

      {/* ── Hero Section (Enterprise Standard) ─────────────────────────────── */}
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
          FRAMEWORK 2 · AMS INTELLIGENCE
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
            AI Operations Maturity
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
          A targeted <strong style={{ color: '#4f46e5' }}>operations audit</strong> covering Service Management, Incident Triage, Change Blast Radius, RCA Pattern Clustering, and Autonomous Release Orchestration.
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
            <span className="material-icons" style={{ color: '#4f46e5', fontSize: '1.1rem' }}>check_circle</span>
            Focused Operations Questionnaire
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#1e40af', fontSize: '1.1rem' }}>check_circle</span>
            5 Critical Operations Domains
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#dc2626', fontSize: '1.1rem' }}>check_circle</span>
            Autonomous MTTR Mitigation
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-icons" style={{ color: '#d97706', fontSize: '1.1rem' }}>check_circle</span>
            Instant Executive Radar & Roadmap
          </div>
        </div>
      </section>

      {/* ── 5 Operations Domains ───────────────────────────────────────────── */}
      <section id="domains" style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ height: '1px', flex: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
            The 5 Core Operations Domains
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
                <div style={{ width: '100%', height: '130px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {getAMSDomainDiagram(area.name)}
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
            AMS Operations AI Maturity Rubric (L0 → L5)
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
          Ready to Benchmark Your Operations Team?
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 28px', color: '#c7d2fe', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Complete the AMS assessment to discover your operational AI maturity score, benchmark incident response capabilities, and unlock an actionable roadmap.
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
          {user ? 'Start AMS Assessment →' : 'Launch Free Assessment →'}
        </Link>
      </section>

    </div>
  );
}
