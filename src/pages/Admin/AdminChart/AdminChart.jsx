import { useMemo, useRef, useState } from 'react';
import { Icon, ROLE_COLORS } from '../AdminShared/AdminShared';
import "./AdminChart.css";

/* ─── real data helpers (everything is computed from the users array) ─── */
const DAY = 86400000;

function dayStart(value) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/* Daily new-account counts + running total for the last `days` days */
export function buildSeries(users, days, role) {
  const today = dayStart(Date.now());
  const start = today - (days - 1) * DAY;
  const daily = Array(days).fill(0);
  let before = 0;

  users.forEach((u) => {
    if (role && u.role !== role) return;
    const t = u.created_at ? dayStart(u.created_at) : NaN;
    if (Number.isNaN(t) || t < start) { before++; return; }
    if (t <= today) daily[Math.round((t - start) / DAY)]++;
  });

  let run = before;
  const total = daily.map((n) => (run += n));
  return { start, daily, total };
}

/* "+3 this week" compared with the previous 7 days */
function weekTrend(users, role) {
  const now = Date.now();
  let last = 0;
  let prev = 0;
  users.forEach((u) => {
    if (role && u.role !== role) return;
    const t = u.created_at ? new Date(u.created_at).getTime() : NaN;
    if (Number.isNaN(t)) return;
    const age = now - t;
    if (age >= 0 && age < 7 * DAY) last++;
    else if (age >= 7 * DAY && age < 14 * DAY) prev++;
  });
  let note = 'no change vs last week';
  if (prev > 0) {
    const pct = Math.round(((last - prev) / prev) * 100);
    note = `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
  } else if (last > 0) {
    note = 'new this week';
  }
  return { last, note, up: last >= prev };
}

/* ─── sparkline ─── */
function Spark({ values, color, id }) {
  const W = 200;
  const H = 48;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const flat = max === min;
  const step = W / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => [
    i * step,
    flat ? H * 0.6 : H - 6 - ((v - min) / (max - min)) * (H - 16),
  ]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  return (
    <svg className="ch-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ─── stat cards ─── */
function StatCard({ id, label, value, icon, tone, color, trend, values, loading }) {
  return (
    <div className="ch-stat">
      <div className="ch-stat-top">
        <div>
          <span className="ch-stat-label">{label}</span>
          <span className="ch-stat-value">{loading ? '–' : value}</span>
          <span className={`ch-stat-trend ${trend.up ? 'is-up' : 'is-down'}`}>
            {loading ? ' ' : `${trend.last > 0 ? '+' : ''}${trend.last} this week · ${trend.note}`}
          </span>
        </div>
        <span className={`ch-stat-icon ch-stat-icon--${tone}`}><Icon name={icon} size={18} /></span>
      </div>
      <Spark values={values} color={color} id={id} />
    </div>
  );
}

export function StatCards({ users, loading }) {
  const cards = useMemo(() => {
    const defs = [
      { id: 'all',   label: 'Total accounts', icon: 'users',  tone: 'green', color: '#0a9d5c', role: null },
      { id: 'user',  label: 'Users',          icon: 'user',   tone: 'blue',  color: '#6366f1', role: 'user' },
      { id: 'staff', label: 'Staff',          icon: 'staff',  tone: 'amber', color: '#f59e0b', role: 'staff' },
      { id: 'admin', label: 'Admins',         icon: 'shield', tone: 'slate', color: '#64748b', role: 'admin' },
    ];
    return defs.map((d) => ({
      ...d,
      value: d.role ? users.filter((u) => u.role === d.role).length : users.length,
      values: buildSeries(users, 14, d.role).total,
      trend: weekTrend(users, d.role),
    }));
  }, [users]);

  return (
    <section className="ch-stats" aria-label="Summary">
      {cards.map((c) => <StatCard key={c.id} {...c} loading={loading} />)}
    </section>
  );
}

/* ─── signups area chart ─── */
const VB = { w: 640, h: 260, l: 38, r: 14, t: 14, b: 28 };
const RANGES = [7, 30, 90];

export function SignupsChart({ users, loading }) {
  const [range, setRange] = useState(30);
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  const { start, daily } = useMemo(() => buildSeries(users, range), [users, range]);
  const totalInRange = daily.reduce((a, b) => a + b, 0);
  const peak = Math.max(...daily, 0);
  const yMax = Math.max(4, Math.ceil(peak / 4) * 4);

  const iw = VB.w - VB.l - VB.r;
  const ih = VB.h - VB.t - VB.b;
  const x = (i) => VB.l + (i / Math.max(daily.length - 1, 1)) * iw;
  const y = (v) => VB.t + ih - (v / yMax) * ih;

  const line = daily.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(daily.length - 1)} ${VB.t + ih} L${x(0)} ${VB.t + ih} Z`;
  const yTicks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i);
  const labelEvery = Math.ceil(daily.length / 6);
  const dateOf = (i) => new Date(start + i * DAY)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  function onMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * VB.w;
    const i = Math.round(((px - VB.l) / iw) * (daily.length - 1));
    setHover(Math.min(Math.max(i, 0), daily.length - 1));
  }

  return (
    <section className="ch-card">
      <div className="ch-head">
        <div>
          <h2 className="ch-title">New accounts</h2>
          <p className="ch-sub">
            {loading ? 'Loading…' : `${totalInRange} registered in the last ${range} days`}
          </p>
        </div>
        <div className="ch-range" role="tablist" aria-label="Date range">
          {RANGES.map((r) => (
            <button key={r} role="tab" aria-selected={range === r}
              className={range === r ? 'is-active' : ''}
              onClick={() => { setRange(r); setHover(null); }}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="ch-plot">
        <svg ref={svgRef} viewBox={`0 0 ${VB.w} ${VB.h}`} className="ch-svg"
          onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img"
          aria-label="New accounts per day">
          <defs>
            <linearGradient id="ch-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a9d5c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0a9d5c" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((t) => (
            <g key={t}>
              <line x1={VB.l} x2={VB.w - VB.r} y1={y(t)} y2={y(t)} className="ch-grid" />
              <text x={VB.l - 8} y={y(t) + 4} textAnchor="end" className="ch-axis">{t}</text>
            </g>
          ))}

          {daily.map((_, i) => (i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={VB.h - 8} textAnchor="middle" className="ch-axis">{dateOf(i)}</text>
          ) : null))}

          {!loading && <path d={area} fill="url(#ch-area)" />}
          {!loading && <path d={line} fill="none" stroke="#0a9d5c" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />}

          {hover !== null && !loading && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={VB.t} y2={VB.t + ih} className="ch-cursor" />
              <circle cx={x(hover)} cy={y(daily[hover])} r="4.5" fill="#fff" stroke="#0a9d5c" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hover !== null && !loading && (
          <div className="ch-tip" style={{ left: `${(x(hover) / VB.w) * 100}%` }}>
            <strong>{daily[hover]}</strong> new {daily[hover] === 1 ? 'account' : 'accounts'}
            <span>{dateOf(hover)}</span>
          </div>
        )}

        {!loading && totalInRange === 0 && (
          <p className="ch-empty">No sign-ups in this period.</p>
        )}
      </div>
    </section>
  );
}

