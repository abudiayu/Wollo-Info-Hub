
import React, { useState } from "react";
import "./UniversityAI.css";

const UniversityAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

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

  const universityAnswers = [
    {
      keywords: ["add", "drop"],
      answer: (
        <>
          <strong>Add & Drop Course Problem</strong>

          <p>
            If your Add & Drop request is not working, follow these steps:
          </p>

          <div className="guide-steps">
            <div className="guide-step">
              <span>01</span>
              <div>
                <strong>Registrar Office</strong>
                <p>
                  Go to the Registrar Office, <b>Office No. 22</b>.
                  Explain your Add & Drop problem and show your student ID.
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
                  Ask the Department Head to check your student
                  information and course status in the <b>A+ system</b>.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span>04</span>
              <div>
                <strong>If it is still not solved</strong>
                <p>
                  Return to the Registrar Office and explain that you
                  already checked the issue with your department.
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

          <p>
            For a registration problem, start with the Registrar Office.
          </p>

          <div className="office-card">
            <span className="office-label">FIRST OFFICE</span>
            <h4>Registrar Office</h4>
            <p>Office No. 22</p>
          </div>

          <p>
            Explain exactly what is wrong with your registration and
            provide your student ID.
          </p>

          <p>
            If your registration requires departmental approval,
            visit your Department Head and ask them to check your
            record in the A+ system.
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
            For alumni-related services, please visit or contact the
            University Alumni Office.
          </p>

          <p>
            This can include alumni registration, graduate information,
            verification, documents, or alumni activities.
          </p>

          <div className="assistant-note">
            If you tell me exactly what you need from the Alumni Office,
            I can guide you to the appropriate service.
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

          <p>
            Take your student ID and explain the problem clearly.
          </p>
        </>
      ),
    },

    {
      keywords: ["where", "office"],
      answer: (
        <>
          <strong>Finding the Correct Office</strong>

          <p>
            I can help you find the correct university office.
          </p>

          <p>
            Tell me what problem you are trying to solve.
          </p>

          <div className="example-question">
            “I cannot add a course.”
          </div>

          <div className="example-question">
            “My registration is not working.”
          </div>

          <div className="example-question">
            “I need to contact my department.”
          </div>

          <p>
            I will guide you to the appropriate office and explain
            what you should do next.
          </p>
        </>
      ),
    },
  ];

  const findAnswer = (question) => {
    const text = question.toLowerCase();

    for (const item of universityAnswers) {
      const matches = item.keywords.filter((keyword) =>
        text.includes(keyword)
      );

      if (matches.length > 0) {
        return item.answer;
      }
    }

    return (
      <>
        <strong>Let me help you with that.</strong>

        <p>
          I don't have enough information to identify the exact
          university service yet.
        </p>

        <p>
          Tell me what happened and what you are trying to do.
          For example:
        </p>

        <ul>
          <li>What service are you trying to use?</li>
          <li>What problem appeared?</li>
          <li>Which department are you in?</li>
        </ul>

        <p>
          Once I understand the problem, I can guide you to the
          correct office and next step.
        </p>
      </>
    );
  };

  const sendMessage = (text = input) => {
    if (!text.trim()) return;

    const answer = findAnswer(text);

    setMessages((previous) => [
      ...previous,
      {
        type: "student",
        text,
      },
      {
        type: "assistant",
        content: answer,
      },
    ]);

    setInput("");
  };

  return (
    <div className="university-assistant">

      {!isOpen && (
        <button
          className="assistant-launcher"
          onClick={() => setIsOpen(true)}
        >
          <span>Student Support</span>
          <small>Ask about campus services</small>
        </button>
      )}

      {isOpen && (
        <section className="assistant-window">

          {/* Header */}
          <header className="assistant-header">

            <div className="header-information">
              <div className="university-mark">
                WU
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
            >
              ×
            </button>

          </header>

          {/* Conversation */}
          <main className="assistant-conversation">

            <div className="conversation-intro">
              <span className="intro-line"></span>

              <p>
                University Student Services
              </p>
            </div>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-container ${message.type}`}
              >

                <div className="message-bubble">

                  {message.content ? (
                    message.content
                  ) : (
                    message.text
                  )}

                </div>

              </div>
            ))}

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="suggested-section">

                <p>Popular student questions</p>

                <button
                  onClick={() =>
                    sendMessage(
                      "I have an Add and Drop problem. Where should I go?"
                    )
                  }
                >
                  Add & Drop problem
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "My registration is not working. What should I do?"
                    )
                  }
                >
                  Registration problem
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "Where can I find my Department Head?"
                    )
                  }
                >
                  Contact Department Head
                </button>

                <button
                  onClick={() =>
                    sendMessage(
                      "I need help finding the correct university office."
                    )
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
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Describe your university problem..."
            />

            <button
              className="send-message"
              onClick={() => sendMessage()}
            >
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