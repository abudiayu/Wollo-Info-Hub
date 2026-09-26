import './NexeusFooter.css';

/* ── Social SVG icons ─────────────────────────────────────── */
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 30 30" fill="none" aria-hidden="true" focusable="false">
      <rect width="30" height="30" rx="4" fill="white" />
      <path
        d="M7.5 11.5H10.5V22.5H7.5V11.5ZM9 10C8.17 10 7.5 9.33 7.5 8.5C7.5 7.67 8.17 7 9 7C9.83 7 10.5 7.67 10.5 8.5C10.5 9.33 9.83 10 9 10Z"
        fill="#0A66C2"
      />
      <path
        d="M13 11.5H15.9V12.9H15.94C16.36 12.11 17.38 11.27 18.9 11.27C22 11.27 22.5 13.3 22.5 15.93V22.5H19.5V16.55C19.5 15.39 19.48 13.89 17.88 13.89C16.26 13.89 16 15.16 16 16.47V22.5H13V11.5Z"
        fill="#0A66C2"
      />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" focusable="false">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

function IconMedium() {
  return (
    <svg viewBox="0 0 1043.63 592.71" fill="white" aria-hidden="true" focusable="false">
      <path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460.03 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 279-147.17 279s-147.17-124.94-147.17-279 65.88-279 147.17-279 147.17 124.9 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94s-51.75-111.94-51.75-249.94 23.17-249.94 51.75-249.94 51.76 111.9 51.76 249.94" />
    </svg>
  );
}

export default function NexeusFooter() {
  return (
    <footer className="nx-footer">
      <div className="nx-finner">

        {/* Brand row */}
        <div className="nx-brandrow">
          <svg
            className="nx-mark"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <path fill="#fff" d="M 45.13 1.28 L 54.87 1.28 L 54.87 42.42 L 45.13 38.09 Z" />
            <path fill="#fff" d="M 79.47 12.10 L 87.90 20.53 L 58.80 49.62 L 53.45 38.13 Z" />
            <path fill="#fff" d="M 98.72 45.13 L 98.72 54.87 L 57.58 54.87 L 61.91 45.13 Z" />
            <path fill="#fff" d="M 87.90 79.47 L 79.47 87.90 L 50.38 58.80 L 61.87 53.45 Z" />
            <path fill="#fff" d="M 54.87 98.72 L 45.13 98.72 L 45.13 57.58 L 54.87 61.91 Z" />
            <path fill="#fff" d="M 20.53 87.90 L 12.10 79.47 L 41.20 50.38 L 46.55 61.87 Z" />
            <path fill="#fff" d="M 1.28 54.87 L 1.28 45.13 L 42.42 45.13 L 38.09 54.87 Z" />
            <path fill="#fff" d="M 12.10 20.53 L 20.53 12.10 L 49.62 41.20 L 38.13 46.55 Z" />
          </svg>
          <span className="nx-wordmark">Nexeus</span>
        </div>

        <p className="nx-tagline">
          Change your future today using marketing and growth systems everything
          you need starts here.
        </p>

        {/* Nav columns */}
        <nav className="nx-nav" aria-label="Footer navigation">
          <div className="nx-col nx-c1">
            <h3>SOLUTIONS</h3>
            <ul>
              <li><a href="#">Revenue Acceleration</a></li>
              <li><a href="#">Search Visibility</a></li>
              <li><a href="#">Conversion Optimization</a></li>
              <li><a href="#">Customer Automation</a></li>
            </ul>
          </div>
          <div className="nx-col nx-c2">
            <h3>CAPABILITIES</h3>
            <ul>
              <li><a href="#">Web Architecture</a></li>
              <li><a href="#">Brand Systems</a></li>
              <li><a href="#">Growth Marketing</a></li>
              <li><a href="#">E-commerce Infrastructure</a></li>
            </ul>
          </div>
          <div className="nx-col nx-c3">
            <h3>RESOURCES</h3>
            <ul>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Growth Insights</a></li>
              <li><a href="#">Playbooks</a></li>
              <li><a href="#">Industry Reports</a></li>
            </ul>
          </div>
        </nav>

        <div className="nx-rule" aria-hidden="true" />

        {/* Footer row: legal + socials */}
        <div className="nx-footrow">
          <p className="nx-legal">® 2025 Nexeus all rights reserved.</p>
          <div className="nx-socials">
            <a href="#" aria-label="LinkedIn" className="nx-social-link">
              <IconLinkedIn />
            </a>
            <a href="#" aria-label="GitHub" className="nx-social-link">
              <IconGitHub />
            </a>
            <a href="#" aria-label="Medium" className="nx-social-link">
              <IconMedium />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