/* ─── role distribution donut ─── */
export function RoleDonut({ users, loading }) {
  const total = users.length;
  const segments = ['user', 'staff', 'admin'].map((k) => ({
    key: k,
    label: `${k[0].toUpperCase()}${k.slice(1)}${k === 'staff' ? '' : 's'}`,
    color: ROLE_COLORS[k],
    count: users.filter((u) => u.role === k).length,
  }));

  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <section className="ch-card">
      <h2 className="ch-title">Role distribution</h2>
      <p className="ch-sub">Accounts split by role</p>

      <div className="ch-donut">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--adm-track, #e6efe9)" strokeWidth="16" />
          {!loading && total > 0 && segments.map((s) => {
            const len = (s.count / total) * c;
            const el = (
              <circle key={s.key} cx="60" cy="60" r={r} fill="none" stroke={s.color}
                strokeWidth="16" strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset} transform="rotate(-90 60 60)" />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="ch-donut-center">
          <strong>{loading ? '–' : total}</strong>
          <span>Accounts</span>
        </div>
      </div>

      <ul className="ch-legend">
        {segments.map((s) => (
          <li key={s.key}>
            <span className="ch-dot" style={{ background: s.color }} />
            <span className="ch-legend-label">{s.label}</span>
            <span className="ch-legend-val">{loading ? '–' : s.count}</span>
            <span className="ch-legend-pct">
              {loading || !total ? '' : `${Math.round((s.count / total) * 100)}%`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}