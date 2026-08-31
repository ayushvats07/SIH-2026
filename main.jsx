import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const pages = [
  "Welcome",
  "Sign In",
  "Patient Registration",
  "Consent & Privacy",
  "Patient Profile",
  "Case Wizard",
  "Chief Complaint",
  "History",
  "Lifestyle",
  "AYUSH Assessment",
  "Vitals & Examination"
];

function App() {
  const [page, setPage] = useState(1);

  const next = () => setPage((p) => Math.min(p + 1, 11));
  const back = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logoIcon">❤</div>
          <div>
            <h2>Nova</h2>
            <small>Clinical Case Taking</small>
          </div>
        </div>

        <div className="user">
          <div className="avatar">SK</div>
          <span>Shivam Kaushik</span>
        </div>
      </header>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <p className="sidebarTitle">CASE WORKFLOW</p>

          {pages.map((name, index) => (
            <button
              key={name}
              className={`navItem ${
                page === index + 1 ? "active" : ""
              }`}
              onClick={() => setPage(index + 1)}
            >
              <span className="number">
                {index + 1}
              </span>

              {name}
            </button>
          ))}

        </aside>

        {/* MAIN CONTENT */}
        <main className="content">

          {page === 1 && <Page1 next={next} />}

          {page === 2 && (
            <Page2 next={next} back={back} />
          )}

          {page === 3 && (
            <Page3 next={next} back={back} />
          )}

          {page === 4 && (
            <Page4 next={next} back={back} />
          )}

          {page === 5 && (
            <Page5 next={next} back={back} />
          )}

          {page === 6 && (
            <Page6 next={next} back={back} />
          )}

          {page === 7 && (
            <Page7 next={next} back={back} />
          )}

          {page === 8 && (
            <Page8 next={next} back={back} />
          )}

          {page === 9 && (
            <Page9 next={next} back={back} />
          )}

          {page === 10 && (
            <Page10 next={next} back={back} />
          )}

          {page === 11 && (
            <Page11 back={back} />
          )}

        </main>
      </div>
    </div>
  );
}


/* =========================
   PAGE 1
========================= */

function Page1({ next }) {
  return (
    <div className="landing">

      <section className="hero">

        <div className="heroText">

          <span className="badge">
            ✨ Digital Clinical Workflow
          </span>

          <h1>
            Take every patient story
            <br />
            <span>from first visit to insight.</span>
          </h1>

          <p>
            A calm, structured workspace for capturing
            patient identity, consent, symptoms, history,
            lifestyle and examination data.
          </p>

          <button className="primary" onClick={next}>
            Start a Case →
          </button>

          <p className="privacy">
            🔒 Privacy-first by design · Autosaves locally
          </p>

        </div>

        <div className="heroVisual">

          <div className="floatingCard">
            <b>✓ Consent captured</b>
            <small>All required fields</small>
          </div>

          <div className="floatingCard second">
            <b>Case progress</b>
            <small>Vitals ready · 80%</small>
          </div>

        </div>

      </section>

      <div className="featureGrid">

        <Feature
          icon="👤"
          title="Patient Identity"
          text="Capture demographics and emergency details."
        />

        <Feature
          icon="📋"
          title="Structured Case"
          text="Turn complaints into useful clinical data."
        />

        <Feature
          icon="🛡"
          title="Trust Built In"
          text="Clear consent, privacy and autosave states."
        />

      </div>

    </div>
  );
}


/* =========================
   PAGE 2
========================= */

