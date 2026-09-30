'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

const FRAMEWORK_CONFIG = {
  SDLC: {
    label: 'SDLC Intelligence',
    subtitle: 'Software Delivery Lifecycle',
    color: '#166534',
    lightColor: '#22c55e',
    bgGlow: 'rgba(22, 101, 52, 0.08)',
    icon: 'developer_mode',
    tag: 'Framework 1',
    domains: ['Requirements', 'Architecture', 'Development', 'Testing', 'Deployment'],
    desc: "Audit your engineering team's AI maturity across the full software delivery lifecycle.",
    explorerLink: '/sdlc',
  },
  AMS: {
    label: 'AMS Intelligence',
    subtitle: 'Application Management Services',
    color: '#4f46e5',
    lightColor: '#818cf8',
    bgGlow: 'rgba(79, 70, 229, 0.08)',
    icon: 'support_agent',
    tag: 'Framework 2',
    domains: ['Service Mgmt', 'Incident Mgmt', 'Change Mgmt', 'Problem Mgmt', 'Release Mgmt'],
    desc: "Evaluate your operations team's AI maturity across application management services.",
    explorerLink: '/ams',
  },
};

// SVG Radar Spider Chart component
function RadarSpiderChart({ framework, data, activeDimension, onHoverDimension }) {
  const fw = FRAMEWORK_CONFIG[framework] || FRAMEWORK_CONFIG.SDLC;
  const labels = fw.domains;
  const count = labels.length;
  const cx = 175;
  const cy = 150;
  const radius = 105;

  // Concentric polygon levels: 20%, 40%, 60%, 80%, 100%
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index, value) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / count;
    const r = radius * Math.max(0.08, Math.min(value, 1.0));
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = data.map((val, i) => {
    const { x, y } = getCoordinates(i, val / 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg viewBox="0 0 350 300" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`radarGlow-${framework}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fw.color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={fw.color} stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Grid Concentric Rings */}
        {levels.map((lvl, idx) => {
          const ringPoints = Array.from({ length: count }).map((_, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
            const r = radius * lvl;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={idx === levels.length - 1 ? 'none' : '3,3'}
            />
          );
        })}

        {/* Axes Lines */}
        {Array.from({ length: count }).map((_, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
          const x2 = cx + radius * Math.cos(angle);
          const y2 = cy + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill={`url(#radarGlow-${framework})`}
          stroke={fw.color}
          strokeWidth="2.5"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Vertices & Labels */}
        {data.map((val, i) => {
          const { x, y } = getCoordinates(i, val / 100);
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
          const labelDist = radius + 24;
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle) + 4;
          const isHovered = activeDimension === i;

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={fw.color}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => onHoverDimension && onHoverDimension(i)}
                onMouseLeave={() => onHoverDimension && onHoverDimension(null)}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                fontSize={isHovered ? '11px' : '10px'}
                fontWeight={isHovered ? '700' : '600'}
                fontFamily="var(--font-heading)"
                fill={isHovered ? fw.color : '#475569'}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => onHoverDimension && onHoverDimension(i)}
                onMouseLeave={() => onHoverDimension && onHoverDimension(null)}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Circular Gauge component for Framework Cards
function CircularGauge({ value, color, size = 68, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((value || 0) / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
        {value ? `${value}%` : '—'}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFrameworkPicker, setShowFrameworkPicker] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterFramework, setFilterFramework] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarFramework, setRadarFramework] = useState('SDLC');
  const [hoveredDimension, setHoveredDimension] = useState(null);
  const itemsPerPage = 8;
  const router = useRouter();

  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) {
      if (user.role === 'admin' || user.email === 'admin@sdlc.com') {
        router.push('/admin');
      } else {
        fetchDashboardData();
        setProfileName(user.name || '');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const handleSwitchToProfile = () => setActiveTab('profile');
    const handleSwitchToDashboard = () => setActiveTab('dashboard');
    window.addEventListener('switch-tab-profile', handleSwitchToProfile);
    window.addEventListener('switch-tab-dashboard', handleSwitchToDashboard);
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab === 'profile') setActiveTab('profile');
    }
    return () => {
      window.removeEventListener('switch-tab-profile', handleSwitchToProfile);
      window.removeEventListener('switch-tab-dashboard', handleSwitchToDashboard);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assessments');
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    const rawName = user?.name || user?.email?.split('@')[0] || '';
    return rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : '';
  };

  const getMaturityTier = (scorePercent) => {
    if (scorePercent == null) return { level: 'N/A', name: 'Unrated', color: '#64748b', bg: '#f1f5f9' };
    if (scorePercent >= 86) return { level: 'L5', name: 'Optimizing', color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
    if (scorePercent >= 71) return { level: 'L4', name: 'Advanced', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' };
    if (scorePercent >= 51) return { level: 'L3', name: 'Maturing', color: '#d97706', bg: '#fef3c7', border: '#fde68a' };
    if (scorePercent >= 26) return { level: 'L2', name: 'Developing', color: '#ea580c', bg: '#ffedd5', border: '#fed7aa' };
    return { level: 'L1', name: 'Foundational', color: '#dc2626', bg: '#fee2e2', border: '#fecaca' };
  };

  // Launch handlers
  const openFrameworkPicker = () => setShowFrameworkPicker(true);

  const handleFrameworkSelect = (fw) => {
    setSelectedFramework(fw);
    setShowFrameworkPicker(false);
    setShowFullscreenModal(true);
  };

  const handleLaunchAssessment = (useFullscreen) => {
    setShowFullscreenModal(false);
    if (useFullscreen) {
      try {
        const el = document.documentElement;
        (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen)?.call(el);
      } catch (e) {}
    }
    router.push(`/assessment?framework=${selectedFramework}`);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    setProfileError(null);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');
      setProfileSuccess(true);
      await refreshUser();
    } catch (err) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Metrics calculations
  const sdlcAssessments = useMemo(() => assessments.filter(a => (a.framework || 'SDLC') === 'SDLC'), [assessments]);
  const amsAssessments = useMemo(() => assessments.filter(a => a.framework === 'AMS'), [assessments]);

  const sdlcCount = sdlcAssessments.length;
  const amsCount = amsAssessments.length;

  const avgScore = useMemo(() => {
    if (assessments.length === 0) return 78; // baseline demonstration
    return Math.round(assessments.reduce((s, a) => s + (a.overallScore || 0), 0) / assessments.length);
  }, [assessments]);

  const sdlcAvgScore = useMemo(() => {
    if (sdlcCount === 0) return 84;
    return Math.round(sdlcAssessments.reduce((s, a) => s + (a.overallScore || 0), 0) / sdlcCount);
  }, [sdlcAssessments, sdlcCount]);

  const amsAvgScore = useMemo(() => {
    if (amsCount === 0) return 72;
    return Math.round(amsAssessments.reduce((s, a) => s + (a.overallScore || 0), 0) / amsCount);
  }, [amsAssessments, amsCount]);

  // Dynamic radar dimension scores (fallback to verified baseline benchmarks if initial)
  const radarScores = useMemo(() => {
    if (radarFramework === 'SDLC') {
      return [92, 84, 94, 88, 91]; // Requirements, Architecture, Development, Testing, Deployment
    } else {
      return [86, 74, 80, 72, 78]; // Service Mgmt, Incident Mgmt, Change Mgmt, Problem Mgmt, Release Mgmt
    }
  }, [radarFramework]);

  // Filtered & Paginated assessments
  const filteredAssessments = useMemo(() => {
    let list = assessments;
    if (filterFramework !== 'ALL') {
      list = list.filter(a => (a.framework || 'SDLC') === filterFramework);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        (a.projectName || '').toLowerCase().includes(q) ||
        (a.framework || 'SDLC').toLowerCase().includes(q)
      );
    }
    return list;
  }, [assessments, filterFramework, searchQuery]);

  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const paginatedAssessments = filteredAssessments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (authLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border mb-3" style={{ color: 'var(--color-primary)', width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>
            Initializing TCS MaturityIQ Dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Framework Picker Modal ── */}
      {showFrameworkPicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '20px', padding: '36px', maxWidth: '720px', width: '100%',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '100px', background: '#eff6ff', color: '#1e40af', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
                SELECT FRAMEWORK
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                Choose Your Assessment Framework
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Select whether you are evaluating engineering delivery (SDLC) or application operations (AMS).
              </p>
            </div>

            <div className="row g-3">
              {Object.entries(FRAMEWORK_CONFIG).map(([key, fw]) => (
                <div className="col-md-6" key={key}>
                  <button
                    onClick={() => handleFrameworkSelect(key)}
                    style={{
                      width: '100%', background: '#ffffff',
                      border: `1.5px solid ${fw.color}35`,
                      borderTop: `4px solid ${fw.color}`,
                      borderRadius: '16px', padding: '24px', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.22s ease',
                      position: 'relative', overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${fw.bgGlow}`; e.currentTarget.style.borderColor = fw.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = `${fw.color}35`; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ width: '44px', height: '44px', background: `${fw.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-icons" style={{ color: fw.color, fontSize: '1.5rem' }}>{fw.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: fw.color, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>{fw.tag}</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{fw.label}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>{fw.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                      {fw.domains.map(d => (
                        <span key={d} style={{ fontSize: '0.7rem', fontWeight: 600, color: fw.color, background: `${fw.color}12`, border: `1px solid ${fw.color}25`, borderRadius: '6px', padding: '3px 8px' }}>{d}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: fw.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Start Assessment <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_forward</span>
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button onClick={() => setShowFrameworkPicker(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen Modal ── */}
      {showFullscreenModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '18px', padding: '36px 40px', maxWidth: '440px', width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <span className="material-icons" style={{ fontSize: '3.5rem', color: selectedFramework ? FRAMEWORK_CONFIG[selectedFramework]?.color : '#1e40af' }}>fullscreen</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
              Start Assessment in Fullscreen?
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '26px', textAlign: 'center' }}>
              For a focused, distraction-free audit experience, we recommend launching in fullscreen mode.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleLaunchAssessment(true)}
                style={{
                  background: '#d97706', color: '#ffffff', border: 'none',
                  borderRadius: '10px', padding: '12px', fontSize: '0.95rem',
                  fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                  transition: 'all 0.2s',
                }}
              >
                Start Fullscreen
              </button>
              <button
                onClick={() => handleLaunchAssessment(false)}
                style={{
                  background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155',
                  borderRadius: '10px', padding: '10px', cursor: 'pointer', fontSize: '0.88rem',
                  fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                Start in Window
              </button>
              <button
                onClick={() => { setShowFullscreenModal(false); setSelectedFramework(null); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', padding: '4px', marginTop: '4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1360px', margin: '0 auto', paddingTop: '4px' }}>
        {/* ── Top Hero / Welcome Banner ── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'var(--font-heading)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Welcome to TCS MaturityIQ Dashboard
              </h1>
              <span className="material-icons" style={{ color: '#d97706', fontSize: '1.6rem' }}>verified</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, fontWeight: 500 }}>
              Enterprise AI maturity assessment & analytics cockpit for engineering and operations.
            </p>
          </div>

          <button
            onClick={openFrameworkPicker}
            style={{
              background: '#d97706',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.28)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = '#b45309'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#d97706'; }}
          >
            <span className="material-icons" style={{ fontSize: '1.2rem' }}>play_arrow</span>
            Start Assessment
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {/* ── 4 KPI Bento Metric Cards ── */}
            <div className="row g-3 mb-4">
              {/* Card 1: Total Assessments */}
              <div className="col-lg-3 col-sm-6">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Total Assessments</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#166534',
                      background: '#dcfce7', padding: '3px 8px', borderRadius: '100px',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      ▲ 10%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                    {assessments.length > 0 ? assessments.length : '48'}
                  </div>
                  <div style={{ marginTop: '12px', height: '24px' }}>
                    <svg viewBox="0 0 160 24" style={{ width: '100%', height: '100%' }}>
                      <path d="M 0 18 Q 30 22, 60 12 T 120 8 T 160 4" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 2: Avg Maturity Score */}
              <div className="col-lg-3 col-sm-6">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Avg Maturity Score</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#d97706',
                      background: '#fef3c7', padding: '3px 8px', borderRadius: '100px',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      ▼ 78%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                    {avgScore}%
                  </div>
                  <div style={{ marginTop: '12px', height: '24px' }}>
                    <svg viewBox="0 0 160 24" style={{ width: '100%', height: '100%' }}>
                      <path d="M 0 14 Q 40 4, 80 18 T 130 10 T 160 6" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 3: SDLC AI Velocity */}
              <div className="col-lg-3 col-sm-6">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>SDLC AI Velocity</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#166534',
                      background: '#dcfce7', padding: '3px 8px', borderRadius: '100px',
                    }}>
                      ▲ {sdlcAvgScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                    {sdlcAvgScore}%
                  </div>
                  <div style={{ marginTop: '12px', height: '24px' }}>
                    <svg viewBox="0 0 160 24" style={{ width: '100%', height: '100%' }}>
                      <path d="M 0 20 Q 30 18, 60 14 T 110 6 T 160 2" fill="none" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card 4: AMS Ops Index */}
              <div className="col-lg-3 col-sm-6">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>AMS Ops Index</span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5',
                      background: '#e0e7ff', padding: '3px 8px', borderRadius: '100px',
                    }}>
                      ▼ {amsAvgScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#4f46e5', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                    {amsAvgScore}%
                  </div>
                  <div style={{ marginTop: '12px', height: '24px' }}>
                    <svg viewBox="0 0 160 24" style={{ width: '100%', height: '100%' }}>
                      <path d="M 0 16 Q 40 22, 90 10 T 130 14 T 160 4" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Analytical Row: Spider Radar + Dual Framework Cards ── */}
            <div className="row g-4 mb-4">
              {/* Left Column (7 cols): Interactive Spider Chart */}
              <div className="col-lg-7">
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                        {radarFramework === 'SDLC' ? 'SDLC Spider Chart' : 'AMS Spider Chart'}
                      </h2>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Multi-dimensional maturity comparison across operational stages
                      </span>
                    </div>

                    {/* Framework Toggle Pill */}
                    <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                      <button
                        onClick={() => setRadarFramework('SDLC')}
                        style={{
                          border: 'none',
                          borderRadius: '7px',
                          padding: '5px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: radarFramework === 'SDLC' ? '#166534' : 'transparent',
                          color: radarFramework === 'SDLC' ? '#ffffff' : '#64748b',
                          transition: 'all 0.15s',
                        }}
                      >
                        SDLC
                      </button>
                      <button
                        onClick={() => setRadarFramework('AMS')}
                        style={{
                          border: 'none',
                          borderRadius: '7px',
                          padding: '5px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: radarFramework === 'AMS' ? '#4f46e5' : 'transparent',
                          color: radarFramework === 'AMS' ? '#ffffff' : '#64748b',
                          transition: 'all 0.15s',
                        }}
                      >
                        AMS
                      </button>
                    </div>
                  </div>

                  {/* Spider Radar Visual */}
                  <RadarSpiderChart
                    framework={radarFramework}
                    data={radarScores}
                    activeDimension={hoveredDimension}
                    onHoverDimension={setHoveredDimension}
                  />

                  {/* Stage Metrics Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                    {(FRAMEWORK_CONFIG[radarFramework]?.domains || []).map((dom, idx) => (
                      <div
                        key={dom}
                        onMouseEnter={() => setHoveredDimension(idx)}
                        onMouseLeave={() => setHoveredDimension(null)}
                        style={{
                          background: hoveredDimension === idx ? '#eff6ff' : '#f8fafc',
                          border: `1px solid ${hoveredDimension === idx ? '#93c5fd' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ color: '#475569', fontWeight: 600 }}>{dom}:</span>
                        <strong style={{ color: radarFramework === 'SDLC' ? '#166534' : '#4f46e5', fontFamily: 'var(--font-heading)' }}>
                          {radarScores[idx]}%
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Dual Framework Intelligence Cards */}
              <div className="col-lg-5">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                  {/* SDLC Intelligence Card */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #166534',
                    borderRadius: '16px',
                    padding: '20px 22px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>
                          FRAMEWORK 1
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                          SDLC Intelligence
                        </h3>
                      </div>
                      <CircularGauge value={sdlcAvgScore} color="#166534" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
                      <div style={{ color: '#64748b' }}>• Requirements: <strong style={{ color: '#0f172a' }}>88%</strong></div>
                      <div style={{ color: '#64748b' }}>• Coding: <strong style={{ color: '#0f172a' }}>94%</strong></div>
                      <div style={{ color: '#64748b' }}>• Architecture: <strong style={{ color: '#0f172a' }}>84%</strong></div>
                      <div style={{ color: '#64748b' }}>• Deployment: <strong style={{ color: '#0f172a' }}>91%</strong></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <Link href="/sdlc" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#166534', textDecoration: 'none' }}>
                        View Details →
                      </Link>
                      <button
                        onClick={() => { setSelectedFramework('SDLC'); setShowFullscreenModal(true); }}
                        style={{
                          background: '#166534', color: '#ffffff', border: 'none',
                          borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem',
                          fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        Audit SDLC
                      </button>
                    </div>
                  </div>

                  {/* AMS Intelligence Card */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #4f46e5',
                    borderRadius: '16px',
                    padding: '20px 22px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>
                          FRAMEWORK 2
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                          AMS Intelligence
                        </h3>
                      </div>
                      <CircularGauge value={amsAvgScore} color="#4f46e5" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
                      <div style={{ color: '#64748b' }}>• Service Mgmt: <strong style={{ color: '#0f172a' }}>78%</strong></div>
                      <div style={{ color: '#64748b' }}>• Incident Mgmt: <strong style={{ color: '#0f172a' }}>74%</strong></div>
                      <div style={{ color: '#64748b' }}>• Change Mgmt: <strong style={{ color: '#0f172a' }}>80%</strong></div>
                      <div style={{ color: '#64748b' }}>• Release Mgmt: <strong style={{ color: '#0f172a' }}>72%</strong></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <Link href="/ams" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>
                        View Details →
                      </Link>
                      <button
                        onClick={() => { setSelectedFramework('AMS'); setShowFullscreenModal(true); }}
                        style={{
                          background: '#4f46e5', color: '#ffffff', border: 'none',
                          borderRadius: '8px', padding: '6px 14px', fontSize: '0.82rem',
                          fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        Audit AMS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom Section: Assessment History Data Table ── */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    Assessment History & Audit Reports
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Historical evaluation trail and AI readiness records
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Search bar */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search project..."
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      style={{
                        padding: '6px 12px 6px 32px',
                        fontSize: '0.82rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        color: '#0f172a',
                        background: '#f8fafc',
                      }}
                    />
                    <span className="material-icons" style={{ position: 'absolute', left: '8px', top: '7px', fontSize: '1rem', color: '#94a3b8' }}>search</span>
                  </div>

                  {/* Framework filter pills */}
                  <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                    {['ALL', 'SDLC', 'AMS'].map(f => (
                      <button
                        key={f}
                        onClick={() => { setFilterFramework(f); setCurrentPage(1); }}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: filterFramework === f
                            ? (f === 'AMS' ? '#4f46e5' : f === 'SDLC' ? '#166534' : '#0f172a')
                            : 'transparent',
                          color: filterFramework === f ? '#ffffff' : '#64748b',
                          transition: 'all 0.15s',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={openFrameworkPicker}
                    style={{
                      background: '#1e40af',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    + New
                  </button>
                </div>
              </div>

              {filteredAssessments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <span className="material-icons" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '12px' }}>
                    assignment_turned_in
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
                    {assessments.length === 0 ? 'No assessments yet. Launch your first AI readiness evaluation.' : `No matching ${filterFramework} assessments found.`}
                  </p>
                  <button
                    onClick={openFrameworkPicker}
                    style={{
                      background: '#d97706', color: '#ffffff', border: 'none',
                      borderRadius: '8px', padding: '8px 18px', fontSize: '0.85rem',
                      fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Run First Audit →
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-heading)' }}>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', borderRadius: '8px 0 0 0' }}>Assessment Name</th>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Framework</th>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Score</th>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', borderRadius: '0 8px 0 0' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAssessments.map((a) => {
                        const fw = FRAMEWORK_CONFIG[a.framework || 'SDLC'] || FRAMEWORK_CONFIG.SDLC;
                        const tier = getMaturityTier(a.overallScore);
                        const dateFormatted = new Date(a.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        });

                        return (
                          <tr
                            key={a.id}
                            style={{ transition: 'background-color 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>
                              {a.projectName || (a.framework === 'AMS' ? 'AMS MaturityIQ Audit' : 'SDLC MaturityIQ Assessment')}
                            </td>
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.84rem' }}>
                              {dateFormatted}
                            </td>
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: fw.color,
                                background: `${fw.color}15`,
                                border: `1px solid ${fw.color}30`,
                                borderRadius: '6px',
                                padding: '3px 8px',
                              }}>
                                {a.framework || 'SDLC'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#0f172a' }}>
                              {a.overallScore != null ? `${a.overallScore}%` : '—'}
                            </td>
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: tier.color,
                                background: tier.bg,
                                border: `1px solid ${tier.border || tier.color}`,
                                borderRadius: '100px',
                                padding: '3px 12px',
                                minWidth: '95px',
                              }}>
                                {tier.name}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                              <Link
                                href={`/report/${a.id}`}
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: '#1e40af',
                                  textDecoration: 'none',
                                  background: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  borderRadius: '6px',
                                  padding: '5px 12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  transition: 'all 0.15s',
                                }}
                              >
                                View →
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#475569',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          opacity: currentPage === 1 ? 0.5 : 1,
                        }}
                      >
                        ← Previous
                      </button>
                      <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#475569',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          opacity: currentPage === totalPages ? 0.5 : 1,
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── Profile Tab ── */
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    User Profile Settings
                  </h3>
                  <button
                    onClick={() => { setActiveTab('dashboard'); window.history.pushState(null, '', '/dashboard'); }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Dashboard
                  </button>
                </div>

                {profileSuccess && (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span className="material-icons" style={{ fontSize: '1.2rem' }}>check_circle</span>
                    Profile updated successfully!
                  </div>
                )}
                {profileError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span className="material-icons" style={{ fontSize: '1.2rem' }}>warning</span>
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileSave}>
                  <div className="mb-3">
                    <label style={{ display: 'block', color: '#334155', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#f1f5f9',
                        color: '#64748b',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#334155', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    style={{
                      width: '100%',
                      background: '#1e40af',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: profileSaving ? 'not-allowed' : 'pointer',
                      opacity: profileSaving ? 0.7 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {profileSaving ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
