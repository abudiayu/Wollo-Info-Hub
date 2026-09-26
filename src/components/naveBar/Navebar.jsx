import React from 'react';
import "./NaveBar.css"

function Navebar() {
  return (
    <div className="ab-navbar-container">
      {/* Nav bar */}
      <nav className="ab-navbar" aria-label="Primary">
        <a className="ab-navbar-brand" href="#">
          <svg className="ab-navbar-mark" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M45.13 1.28 L54.87 1.28 L54.87 42.42 L45.13 38.09 Z" />
            <path d="M79.47 12.10 L87.90 20.53 L58.80 49.62 L53.45 38.13 Z" />
            <path d="M98.72 45.13 L98.72 54.87 L57.58 54.87 L61.91 45.13 Z" />
            <path d="M87.90 79.47 L79.47 87.90 L50.38 58.80 L61.87 53.45 Z" />
            <path d="M54.87 98.72 L45.13 98.72 L45.13 57.58 L54.87 61.91 Z" />
            <path d="M20.53 87.90 L12.10 79.47 L41.20 50.38 L46.55 61.87 Z" />
            <path d="M1.28 54.87 L1.28 45.13 L42.42 45.13 L38.09 54.87 Z" />
            <path d="M12.10 20.53 L20.53 12.10 L49.62 41.20 L38.13 46.55 Z" />
          </svg>
          <span className="ab-navbar-word">Nexeus</span>
        </a>

        <div className="ab-navbar-links">
          <a href="#">Solutions</a>
          <a href="#">Capabilities</a>
          <a href="#">Resources</a>
        </div>

        <a className="ab-navbar-cta" href="#">Take Control</a>
      </nav>
    </div>
  )
}

export default Navebar;