function Page2({ next, back }) {

  const [role, setRole] = useState("Practitioner");

  return (
    <Page title="Welcome back"
      subtitle="Choose your role to enter the clinical workspace.">

      <div className="roleGrid">

        {["Practitioner", "Patient"].map((r) => (

          <button
            key={r}
            className={`roleCard ${
              role === r ? "selected" : ""
            }`}
            onClick={() => setRole(r)}
          >

            <div className="roleIcon">
              {r === "Practitioner" ? "🩺" : "👤"}
            </div>

            <div>
              <b>{r}</b>
              <small>
                {r === "Practitioner"
                  ? "Capture and review clinical cases"
                  : "View your patient journey"}
              </small>
            </div>

          </button>

        ))}

      </div>

      <div className="card">

        <h3>Demo Sign In</h3>

        <label>
          Email or phone
          <input placeholder="name@example.com" />
        </label>

        <label>
          Access code
          <input type="password" placeholder="••••••••" />
        </label>

        <button className="primary full" onClick={next}>
          Continue as {role}
        </button>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 3
========================= */

function Page3({ next, back }) {

  return (
    <Page
      title="Register patient"
      subtitle="Build the core patient profile before starting the case."
    >

      <div className="card">

        <h3>Patient Identity</h3>

        <div className="grid2">

          <Input label="Full name" />
          <Input label="Date of birth" type="date" />

          <Input label="Age" placeholder="e.g. 28" />

          <Select
            label="Sex"
            options={[
              "Female",
              "Male",
              "Intersex",
              "Prefer not to say"
            ]}
          />

          <Input label="Contact number" />
          <Input label="Preferred language" />

          <Input label="Address" />
          <Input label="Emergency contact" />

          <Input label="Occupation" />

        </div>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 4
========================= */

function Page4({ next, back }) {

  const [clinical, setClinical] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <Page
      title="Consent & Privacy"
      subtitle="Keep the patient informed with plain-language choices."
    >

      <div className="card">

        <div className="privacyBox">
          🛡️
          <div>
            <b>Your information stays in context.</b>
            <small>
              This prototype stores information locally
              in the browser.
            </small>
          </div>
        </div>

        <CheckBox
          checked={clinical}
          setChecked={setClinical}
          title="I consent to clinical case-taking"
          text="My information may be recorded to support this consultation."
        />

        <CheckBox
          checked={privacy}
          setChecked={setPrivacy}
          title="I have read the privacy notice"
          text="I understand how information is used."
        />

        <CheckBox
          title="Optional: allow de-identified learning use"
          text="This is optional."
        />

      </div>

      <Navigation
        back={back}
        next={next}
        disabled={!(clinical && privacy)}
      />

    </Page>
  );
}


/* =========================
   PAGE 5
========================= */

function Page5({ next, back }) {

  return (
    <Page
      title="Patient Profile"
      subtitle="A quick overview before entering the case-taking workflow."
    >

      <div className="profileGrid">

        <div className="card profile">

          <div className="profileHeader">

            <div className="bigAvatar">
              DP
            </div>

            <div>
              <h2>Demo Patient</h2>
              <p>28 years · Female</p>
            </div>

            <span className="status">
              ● Active Case
            </span>

          </div>

          <div className="stats">

            <div>
              <small>Last Visit</small>
              <b>Today</b>
            </div>

            <div>
              <small>Completion</small>
              <b>80%</b>
            </div>

            <div>
              <small>Language</small>
              <b>English</b>
            </div>

          </div>

        </div>

        <div className="card">

          <h3>Recent Activity</h3>

          <Activity text="Patient registered" />
          <Activity text="Consent recorded" />
          <Activity text="Case intake started" />

        </div>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 6
========================= */

function Page6({ next, back }) {

  return (
    <Page
      title="Clinical Case-Taking"
      subtitle="Move through each section in order."
    >

      <div className="wizard">

        <div className="card wizardMenu">

          <h3>New Case</h3>

          {[
            "Chief Complaint",
            "History",
            "Lifestyle",
            "AYUSH Assessment",
            "Vitals / Examination"
          ].map((x, i) => (

            <div className="wizardItem" key={x}>
              <span>{i + 1}</span>
              {x}
            </div>

          ))}

        </div>

        <div className="card wizardIntro">

          <div className="bigIcon">🩺</div>

          <h2>
            Let's capture the patient's story.
          </h2>

          <p>
            Start with what brought the patient in today,
            then add relevant history, lifestyle,
            AYUSH observations and examination findings.
          </p>

          <button className="primary" onClick={next}>
            Begin Case →
          </button>

        </div>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 7
========================= */

function Page7({ next, back }) {

  const symptoms = [
    "Pain",
    "Fatigue",
    "Fever",
    "Cough",
    "Headache",
    "Digestive Issue",
    "Sleep Issue"
  ];

  const [selected, setSelected] = useState([]);

  const toggle = (s) => {

    if (selected.includes(s)) {
      setSelected(selected.filter(x => x !== s));
    } else {
      setSelected([...selected, s]);
    }

  };

  return (
    <Page
      title="What brings the patient in today?"
      subtitle="Use quick chips for common symptoms."
    >

      <div className="card">

        <label>
          Primary Complaint

          <textarea
            rows="4"
            placeholder="Describe the main concern..."
          />

        </label>

        <label>
          Symptoms / Tags
        </label>

        <div className="chips">

          {symptoms.map((s) => (

            <button
              key={s}
              className={
                selected.includes(s)
                  ? "chip selected"
                  : "chip"
              }
              onClick={() => toggle(s)}
            >
              {selected.includes(s) ? "✓ " : ""}
              {s}
            </button>

          ))}

        </div>

        <div className="grid3">

          <Input label="Onset" />
          <Input label="Duration" />
          <Input label="Body Area" />

        </div>

        <label>
          Severity
          <input
            type="range"
            min="0"
            max="10"
          />
        </label>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 8
========================= */

function Page8({ next, back }) {

  return (
    <Page
      title="Relevant History"
      subtitle="Capture relevant medical and family history."
    >

      <TextCard title="Medical History" />
      <TextCard title="Surgical History" />
      <TextCard title="Current Medication" />
      <TextCard title="Allergies" />
      <TextCard title="Family History" />

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 9
========================= */

function Page9({ next, back }) {

  return (
    <Page
      title="Lifestyle & Daily Routine"
      subtitle="Understand the patient's routine and habits."
    >

      <div className="card">

        <Choice title="Diet"
          options={["Mixed", "Vegetarian", "Vegan", "Other"]}
        />

        <Choice title="Sleep"
          options={["Regular", "Irregular", "Insufficient"]}
        />

        <Choice title="Activity"
          options={["Low", "Moderate", "High"]}
        />

        <Choice title="Stress"
          options={["Low", "Moderate", "High"]}
        />

        <Input label="Occupation / Work Pattern" />

        <Input label="Typical Routine" />

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 10
========================= */

function Page10({ next, back }) {

  const [prakriti, setPrakriti] = useState("");

  return (
    <Page
      title="AYUSH Assessment"
      subtitle="Record practitioner observations and questionnaire responses."
    >

      <div className="infoBox">
        ✨ Practitioner support
        <small>
          This section is for observation and documentation.
        </small>
      </div>

      <div className="card">

        <h3>Prakriti Questionnaire</h3>

        <div className="prakriti">

          {["Vata", "Pitta", "Kapha"].map((x) => (

            <button
              className={
                prakriti === x
                  ? "prakritiCard selected"
                  : "prakritiCard"
              }
              onClick={() => setPrakriti(x)}
              key={x}
            >

              <strong>{x[0]}</strong>

              <b>{x}</b>

              <small>
                Observation support
              </small>

            </button>

          ))}

        </div>

        <label>
          Observation Notes

          <textarea
            rows="5"
            placeholder="Record observations..."
          />

        </label>

      </div>

      <Navigation back={back} next={next} />

    </Page>
  );
}


/* =========================
   PAGE 11
========================= */

function Page11({ back }) {

  return (
    <Page
      title="Vitals & Examination"
      subtitle="Complete the structured visit intake."
    >

      <div className="card">

        <div className="grid4">

          <Input label="Height" placeholder="cm" />
          <Input label="Weight" placeholder="kg" />
          <Input label="BMI" placeholder="kg/m²" />
          <Input label="Blood Pressure" placeholder="120/80" />
          <Input label="Pulse" placeholder="bpm" />
          <Input label="Temperature" placeholder="°C" />
          <Input label="SpO₂" placeholder="%" />

        </div>

        <label>
          Examination / Observation Notes

          <textarea
            rows="5"
            placeholder="Add objective findings..."
          />

        </label>

        <div className="complete">
          ✓
          <div>
            <b>Core intake complete</b>
            <small>
              You can review previous sections.
            </small>
          </div>
        </div>

      </div>

      <Navigation
        back={back}
        next={() => alert("Case completed!")}
        nextText="Finish Case"
      />

    </Page>
  );
}


/* =========================
   REUSABLE COMPONENTS
========================= */

function Page({ title, subtitle, children }) {

  return (
    <div>

      <div className="pageHeader">

        <div>

          <small>CASE INTAKE</small>

          <h1>{title}</h1>

          <p>{subtitle}</p>

        </div>

      </div>

      {children}

    </div>
  );
}


function Navigation({
  back,
  next,
  disabled = false,
  nextText = "Continue"
}) {

  return (
    <div className="navigation">

      <button
        className="secondary"
        onClick={back}
      >
        ← Back
      </button>

      <button
        className="primary"
        disabled={disabled}
        onClick={next}
      >
        {nextText} →
      </button>

    </div>
  );
}


function Input({
  label,
  placeholder = "",
  type = "text"
}) {

  return (
    <label>

      {label}

      <input
        type={type}
        placeholder={placeholder}
      />

    </label>
  );
}


function Select({ label, options }) {

  return (
    <label>

      {label}

      <select>

        <option>Select</option>

        {options.map(x => (
          <option key={x}>{x}</option>
        ))}

      </select>

    </label>
  );
}


function Feature({ icon, title, text }) {

  return (
    <div className="feature">

      <div className="featureIcon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


function CheckBox({
  checked,
  setChecked,
  title,
  text
}) {

  return (
    <label className="checkbox">

      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) =>
          setChecked?.(e.target.checked)
        }
      />

      <div>
        <b>{title}</b>
        <small>{text}</small>
      </div>

    </label>
  );
}


function Activity({ text }) {

  return (
    <div className="activity">
      <span>✓</span>
      <div>
        <b>{text}</b>
        <small>Just now</small>
      </div>
    </div>
  );
}


function TextCard({ title }) {

  return (
    <div className="card textCard">

      <h3>{title}</h3>

      <textarea
        rows="3"
        placeholder={`Enter ${title.toLowerCase()}...`}
      />

    </div>
  );
}


function Choice({ title, options }) {

  const [selected, setSelected] = useState("");

  return (
    <div className="choice">

      <div>
        <b>{title}</b>
        <small>Patient reported</small>
      </div>

      <div className="choiceButtons">

        {options.map(x => (

          <button
            key={x}
            className={
              selected === x
                ? "choiceButton selected"
                : "choiceButton"
            }
            onClick={() => setSelected(x)}
          >
            {selected === x ? "✓ " : ""}
            {x}
          </button>

        ))}

      </div>

    </div>
  );
}


createRoot(
  document.getElementById("root")
).render(<App />);
