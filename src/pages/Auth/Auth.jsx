import { useState } from "react";
import "./Auth.css"
import teamImg from "../../assets/team.jpg";
import Logo from '../../assets/wolloLogo.png';
// import HomePage from "../home/HomePage.jsx";

import CloseIcon from "@mui/icons-material/Close";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const DAYS = [
  { d: "Sun", n: 22 },
  { d: "Mon", n: 23 },
  { d: "Tue", n: 24 },
  { d: "Wed", n: 25 },
  { d: "Thu", n: 26 },
  { d: "Fri", n: 27 },
  { d: "Sat", n: 28 },
];

const emptyForm = { name: "", email: "", password: "", remember: false };

export default function Auth() {
  const [mode, setMode] = useState("signup"); // "signup" | "signin"
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const switchMode = (next) => (e) => {
    e.preventDefault();
    setMode(next);
    setError("");
    setShowPassword(false);
    setForm((p) => ({ ...emptyForm, email: p.email })); // keep typed email
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your real requests
      // isSignup -> POST /auth/register   |   sign in -> POST /auth/login
      await new Promise((r) => setTimeout(r, 1000));
      console.log(isSignup ? "Signed up:" : "Signed in:", form);
    } catch {
      setError(
        isSignup
          ? "Could not create your account. Please try again."
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-card">
        {/* ============ LEFT ============ */}
        <section className="lg-left">
          <div className="lg-logo">
            <a className="ab-navbar-brand" href="/">
                <img src={Logo} alt="Wollo-Info Logo" className="ab-navbar-logo" />
                <span >Wollo-Info</span>
              </a>    
            </div>

          {/* key makes the form re-mount so the fade animation replays */}
          <form
            key={mode}
            className="lg-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <h1>{isSignup ? "Create an account" : "Welcome back"}</h1>
            <p className="lg-sub">
              {isSignup
                ? "Sign up and get 30 day free trial"
                : "Sign in to continue to your account"}
            </p>

            {error && <div className="lg-error">{error}</div>}

            {isSignup && (
              <div className="lg-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Amelie Laurent"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="lg-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="amelielaurent7622@gmail.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="lg-field">
              <label htmlFor="password">Password</label>
              <div className="lg-pass">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="lg-row">
                <label className="lg-check">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  <span className="lg-box" />
                  Remember me
                </label>
                <a href="#forgot" className="lg-forgot">
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? (
                <span className="lg-spinner" />
              ) : isSignup ? (
                "Submit"
              ) : (
                "Sign in"
              )}
            </button>

            <div className="lg-socials">
              <button type="button" className="lg-social">
                <AppleIcon /> Apple
              </button>
              <button type="button" className="lg-social">
                <GoogleIcon /> Google
              </button>
            </div>
          </form>

          <footer className="lg-foot">
            {isSignup ? (
              <span>
                Have any account?{" "}
                <a href="#signin" onClick={switchMode("signin")}>
                  Sign in
                </a>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <a href="#signup" onClick={switchMode("signup")}>
                  Sign up
                </a>
              </span>
            )}
            <a href="#terms">Terms &amp; Conditions</a>
          </footer>
        </section>

        {/* ============ RIGHT ============ */}
        <section className="lg-right">
          <img src={teamImg} alt="Team meeting" className="lg-photo" />

          <button className="lg-close" aria-label="Close">
            <CloseIcon />
          </button>

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
              <i>AL</i>
              <i>JM</i>
              <i>KS</i>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}