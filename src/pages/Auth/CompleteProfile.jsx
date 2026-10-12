/**
 * src/pages/Auth/CompleteProfile.jsx
 *
 * Shown to students who signed in with Google but have not yet provided
 * their department and student ID number. Only reaches this page from
 * AuthContext when user.profileIncomplete === true.
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import "./CompleteProfile.css";
import Logo from "../../assets/wolloLogo.png";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const BASE = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function publicFetch(path) {
  const res  = await fetch(`${BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export default function CompleteProfile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [departments,   setDepartments]   = useState([]);
  const [deptLoading,   setDeptLoading]   = useState(true);
  const [departmentId,  setDepartmentId]  = useState("");
  const [idNumber,      setIdNumber]      = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState("");

  /* If the user already has a complete profile, skip this page */
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }
    if (!user.profileIncomplete) { navigate("/", { replace: true }); }
  }, [authLoading, user, navigate]);

  /* Load departments */
  const loadDepartments = useCallback(async () => {
    setDeptLoading(true);
    try {
      let data;
      try { data = await publicFetch("/api/public/departments"); }
      catch { data = await publicFetch("/api/departments"); }
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setDepartments(list);
    } catch {
      setError("Could not load departments. Please refresh the page.");
    } finally {
      setDeptLoading(false);
    }
  }, []);

  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!departmentId)     { setError("Please select your department.");      return; }
    if (!idNumber.trim())  { setError("Please enter your student ID number."); return; }

    setSubmitting(true);
    try {
      await api.post("/api/auth/complete-profile", {
        department_id: departmentId,
        id_number:     idNumber.trim(),
      });
      /* Force a full page reload so AuthContext re-fetches /api/auth/me
         and clears profileIncomplete */
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="cp-page">
      <div className="cp-card">
        {/* Logo */}
        <div className="cp-logo">
          <Link to="/">
            <img src={Logo} alt="Wollo-Info Logo" className="cp-logo-img" />
            <span>Wollo-Info</span>
          </Link>
        </div>

        <h1 className="cp-title">Complete your profile</h1>
        <p className="cp-sub">
          Welcome{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!
          Please fill in a few details so we can connect you to your department.
        </p>

        {error && (
          <div className="lg-error" role="alert">{error}</div>
        )}

        <form className="cp-form" noValidate onSubmit={handleSubmit}>
          {/* Department */}
          <div className="lg-field">
            <label htmlFor="cp-dept">Department</label>
            <div className="lg-select-wrap">
              <select
                id="cp-dept"
                className="lg-select"
                value={departmentId}
                onChange={(e) => { setDepartmentId(e.target.value); setError(""); }}
                disabled={deptLoading}
                required
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
          </div>

          {/* Student ID */}
          <div className="lg-field">
            <label htmlFor="cp-id">Student ID number</label>
            <input
              id="cp-id"
              type="text"
              className="cp-input"
              placeholder="e.g. WU/0123/14"
              value={idNumber}
              onChange={(e) => { setIdNumber(e.target.value); setError(""); }}
              required
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="lg-submit"
            disabled={submitting || deptLoading}
          >
            {submitting ? <span className="lg-spinner" /> : "Save and continue"}
          </button>
        </form>

        <p className="cp-note">
          You can update these details later in your profile settings.
        </p>
      </div>
    </div>
  );
}
