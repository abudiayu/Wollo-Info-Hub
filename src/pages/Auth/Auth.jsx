import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Auth.css";
import teamImg from "../../assets/team.jpg";
import Logo    from "../../assets/wolloLogo.png";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../lib/supabaseClient";
// clearSession is used after dept-head login to ensure clean state
import { clearSession } from "../../lib/api";

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

const emptyForm = {
  name: "", email: "", password: "", remember: false,
  department_id: "", id_number: "",
};

/* Token key — must match DepartmentHead.jsx */
const DEPT_HEAD_TOKEN_KEY = "dept_head_token";
const DEPT_HEAD_ROUTE     = "/department-head";
const GOOGLE_PENDING_KEY  = "google_oauth_pending";
const GOOGLE_FROM_KEY     = "google_oauth_from";
const BASE = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/* ─── tiny public fetch helper (no auth token needed) ─── */
async function apiFetch(path, opts = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
  } catch {
    throw new Error("Server is starting or unreachable — please try again in a moment.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

export default function Auth() {
  const { login, register, user, loading: authLoading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  /* After student login/register go back where they came from */
  const from = location.state?.from?.pathname || "/";

  /* mode: "signin" | "signup" | "depthead" */
  const [mode,          setMode]          = useState("signin");
  const [form,          setForm]          = useState(emptyForm);
  const [showPassword,  setShowPassword]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(
    () => !!sessionStorage.getItem(GOOGLE_PENDING_KEY)
  );
  const [error, setError] = useState("");

  /* Departments for the signup dropdown */
  const [departments,     setDepartments]     = useState([]);
  const [deptLoading,     setDeptLoading]     = useState(false);
  const [deptLoadError,   setDeptLoadError]   = useState("");

  const isSignup   = mode === "signup";
  const isDeptHead = mode === "depthead";

  /* ── Load departments once when entering signup mode ── */
  const loadDepartments = useCallback(async () => {
    setDeptLoading(true);
    setDeptLoadError("");
    try {
      const data = await apiFetch("/api/public/departments");
      // Accept both shapes: { departments: [...] }  OR  flat array  OR  { data: [...] }
      const list =
        Array.isArray(data)              ? data :
        Array.isArray(data?.departments) ? data.departments :
        Array.isArray(data?.data)        ? data.data :
        [];
      if (list.length === 0) {
        setDeptLoadError("No departments found. Contact your administrator.");
      } else {
        setDepartments(list);
      }
    } catch (err) {
      setDeptLoadError(err?.message || "Could not load departments.");
    } finally {
      setDeptLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSignup) loadDepartments();
  }, [isSignup, loadDepartments]);

  /* ── Finish Google login after redirect back to /auth ── */
  useEffect(() => {
    if (!sessionStorage.getItem(GOOGLE_PENDING_KEY)) return;
    if (authLoading) return;

    const clearPending = () => {
      sessionStorage.removeItem(GOOGLE_PENDING_KEY);
    };

    if (user) {
      const target = sessionStorage.getItem(GOOGLE_FROM_KEY) || "/";
      sessionStorage.removeItem(GOOGLE_FROM_KEY);
      clearPending();
      /* If the student's profile is incomplete, send them to complete-profile */
      if (user.profileIncomplete) {
        navigate("/complete-profile", { replace: true });
      } else {
        navigate(target, { replace: true });
      }
      return;
    }

    const params   = new URLSearchParams(window.location.search);
    const urlError = params.get("error_description");
    clearPending();
    sessionStorage.removeItem(GOOGLE_FROM_KEY);
    setGoogleLoading(false);
    setError(
      urlError ||
      "Google sign-in could not be completed. Please try again."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

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

  /* ── Google sign-in ── */
  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;
    setError("");
    setGoogleLoading(true);

    sessionStorage.setItem(GOOGLE_PENDING_KEY, "1");
    sessionStorage.setItem(GOOGLE_FROM_KEY, from);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: { prompt: "select_account" },
      },
    });

    if (oauthError) {
      sessionStorage.removeItem(GOOGLE_PENDING_KEY);
      sessionStorage.removeItem(GOOGLE_FROM_KEY);
      setError(oauthError.message || "Could not start Google sign-in.");
      setGoogleLoading(false);
    }
  };

  /* ── Department Head login ── */
  const handleDeptHeadSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!form.email.trim()) { setError("Please enter your email.");    return; }
    if (!form.password)     { setError("Please enter your password."); return; }

    setLoading(true);
    setError("");
    localStorage.removeItem(DEPT_HEAD_TOKEN_KEY);

    try {
      const data = await apiFetch("/api/department-head/login", {
        method: "POST",
        body:   JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      const token        = data.token || data.access_token;
      const refreshToken = data.refresh_token;

      if (!token) {
        throw new Error("Login succeeded but no token was returned by the server.");
      }

      // Store for DepartmentHead.jsx API calls
      localStorage.setItem(DEPT_HEAD_TOKEN_KEY, token);

      // Also register with the Supabase client so ProtectedRoute's
      // AuthContext can confirm role = 'head'
      if (refreshToken) {
        await supabase.auth.setSession({
          access_token:  token,
          refresh_token: refreshToken,
        });
      }

      navigate(DEPT_HEAD_ROUTE, { replace: true });
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
    if (loading) return;

    /* Client-side validation */
    if (isSignup && !form.name.trim())
      { setError("Please enter your full name."); return; }
    if (!form.email.trim())
      { setError("Please enter your email."); return; }
    if (!form.password)
      { setError("Please enter your password."); return; }
    if (isSignup && form.password.length < 6)
      { setError("Password must be at least 6 characters."); return; }

    /* Student-specific fields */
    if (isSignup) {
      if (!form.department_id)
        { setError("Please select your department."); return; }
      if (!form.id_number.trim())
        { setError("Please enter your student ID number."); return; }
    }

    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const result = await register(
          form.name.trim(),
          form.email.trim(),
          form.password,
          undefined,          // username — optional
          form.department_id,
          form.id_number.trim()
        );
        if (result?.confirmEmail) {
          setError(result.message || "Check your email to confirm your account, then sign in.");
          setLoading(false);
          return;
        }
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

  const handleSubmit = isDeptHead ? handleDeptHeadSubmit : handleStudentSubmit;

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
          <form key={mode} className="lg-form" noValidate onSubmit={handleSubmit}>

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

            {error && (
              <div className="lg-error" role="alert">{error}</div>
            )}

            {/* Full name — signup only */}
            {isSignup && (
              <div className="lg-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name" name="name" type="text"
                  placeholder="Abdu Kadir" autoComplete="name"
                  value={form.name} onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="lg-field">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com" autoComplete="email"
                value={form.email} onChange={handleChange}
                required
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
                  required
                />
                <button
                  type="button" className="lg-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <VisibilityOffOutlinedIcon />
                    : <VisibilityOutlinedIcon />}
                </button>
              </div>
            </div>

            {/* ── Student-only signup fields ── */}
            {isSignup && (
              <>
                {/* Department dropdown */}
                <div className="lg-field">
                  <label htmlFor="department_id">Department</label>
                  {deptLoadError ? (
                    <div className="lg-dept-error">
                      <span>{deptLoadError}</span>
                      <button type="button" className="lg-dept-retry" onClick={loadDepartments}>
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="lg-select-wrap">
                      <select
                        id="department_id"
                        name="department_id"
                        className="lg-select"
                        value={form.department_id}
                        onChange={handleChange}
                        disabled={deptLoading}
                        required
                        aria-busy={deptLoading}
                      >
                        <option value="">
                          {deptLoading ? "Loading departments…" : "— Select your department —"}
                        </option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name_en || d.name}
                          </option>
                        ))}
                      </select>
                      {deptLoading && <span className="lg-select-spinner" aria-hidden="true" />}
                    </div>
                  )}
                </div>

                {/* Student ID number */}
                <div className="lg-field">
                  <label htmlFor="id_number">Student ID number</label>
                  <input
                    id="id_number" name="id_number" type="text"
                    placeholder="e.g. WU/0123/14"
                    autoComplete="off"
                    value={form.id_number} onChange={handleChange}
                    required
                    spellCheck={false}
                  />
                </div>
              </>
            )}

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
              disabled={loading || googleLoading}
            >
              {loading
                ? <span className="lg-spinner" />
                : isDeptHead
                  ? "Sign in to dashboard"
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
            </button>

            {/* Social buttons — students only */}
            {!isDeptHead && (
              <div className="lg-socials">
                <button type="button" className="lg-social" disabled>
                  <AppleIcon /> Apple
                </button>
                <button
                  type="button"
                  className="lg-social"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                >
                  <GoogleIcon /> {googleLoading ? "Connecting…" : "Google"}
                </button>
              </div>
            )}

            {/* Dept-head helper */}
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
            <Link to="/">Terms &amp; Conditions</Link>
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
