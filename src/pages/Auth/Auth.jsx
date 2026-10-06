import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Auth.css";
import teamImg from "../../assets/team.jpg";
import Logo    from "../../assets/wolloLogo.png";
import { useAuth } from "../../context/AuthContext";

import CloseIcon                 from "@mui/icons-material/Close";
import AppleIcon                 from "@mui/icons-material/Apple";
import GoogleIcon                from "@mui/icons-material/Google";
import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import MoreHorizIcon             from "@mui/icons-material/MoreHoriz";

const DAYS = [
  { d: "Sun", n: 22 }, { d: "Mon", n: 23 }, { d: "Tue", n: 24 },
  { d: "Wed", n: 25 }, { d: "Thu", n: 26 }, { d: "Fri", n: 27 },
  { d: "Sat", n: 28 },
];

const emptyForm = { name: "", email: "", password: "", remember: false };

/* Department-head token key — must match DepartmentHead.jsx */
const DEPT_HEAD_TOKEN_KEY = "dept_head_token";
const BASE = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* After student login/register, go back to where they came from */
  const from = location.state?.from?.pathname || "/";

  /* mode: "signin" | "signup" | "depthead" */
  const [mode,         setMode]         = useState("signin");
  const [form,         setForm]         = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const isSignup   = mode === "signup";
  const isDeptHead = mode === "depthead";

  const switchMode = (next) => (e) => {
    e.preventDefault();
    setMode(next);
    setError("");
    setShowPassword(false);
    setForm((p) => ({ ...emptyForm, email: p.email }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  /* ── Department head login ── */
  const handleDeptHeadSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim())  { setError("Please enter your email."); return; }
    if (!form.password)      { setError("Please enter your password."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/api/department-head/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || `Sign-in failed (${res.status})`);
      }

      /* Store dept-head token and redirect to dashboard */
      localStorage.setItem(DEPT_HEAD_TOKEN_KEY, data.token);
      navigate("/department-head", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Make sure the backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Student login / register ── */
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (isSignup && !form.name.trim())       { setError("Please enter your full name."); return; }
    if (!form.email.trim())                  { setError("Please enter your email."); return; }
    if (!form.password)                      { setError("Please enter your password."); return; }
    if (isSignup && form.password.length < 6){ setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        await register(form.name.trim(), form.email.trim(), form.password);
      } else {
        await login(form.email.trim(), form.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Form content varies by mode ── */
  const formProps = isDeptHead
    ? { onSubmit: handleDeptHeadSubmit }
    : { onSubmit: handleStudentSubmit };

  return (
    <div className="lg-page">
      <div className="lg-card">

        {/* ══════════ LEFT ══════════ */}
        <section className="lg-left">
          <div className="lg-logo">
            <Link className="ab-navbar-brand" to="/">
              <img src={Logo} alt="Wollo-Info Logo" className="ab-navbar-logo" />
              <span>Wollo-Info</span>
            </Link>
          </div>

          {/* ── Mode tabs ── */}
          <div className="lg-tabs" role="tablist">
            <button
              role="tab" type="button"
              className={`lg-tab ${mode === "signin" ? "active" : ""}`}
              aria-selected={mode === "signin"}
              onClick={switchMode("signin")}
            >Sign in</button>
            <button
              role="tab" type="button"
              className={`lg-tab ${mode === "signup" ? "active" : ""}`}
              aria-selected={mode === "signup"}
              onClick={switchMode("signup")}
            >Sign up</button>
            <button
              role="tab" type="button"
              className={`lg-tab lg-tab--dept ${mode === "depthead" ? "active" : ""}`}
              aria-selected={mode === "depthead"}
              onClick={switchMode("depthead")}
            >Dept. Head</button>
          </div>

          {/* ── Form ── */}
          <form key={mode} className="lg-form" noValidate {...formProps}>

            {isDeptHead ? (
              <>
                <h1>Department Head</h1>
                <p className="lg-sub">Sign in to manage your department</p>
              </>
            ) : (
              <>
                <h1>{isSignup ? "Create an account" : "Welcome back"}</h1>
                <p className="lg-sub">
                  {isSignup ? "Sign up and get full access" : "Sign in to continue to your account"}
                </p>
              </>
            )}

            {error && <div className="lg-error" role="alert">{error}</div>}

            {/* Full name — signup only */}
            {isSignup && (
              <div className="lg-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name" name="name" type="text"
                  placeholder="Abdu Kadir" autoComplete="name"
                  value={form.name} onChange={handleChange}
                />
              </div>
            )}

            <div className="lg-field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com" autoComplete="email"
                value={form.email} onChange={handleChange}
              />
            </div>

            <div className="lg-field">
              <label htmlFor="password">Password</label>
              <div className="lg-pass">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={form.password} onChange={handleChange}
                />
                <button
                  type="button" className="lg-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </div>
            </div>

            {/* Remember me — sign-in and dept-head */}
            {!isSignup && (
              <div className="lg-row">
                <label className="lg-check">
                  <input
                    type="checkbox" name="remember"
                    checked={form.remember} onChange={handleChange}
                  />
                  <span className="lg-box" />
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              className={`lg-submit ${isDeptHead ? "lg-submit--dept" : ""}`}
              disabled={loading}
            >
              {loading
                ? <span className="lg-spinner" />
                : isDeptHead
                  ? "Sign in to dashboard"
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
            </button>

            {/* Social buttons — only for students */}
            {!isDeptHead && (
              <div className="lg-socials">
                <button type="button" className="lg-social">
                  <AppleIcon /> Apple
                </button>
                <button type="button" className="lg-social">
                  <GoogleIcon /> Google
                </button>
              </div>
            )}

            {/* Dept-head helper text */}
            {isDeptHead && (
              <p className="lg-dept-hint">
                Department head accounts are created by the university admin.
                Contact your administrator if you don&apos;t have credentials.
              </p>
            )}
          </form>

          <footer className="lg-foot">
            {!isDeptHead && (
              isSignup ? (
                <span>
                  Already have an account?{" "}
                  <a href="#signin" onClick={switchMode("signin")}>Sign in</a>
                </span>
              ) : (
                <span>
                  No account?{" "}
                  <a href="#signup" onClick={switchMode("signup")}>Sign up</a>
                </span>
              )
            )}
            {isDeptHead && (
              <span>
                Not a department head?{" "}
                <a href="#signin" onClick={switchMode("signin")}>Student sign in</a>
              </span>
            )}
            <a href="/">Terms &amp; Conditions</a>
          </footer>
        </section>

        {/* ══════════ RIGHT ══════════ */}
        <section className="lg-right">
          <img src={teamImg} alt="Team meeting" className="lg-photo" />
          <Link to="/" className="lg-close" aria-label="Go home">
            <CloseIcon />
          </Link>
          <div className="lg-task">
            <strong>Task Review With Team</strong>
            <span>09:30am – 10:00am</span>
          </div>
          <div className="lg-avatar a1">AL</div>
          <div className="lg-avatar a2">JM</div>
          <div className="lg-avatar a3">KS</div>
          <div className="lg-cal">
            {DAYS.map((x) => (
              <div key={x.n} className={`lg-day ${x.n === 25 ? "active" : ""}`}>
                <small>{x.d}</small>
                <b>{x.n}</b>
              </div>
            ))}
          </div>
          <div className="lg-meet">
            <div className="lg-meet-top">
              <strong>Daily Meeting</strong>
              <MoreHorizIcon fontSize="small" />
            </div>
            <span>12:00pm – 01:00pm</span>
            <div className="lg-stack">
              <i>AL</i><i>JM</i><i>KS</i>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
