import Logo from '../../../assets/wolloLogo.png';
import { Icon, initials } from '../AdminShared/AdminShared';
import "../AdminSideBar/AdminSidebar.css";

const ACCOUNT_LINKS = [
  { key: 'user',  label: 'Users',  icon: 'user' },
  { key: 'staff', label: 'Staff',  icon: 'staff' },
  { key: 'admin', label: 'Admins', icon: 'shield' },
];

export default function AdminSidebar({
  open, onClose, view, onView, roleTab, onPick, counts, loading, name, role, onHome, onLogout,
}) {
  const num = (n) => (loading ? '…' : n);

  return (
    <>
      <div className={`sb-overlay ${open ? 'is-open' : ''}`} onClick={onClose} />

      <aside className={`sb ${open ? 'is-open' : ''}`} aria-label="Sidebar">
        <div className="sb-brand">
          <img src={Logo} alt="Wollo Hub" className="sb-logo" />
          <div className="sb-brand-text">
            <strong>Wollo Hub</strong>
            <span>Admin console</span>
          </div>
          <button className="sb-close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="sb-nav">
          <p className="sb-title">Overview</p>

          {/* Dashboard — shows report/charts view */}
          <button
            className={`sb-item ${view === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => { onView('dashboard'); onClose(); }}
          >
            <Icon name="home" size={17} /><span>Dashboard</span>
          </button>

          {/* User management — shows the full users table */}
          <button
            className={`sb-item ${view === 'users' && roleTab === 'all' ? 'is-active' : ''}`}
            onClick={() => { onView('users'); onPick('all'); onClose(); }}
          >
            <Icon name="users" size={17} /><span>User management</span>
            <em className="sb-count">{num(counts.all)}</em>
          </button>

          <p className="sb-title">Accounts</p>
          {ACCOUNT_LINKS.map((n) => (
            <button key={n.key}
              className={`sb-item ${view === 'users' && roleTab === n.key ? 'is-active' : ''}`}
              onClick={() => { onView('users'); onPick(n.key); onClose(); }}>
              <Icon name={n.icon} size={17} /><span>{n.label}</span>
              <em className="sb-count">{num(counts[n.key])}</em>
            </button>
          ))}
        </nav>

        <div className="sb-foot">
          <span className="sb-me-avatar" aria-hidden="true">{initials(name) || 'AD'}</span>
          <div className="sb-me">
            <strong>{name}</strong>
            <span>{role || 'admin'}</span>
          </div>
          {typeof onLogout === 'function' && (
            <button className="sb-logout" onClick={onLogout} aria-label="Log out" title="Log out">
              <Icon name="logout" size={17} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}