import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="nf-page">
      <section className="nf-wrap">
        {/* oops! */}
        <h2 className="nf-oops" aria-hidden="true">
          o
          <svg className="nf-oops-face" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9.5" fill="#111" stroke="#ff3b3b" strokeWidth="2.4" />
            <path
              d="M8.2 8.2l7.6 7.6M15.8 8.2l-7.6 7.6"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          ps!
        </h2>

        {/* 4 0 4 with the unplugged man */}
        <svg
          className="nf-art"
          viewBox="0 0 630 270"
          role="img"
          aria-label="404 - the number four, a zero with a man holding two unplugged cables, and another four"
        >
          <g
            fill="none"
            stroke="#ff3b3b"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* left 4 */}
            <path d="M150 18 L26 172 H204 M150 18 V246" />
            {/* zero */}
            <ellipse cx="315" cy="152" rx="78" ry="90" />
            {/* right 4 */}
            <path d="M554 18 L430 172 H608 M554 18 V246" />
          </g>

          {/* cords lying on the ground */}
          <g fill="none" stroke="#111" strokeWidth="2.4" strokeLinecap="round">
            <path d="M279 190 C 272 214, 262 240, 238 252 S 196 257, 168 250" />
            <path d="M351 190 C 358 214, 372 240, 396 252 S 440 246, 470 255 S 520 250, 548 254" />
          </g>

          {/* the man */}
          <g className="nf-man" fill="#111">
            {/* hat */}
            <rect x="307" y="64" width="16" height="11" rx="4" />
            <rect x="300" y="74" width="30" height="4" rx="2" />
            {/* head */}
            <circle cx="315" cy="87" r="9" />
            {/* torso */}
            <rect x="289" y="97" width="52" height="76" rx="18" />
            {/* arms */}
            <path
              d="M293 110 C 276 126, 274 152, 279 174 M337 110 C 354 126, 356 152, 351 174"
              fill="none"
              stroke="#111"
              strokeWidth="13"
              strokeLinecap="round"
            />
            {/* legs */}
            <rect x="298" y="168" width="15" height="80" rx="5" />
            <rect x="317" y="168" width="15" height="80" rx="5" />
            {/* plugs */}
            <rect x="273" y="174" width="12" height="11" rx="3" />
            <rect x="345" y="174" width="12" height="11" rx="3" />
            <path
              d="M276.5 185v6M281.5 185v6M348.5 185v6M353.5 185v6"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>

        <h1 className="nf-title">404 Error Page Not Found</h1>
        <p className="nf-text">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <button type="button" className="nf-btn" onClick={() => navigate("/")}>
          <HomeRoundedIcon />
          Back to Home
        </button>
      </section>
    </main>
  );
}