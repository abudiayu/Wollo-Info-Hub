import React, { useEffect, useRef, useState } from "react";
import "./UniversityAI.css";

/* Robot + speech bubble drawn to match the reference design.
   bubble={false} shows only the robot (used in the header). */
const RobotIcon = ({ bubble = true, className = "" }) => (
  <svg
    className={`robot-icon ${className}`}
    viewBox={bubble ? "0 0 190 170" : "14 44 132 120"}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {bubble && (
      <g className="robot-bubble">
        <path
          d="M125 8 C152 8 172 24 172 46 C172 62 163 74 150 80 L156 102 L128 84 C126.5 84 125.5 84 125 84 C98 84 78 68 78 46 C78 24 98 8 125 8 Z"
          fill="#5bbde4"
          stroke="#0b2a55"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle className="bubble-dot d1" cx="105" cy="46" r="7" fill="#fff" />
        <circle className="bubble-dot d2" cx="125" cy="46" r="7" fill="#fff" />
        <circle className="bubble-dot d3" cx="145" cy="46" r="7" fill="#fff" />
      </g>
    )}

    {/* Antenna */}
    <line x1="78" y1="62" x2="78" y2="78" stroke="#0b2a55" strokeWidth="4" strokeLinecap="round" />
    <circle cx="78" cy="55" r="7" fill="#2fa8f0" stroke="#0b2a55" strokeWidth="4" />

    {/* Ears */}
    <ellipse cx="29" cy="120" rx="10" ry="15" fill="#5bbde4" stroke="#0b2a55" strokeWidth="5" />
    <ellipse cx="131" cy="120" rx="10" ry="15" fill="#5bbde4" stroke="#0b2a55" strokeWidth="5" />

    {/* Head */}
    <rect x="36" y="76" width="88" height="82" rx="28" fill="#c9e6f8" stroke="#0b2a55" strokeWidth="5" />
    <rect x="56" y="79" width="48" height="12" rx="6" fill="#5bbde4" stroke="#0b2a55" strokeWidth="4" />

    {/* Face screen */}
    <rect x="48" y="98" width="64" height="44" rx="14" fill="#0a2a52" />
    <g className="robot-eyes">
      <circle cx="66" cy="114" r="6" fill="#5bc0de" />
      <circle cx="94" cy="114" r="6" fill="#5bc0de" />
    </g>
    <path
      d="M70 126 Q80 135 90 126"
      fill="none"
      stroke="#5bc0de"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const UniversityAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const conversationRef = useRef(null);
  const timerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Welcome to Wollo University Student Support.",
    },
    {
      type: "assistant",
      text: "Tell me what you need help with. You can ask about registration, Add & Drop, departments, offices, academic services, alumni services, or campus procedures.",
    },
  ]);

  // Keep the latest message in view
  useEffect(() => {
    const el = conversationRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, isOpen]);

  // Clear pending reply timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const universityAnswers = [
    {
      keywords: ["add", "drop"],
      answer: (
        <>
          <strong>Add & Drop Course Problem</strong>

          <p>If your Add & Drop request is not working, follow these steps:</p>

          <div className="guide-steps">
            <div className="guide-step">
              <span>01</span>
              <div>
                <strong>Registrar Office</strong>
                <p>
                  Go to the Registrar Office, <b>Office No. 22</b>. Explain your
                  Add & Drop problem and show your student ID.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span>02</span>
              <div>
                <strong>Department Head</strong>
                <p>
                  After visiting the Registrar, go to your
                  <b> Department Head Office — B2</b>.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span>03</span>
              <div>
                <strong>Check your A+ record</strong>
                <p>
                  Ask the Department Head to check your student information and
                  course status in the <b>A+ system</b>.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span>04</span>
              <div>
                <strong>If it is still not solved</strong>
                <p>
                  Return to the Registrar Office and explain that you already
                  checked the issue with your department.
                </p>
              </div>
            </div>
          </div>

          <div className="assistant-note">
            Bring your student ID and any registration documents with you.
          </div>
        </>
      ),
    },

    {
      keywords: ["registration", "register"],
      answer: (
        <>
          <strong>Registration Problem</strong>

          <p>For a registration problem, start with the Registrar Office.</p>

          <div className="office-card">
            <span className="office-label">FIRST OFFICE</span>
            <h4>Registrar Office</h4>
            <p>Office No. 22</p>
          </div>

          <p>
            Explain exactly what is wrong with your registration and provide
            your student ID.
          </p>

          <p>
            If your registration requires departmental approval, visit your
            Department Head and ask them to check your record in the A+ system.
          </p>
        </>
      ),
    },

    {
      keywords: ["alumni", "alumn"],
      answer: (
        <>
          <strong>Alumni Service</strong>

          <p>
            For alumni-related services, please visit or contact the University
            Alumni Office.
          </p>

          <p>
            This can include alumni registration, graduate information,
            verification, documents, or alumni activities.
          </p>

          <div className="assistant-note">
            If you tell me exactly what you need from the Alumni Office, I can
            guide you to the appropriate service.
          </div>
        </>
      ),
    },

    {
      keywords: ["department head"],
      answer: (
        <>
          <strong>Department Head</strong>

          <p>
            If your problem requires departmental approval or academic
            assistance, you should contact your Department Head.
          </p>

          <div className="office-card">
            <span className="office-label">DEPARTMENT OFFICE</span>
            <h4>Department Head</h4>
            <p>B2 Office</p>
          </div>

          <p>Take your student ID and explain the problem clearly.</p>
        </>
      ),
    },

    {
      keywords: ["where", "office"],
      answer: (
        <>
          <strong>Finding the Correct Office</strong>

          <p>I can help you find the correct university office.</p>

          <p>Tell me what problem you are trying to solve.</p>

          <div className="example-question">“I cannot add a course.”</div>
          <div className="example-question">“My registration is not working.”</div>
          <div className="example-question">“I need to contact my department.”</div>

          <p>
            I will guide you to the appropriate office and explain what you
            should do next.
          </p>
        </>
      ),
    },
  ];

  const findAnswer = (question) => {
    const text = question.toLowerCase();

    for (const item of universityAnswers) {
      const matches = item.keywords.filter((keyword) => text.includes(keyword));
      if (matches.length > 0) return item.answer;
    }

    return (
      <>
        <strong>Let me help you with that.</strong>

        <p>
          I don't have enough information to identify the exact university
          service yet.
        </p>

        <p>Tell me what happened and what you are trying to do. For example:</p>

        <ul>
          <li>What service are you trying to use?</li>
          <li>What problem appeared?</li>
          <li>Which department are you in?</li>
        </ul>

        <p>
          Once I understand the problem, I can guide you to the correct office
          and next step.
        </p>
      </>
    );
  };

  const sendMessage = (text = input) => {
    if (!text.trim() || isTyping) return;

    const answer = findAnswer(text);

    setMessages((previous) => [...previous, { type: "student", text }]);
    setInput("");
    setIsTyping(true);

    timerRef.current = setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        { type: "assistant", content: answer },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="university-assistant">
      {!isOpen && (
        <button
          className="assistant-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Student Support chat"
        >
          <span className="launcher-hint">Need help?</span>
          <RobotIcon className="launcher-robot" />
        </button>
      )}

      {isOpen && (
        <section className="assistant-window" role="dialog" aria-label="Student Support">
          {/* Header */}
          <header className="assistant-header">
            <div className="header-information">
              <div className="assistant-avatar">
                <RobotIcon bubble={false} />
              </div>

              <div>
                <h2>Student Support</h2>
                <div className="assistant-status">
                  <span></span>
                  University Services
                </div>
              </div>
            </div>

            <button
              className="close-assistant"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          {/* Conversation */}
          <main className="assistant-conversation" ref={conversationRef}>
            <div className="conversation-intro">
              <span className="intro-line"></span>
              <p>University Student Services</p>
              <span className="intro-line"></span>
            </div>

            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.type}`}>
                {message.type === "assistant" && (
                  <div className="message-avatar">
                    <RobotIcon bubble={false} />
                  </div>
                )}
                <div className="message-bubble">
                  {message.content ? message.content : message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-container assistant">
                <div className="message-avatar">
                  <RobotIcon bubble={false} />
                </div>
                <div className="message-bubble typing-bubble">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="suggested-section">
                <p>Popular student questions</p>

                <button
                  onClick={() =>
                    sendMessage("I have an Add and Drop problem. Where should I go?")
                  }
                >
                  Add & Drop problem
                </button>

                <button
                  onClick={() =>
                    sendMessage("My registration is not working. What should I do?")
                  }
                >
                  Registration problem
                </button>

                <button
                  onClick={() => sendMessage("Where can I find my Department Head?")}
                >
                  Contact Department Head
                </button>

                <button
                  onClick={() =>
                    sendMessage("I need help finding the correct university office.")
                  }
                >
                  Find an office
                </button>
              </div>
            )}
          </main>

          {/* Input */}
          <div className="assistant-input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Describe your university problem..."
            />

            <button className="send-message" onClick={() => sendMessage()}>
              Send
            </button>
          </div>

          <footer className="assistant-footer">
            Wollo University • Student Information & Support
          </footer>
        </section>
      )}
    </div>
  );
};

export default UniversityAssistant;