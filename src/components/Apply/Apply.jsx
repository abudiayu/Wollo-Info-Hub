import React, { useEffect, useState } from 'react'
import './Apply.css'

const DEPARTMENTS = [
  'Freshman (not decided yet)',
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Business Administration',
  'Accounting & Finance',
  'Economics',
  'Natural Science',
  'Health Science',
  'Civil Engineering',
  'Mechanical Engineering',
  'Social Science',
  'Education',
]

const REQUEST_TYPES = [
  { value: 'apply', label: 'Apply (admission)' },
  { value: 'comment', label: 'Leave a comment' },
  { value: 'suggestion', label: 'Give a suggestion' },
  { value: 'connect-dev', label: 'Connect with the web developer' },
  { value: 'report-error', label: 'Report an error' },
  { value: 'other', label: 'Other' },
]

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
  { value: 'other', label: 'Other' },
]

const MAX_CHARS = 500
const DRAFT_KEY = 'apply-draft'

const EMPTY_FORM = {
  name: '',
  email: '',
  role: 'student',
  department: '',
  requestType: 'apply',
  message: '',
}

function Apply({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)

  // Load saved draft whenever the popup opens
  useEffect(() => {
    if (!isOpen) return
    setSubmitted(false)
    setErrors({})
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      setForm(draft ? { ...EMPTY_FORM, ...JSON.parse(draft) } : EMPTY_FORM)
    } catch {
      setForm(EMPTY_FORM)
    }
  }, [isOpen])

  // Close on Escape + lock page scroll while open
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isApplying = form.requestType === 'apply'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setDraftSaved(false)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!form.email.trim()) next.email = 'Please enter your email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (isApplying && form.role === 'student' && !form.department)
      next.department = 'Please choose a department'
    if (!isApplying && !form.message.trim())
      next.message = 'Please write a short message'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
      setDraftSaved(true)
    } catch {
      /* storage unavailable */
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      // Connect your backend here, e.g. via the onSubmit prop
      if (onSubmit) await onSubmit(form)
      else console.log('Application submitted:', form)
      localStorage.removeItem(DRAFT_KEY)
      setSubmitted(true)
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="apply-overlay" onMouseDown={onClose}>
      <div
        className="apply-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="apply-header">
          <div className="apply-header-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c3 2 9 2 12 0v-5" />
            </svg>
          </div>
          <div>
            <h2 id="apply-title">Apply now</h2>
            <p>Tell us a little about yourself and what you need.</p>
          </div>
          <button type="button" className="apply-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {submitted ? (
          <div className="apply-success">
            <div className="apply-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3>Thank you, {form.name.split(' ')[0]}!</h3>
            <p>We received your message and will get back to you at {form.email}.</p>
            <button type="button" className="apply-btn apply-btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit} noValidate>
            <div className="apply-field">
              <label htmlFor="apply-name">Full name<span>*</span></label>
              <input
                id="apply-name"
                name="name"
                type="text"
                placeholder="e.g. Abdulqadir Mohammed"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'has-error' : ''}
                autoFocus
              />
              {errors.name && <small className="apply-error">{errors.name}</small>}
            </div>

            <div className="apply-field">
              <label htmlFor="apply-email">Email<span>*</span></label>
              <input
                id="apply-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'has-error' : ''}
              />
              {errors.email && <small className="apply-error">{errors.email}</small>}
            </div>

            <div className="apply-row">
              <div className="apply-field">
                <label htmlFor="apply-role">I am a</label>
                <select id="apply-role" name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="apply-field">
                <label htmlFor="apply-type">What do you need?</label>
                <select id="apply-type" name="requestType" value={form.requestType} onChange={handleChange}>
                  {REQUEST_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {isApplying && (
              <div className="apply-field">
                <label htmlFor="apply-dept">
                  Department{form.role === 'student' && <span>*</span>}
                </label>
                <select
                  id="apply-dept"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={errors.department ? 'has-error' : ''}
                >
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <small className="apply-error">{errors.department}</small>}
              </div>
            )}

            <div className="apply-field">
              <label htmlFor="apply-message">
                {isApplying ? 'Comment (optional)' : 'Message'}
                {!isApplying && <span>*</span>}
              </label>
              <textarea
                id="apply-message"
                name="message"
                rows={4}
                maxLength={MAX_CHARS}
                placeholder="e.g. Write your comment, suggestion, error details, or anything else you want us to know..."
                value={form.message}
                onChange={handleChange}
                className={errors.message ? 'has-error' : ''}
              />
              <div className="apply-meta">
                {errors.message ? (
                  <small className="apply-error">{errors.message}</small>
                ) : (
                  <small>{draftSaved ? 'Draft saved ✓' : ''}</small>
                )}
                <small>{MAX_CHARS - form.message.length} characters left</small>
              </div>
            </div>

            {errors.form && <small className="apply-error">{errors.form}</small>}

            <footer className="apply-footer">
              <button type="button" className="apply-btn apply-btn-secondary" onClick={handleSaveDraft}>
                Save as draft
              </button>
              <button type="submit" className="apply-btn apply-btn-primary">
                {isApplying ? 'Submit application' : 'Send'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  )
}

export default Apply;