# Dashboard Page Overrides — TCS MaturityIQ

> **PROJECT:** TCS-MaturityIQ  
> **Skill Profile:** UI/UX Pro Max (Data-Dense Dashboard + Enterprise Gateway)  
> **Target Audience:** Engineering Leads, IT Executives, Delivery Managers, Practice Directors  
> **Frameworks:** SDLC Intelligence & AMS Intelligence  

---

## 1. Executive Summary & Page Architecture

The **TCS MaturityIQ Dashboard** is an enterprise data-dense analytical cockpit designed to provide visibility into software engineering and application operations AI maturity.

### Layout & Grid Specs
- **Container Max-Width:** `1440px` (centered) with `24px` horizontal padding.
- **Header Section:** Top breadcrumb bar + Personalized welcome greeting + Quick Action CTA ("Start New Assessment").
- **KPI Summary Grid:** 4-column responsive Bento Grid:
  - Mobile (`< 768px`): 1 column
  - Tablet (`768px - 1024px`): 2 columns
  - Desktop (`> 1024px`): 4 columns
- **Main Analytical Row:** 12-column split layout:
  - Left (7 cols): Dimension Score Radar / Spider Visualization & Maturity Trendline.
  - Right (5 cols): Framework Readiness Cards (SDLC & AMS status with progress rings).
- **Bottom Section:** Full-width Paginated Assessment History Table with domain filtering and search.

---

## 2. Color Palette & Token Extensions

| Token | Light Mode Hex | Dark Mode Hex | Usage |
|-------|----------------|---------------|-------|
| `--color-primary` | `#1E40AF` | `#3B82F6` | Primary brand accent & active states |
| `--color-sdlc` | `#166534` | `#22C55E` | SDLC Intelligence brand color & badge |
| `--color-sdlc-glow` | `rgba(22, 101, 52, 0.08)` | `rgba(34, 197, 94, 0.15)` | SDLC Card background tint |
| `--color-ams` | `#4F46E5` | `#818CF8` | AMS Intelligence brand color & badge |
| `--color-ams-glow` | `rgba(79, 70, 229, 0.08)` | `rgba(129, 140, 248, 0.15)` | AMS Card background tint |
| `--color-accent` | `#D97706` | `#F59E0B` | Critical actions & highlight badges |
| `--color-background` | `#F8FAFC` | `#0B1120` | Root app background |
| `--color-card` | `#FFFFFF` | `#111827` | Dashboard surface cards |
| `--color-border` | `#E2E8F0` | `#1F2937` | Subtle dividers & borders |
| `--color-text-main` | `#0F172A` | `#F8FAFC` | Primary text (WCAG 7:1 ratio) |
| `--color-text-muted` | `#64748B` | `#94A3B8` | Subtitles, labels, metadata |

### Maturity Tier Color Mapping
- **Level 1 — Foundational (0 - 25%):** `#DC2626` (Red-600) / Border: `#FCA5A5`
- **Level 2 — Developing (26 - 50%):** `#D97706` (Amber-600) / Border: `#FCD34D`
- **Level 3 — Maturing (51 - 70%):** `#2563EB` (Blue-600) / Border: `#93C5FD`
- **Level 4 — Advanced (71 - 85%):** `#4F46E5` (Indigo-600) / Border: `#C7D2FE`
- **Level 5 — Optimizing (86 - 100%):** `#166534` (Emerald-700) / Border: `#86EFAC`

---

## 3. Typography Hierarchy

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --font-heading: 'Fira Code', monospace;
  --font-body: 'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

- **Dashboard Title:** `28px / 1.3`, Weight 700, Font: `var(--font-heading)`
- **Widget Headings:** `16px / 1.4`, Weight 600, Font: `var(--font-heading)`, tracking: `0.02em`
- **Metric Big Numbers:** `32px / 1.1`, Weight 700, Font: `var(--font-heading)`
- **Body & Captions:** `14px / 1.5`, Weight 400/500, Font: `var(--font-body)`
- **Badges & Tags:** `12px / 1.2`, Weight 600, Font: `var(--font-heading)`, Uppercase

---

## 4. Dashboard Component Specifications

### 4.1. KPI Metric Cards
```css
.kpi-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 64, 175, 0.08);
  border-color: #BFDBFE;
}

.kpi-card-metric {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-main);
  line-height: 1.1;
  margin: 8px 0 4px 0;
}

.kpi-card-subtext {
  font-size: 13px;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
```

### 4.2. Framework Banner Cards (SDLC & AMS)
```css
.framework-card {
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--color-border);
  position: relative;
  transition: all 220ms ease;
}

.framework-card.sdlc {
  background: linear-gradient(135deg, rgba(22, 101, 52, 0.04) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-left: 4px solid var(--color-sdlc);
}

.framework-card.ams {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-left: 4px solid var(--color-ams);
}

.framework-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
```

### 4.3. Radar / Spider Assessment Chart Integration
- **Engine:** `Chart.js` with `react-chartjs-2`.
- **Primary Line Color:** `#1E40AF` (2px width).
- **Fill Color:** `rgba(30, 64, 175, 0.18)` (smooth alpha fill).
- **Grid Lines:** `rgba(100, 116, 139, 0.15)`.
- **Point Radius:** 4px normal, 6px hover state.
- **Accessibility Requirement:** Accompany chart with a toggleable tabular view containing the raw dimension percentage scores.

### 4.4. Assessment History Table
```css
.assessment-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.assessment-table th {
  background: #F1F5F9;
  color: #475569;
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.assessment-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-main);
  vertical-align: middle;
}

.assessment-table tr:hover td {
  background-color: #F8FAFC;
}
```

---

## 5. Accessibility & UX Quality Checklist

- [x] **No Emoji Icons:** Use pure SVG vector icons (Lucide or Heroicons).
- [x] **Contrast Compliance:** Minimum 4.5:1 text-to-background contrast ratio (AAA: 7:1 for headers).
- [x] **Touch Targets:** Minimum 44px × 44px clickable target size for all interactive buttons and filters.
- [x] **Keyboard Navigation:** High-visibility outline ring (`box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.4)`) on `:focus-visible`.
- [x] **Reduced Motion:** Wrap transitions in `@media (prefers-reduced-motion: reduce)`.
- [x] **Responsive Scaling:** Zero horizontal scrolling across mobile (`375px`), tablet (`768px`), and desktop (`1440px`).
