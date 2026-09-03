import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const SETTINGS_KEY = "ayush-settings";

const DEFAULT_WORKFLOW_SETTINGS = {
  theme: "light",
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
  language: "English",
};

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
  "NOVA Assessment",
  "Vitals & Examination",
  "Patient Timeline",
  "Patient Report",
  "Final Case Summary"
  const [page, setPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
];

function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_WORKFLOW_SETTINGS, ...JSON.parse(saved) } : DEFAULT_WORKFLOW_SETTINGS;
    } catch {
      return DEFAULT_WORKFLOW_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
    document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
    document.documentElement.dataset.fontSize = settings.fontSize;
  }, [settings]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== SETTINGS_KEY || !event.newValue) return;
      try {
        setSettings({ ...DEFAULT_WORKFLOW_SETTINGS, ...JSON.parse(event.newValue) });
      } catch {
        // Ignore malformed settings.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const resetWorkflowSettings = () => {
    setSettings(DEFAULT_WORKFLOW_SETTINGS);
  };

  const next = () => {
    setPage((current) => Math.min(current + 1, pages.length));
  };

  const back = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="logo">

          <div className="logoIcon">
            ❤
          </div>

          <div>
            <h2>Nova</h2>
            <small>Clinical Case Taking</small>
          </div>

        </div>

        <div className="user">

          <div className="avatar">
          NV
          </div>

          <span>
            Nova 
          </span>

          <button
            type="button"
            className="settingsButton"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            title="Settings"
          >
            ⚙
          </button>

        </div>

      </header>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <p className="sidebarTitle">
            CASE WORKFLOW
          </p>

          {pages.map((name, index) => (

            <button
              key={name}
              className={
                page === index + 1
                  ? "navItem active"
                  : "navItem"
              }
              onClick={() => setPage(index + 1)}
            >

              <span className="number">
                {index + 1}
              </span>

              {name}

            </button>

          ))}

        </aside>

        {/* MAIN */}
        <main className="content">

          {page === 1 && (
            <Page1 next={next} />
          )}

          {page === 2 && (
            <Page2
              next={next}
              back={back}
            />
          )}

          {page === 3 && (
            <Page3
              next={next}
              back={back}
            />
          )}

          {page === 4 && (
            <Page4
              next={next}
              back={back}
            />
          )}

          {page === 5 && (
            <Page5
              next={next}
              back={back}
            />
          )}

          {page === 6 && (
            <Page6
              next={next}
              back={back}
            />
          )}

          {page === 7 && (
            <Page7
              next={next}
              back={back}
            />
          )}

          {page === 8 && (
            <Page8
              next={next}
              back={back}
            />
          )}

          {page === 9 && (
            <Page9
              next={next}
              back={back}
            />
          )}

          {page === 10 && (
            <Page10
              next={next}
              back={back}
            />
          )}

          {page === 11 && (
            <Page11 next={next} back={back} />
          )}

          {page === 12 && (
            <IntegratedPage
              title="Patient Timeline"
              subtitle="Review the complete patient journey and clinical events."
              src="/pages/timeline.html"
              back={back}
              next={next}
              nextLabel="View Patient Report →"
            />
          )}

          {page === 13 && (
            <IntegratedPage
              title="Patient Report"
              subtitle="Review the patient summary and clinical report."
              src="/pages/report.html"
              back={back}
            />
          )}

        </main>

      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetWorkflowSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>
  );
}



function SettingsPanel({ settings, updateSetting, resetSettings, onClose }) {
  return (
    <div className="settingsOverlay" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settingsPanel">
        <div className="settingsPanelHeader">
          <div>
            <span className="badge">NOVA · Preferences</span>
            <h2>Settings & Accessibility</h2>
            <p>Customize the case-taking workspace to your preference.</p>
          </div>
          <button className="iconButton" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settingsSection">
          <h3>Appearance</h3>
          <div className="settingsOption">
            <div><b>Theme</b><small>Switch between light and dark mode</small></div>
            <div className="segmented">
              <button className={settings.theme === "light" ? "selected" : ""} onClick={() => updateSetting("theme", "light")}>☀ Light</button>
              <button className={settings.theme === "dark" ? "selected" : ""} onClick={() => updateSetting("theme", "dark")}>☾ Dark</button>
            </div>
          </div>

          <div className="settingsOption">
            <div><b>Font Size</b><small>Adjust text size for readability</small></div>
            <div className="segmented">
              {[["small", "A"], ["medium", "A"], ["large", "A"]].map(([value, label]) => (
                <button key={value} className={settings.fontSize === value ? "selected" : ""} onClick={() => updateSetting("fontSize", value)}>{label} {value}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="settingsSection">
          <h3>Accessibility</h3>
          <SettingToggle label="High Contrast" description="Increase visual contrast for better readability" checked={settings.highContrast} onChange={(value) => updateSetting("highContrast", value)} />
          <SettingToggle label="Reduced Motion" description="Disable decorative animations and transitions" checked={settings.reducedMotion} onChange={(value) => updateSetting("reducedMotion", value)} />
        </div>

        <div className="settingsSection">
          <h3>Language</h3>
          <div className="settingsOption">
            <div><b>Interface Language</b><small>Choose your preferred language</small></div>
            <select value={settings.language} onChange={(event) => updateSetting("language", event.target.value)}>
              {['English','Hindi','Kannada','Tamil','Telugu','Bengali','Marathi','Gujarati'].map((language) => <option key={language}>{language}</option>)}
            </select>
          </div>
        </div>

        <div className="settingsFooter">
          <button className="secondary" onClick={resetSettings}>↺ Reset to defaults</button>
          <button className="primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="settingsOption">
      <div><b>{label}</b><small>{description}</small></div>
      <button type="button" className={`toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
        <span />
      </button>
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
            A calm, structured workspace for
            capturing patient identity, consent,
            symptoms, history, lifestyle and
            examination data.
          </p>

          <button
            className="primary"
            onClick={next}
          >
            Start a Case →
          </button>

          <p className="privacy">
            🔒 Privacy-first by design ·
            Autosaves locally
          </p>

        </div>

        <div className="heroVisual">

          <div className="floatingCard">

            <b>
              ✓ Consent captured
            </b>

            <small>
              All required fields
            </small>

          </div>

          <div className="floatingCard second">

            <b>
              Case progress
            </b>

            <small>
              Vitals ready · 80%
            </small>

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
          icon="🛡️"
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

  const [role, setRole] = useState(
    "Practitioner"
  );

  return (
    <Page
      title="Welcome back"
      subtitle="Choose your role to enter the clinical workspace."
    >

      <div className="roleGrid">

        {[
          "Practitioner",
          "Patient"
        ].map((item) => (

          <button
            key={item}
            className={
              role === item
                ? "roleCard selected"
                : "roleCard"
            }
            onClick={() => setRole(item)}
          >

            <div className="roleIcon">
              {item === "Practitioner"
                ? "🩺"
                : "👤"}
            </div>

            <div>

              <b>
                {item}
              </b>

              <small>
                {item === "Practitioner"
                  ? "Capture and review clinical cases"
                  : "View your patient journey"}
              </small>

            </div>

          </button>

        ))}

      </div>

      <div className="card">

        <h3>
          Demo Sign In
        </h3>

        <Input
          label="Email or phone"
          placeholder="name@example.com"
        />

        <Input
          label="Access code"
          type="password"
          placeholder="••••••••"
        />

        <button
          className="primary full"
          onClick={next}
        >
          Continue as {role}
        </button>

      </div>

      <Navigation
        back={back}
        next={next}
      />

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

        <h3>
          Patient Identity
        </h3>

        <div className="grid2">

          <Input label="Full name" />

          <Input
            label="Date of birth"
            type="date"
          />

          <Input
            label="Age"
            placeholder="e.g. 28"
          />

          <Select
            label="Sex"
            options={[
              "Female",
              "Male",
              "Prefer not to say"
            ]}
          />

          <Input
            label="Contact number"
          />

          <Input
            label="Preferred language"
          />

          <Input
            label="Address"
          />

          <Input
            label="Emergency contact"
          />

          <Input
            label="Occupation"
          />

        </div>

      </div>

      <Navigation
        back={back}
        next={next}
      />

    </Page>
  );
}


/* =========================
   PAGE 4
========================= */

function Page4({ next, back }) {

  const [clinical, setClinical] =
    useState(false);

  const [privacy, setPrivacy] =
    useState(false);

  return (
    <Page
      title="Consent & Privacy"
      subtitle="Keep the patient informed with plain-language choices."
    >

      <div className="card">

        <div className="privacyBox">

          <span>🛡️</span>

          <div>

            <b>
              Your information stays in context.
            </b>

            <small>
              This prototype stores information
              locally in the browser.
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
        disabled={
          !(clinical && privacy)
        }
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

              <h2>
                Demo Patient
              </h2>

              <p>
                28 years · Female
              </p>

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

          <h3>
            Recent Activity
          </h3>

          <Activity
            text="Patient registered"
          />

          <Activity
            text="Consent recorded"
          />

          <Activity
            text="Case intake started"
          />

        </div>

      </div>

      <Navigation
        back={back}
        next={next}
      />

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

          <h3>
            New Case
          </h3>

          {[
            "Chief Complaint",
            "History",
            "Lifestyle",
            "NOVA Assessment",
            "Vitals / Examination"
          ].map((item, index) => (

            <div
              className="wizardItem"
              key={item}
            >

              <span>
                {index + 1}
              </span>

              {item}

            </div>

          ))}

        </div>

        <div className="card wizardIntro">

          <div className="bigIcon">
            🩺
          </div>

          <h2>
            Let's capture the patient's story.
          </h2>

          <p>
            Start with what brought the patient
            in today, then add relevant history,
            lifestyle, NOVA observations and
            examination findings.
          </p>

          <button
            className="primary"
            onClick={next}
          >
            Begin Case →
          </button>

        </div>

      </div>

      <Navigation
        back={back}
        next={next}
      />

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

  const [selected, setSelected] =
    useState([]);

  const toggle = (symptom) => {

    if (selected.includes(symptom)) {

      setSelected(
        selected.filter(
          (item) => item !== symptom
        )
      );

    } else {

      setSelected([
        ...selected,
        symptom
      ]);

    }
  };

  return (
    <Page
      title="Chief Complaint & Symptoms"
      subtitle="Turn free-form complaints into structured data."
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

          {symptoms.map((symptom) => (

            <button
              key={symptom}
              className={
                selected.includes(symptom)
                  ? "chip selected"
                  : "chip"
              }
              onClick={() =>
                toggle(symptom)
              }
            >

              {selected.includes(symptom)
                ? "✓ "
                : ""}

              {symptom}

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

      <Navigation
        back={back}
        next={next}
      />

    </Page>
  );
}


/* =========================
   PAGE 8
========================= */

function Page8({ next, back }) {

  return (
    <Page
      title="History"
      subtitle="Capture relevant medical and family history."
    >

      <TextCard title="Medical History" />

      <TextCard title="Surgical History" />

      <TextCard title="Current Medication" />

      <TextCard title="Allergies" />

      <TextCard title="Family History" />

      <Navigation
        back={back}
        next={next}
      />

    </Page>
  );
}


/* =========================
   PAGE 9
========================= */

function Page9({ next, back }) {

  return (
    <Page
      title="Lifestyle"
      subtitle="Understand the patient's routine and daily habits."
    >

      <div className="card">

        <Choice
          title="Diet"
          options={[
            "Mixed",
            "Vegetarian",
            "Vegan",
            "Other"
          ]}
        />

        <Choice
          title="Sleep"
          options={[
            "Regular",
            "Irregular",
            "Insufficient"
          ]}
        />

        <Choice
          title="Activity"
          options={[
            "Low",
            "Moderate",
            "High"
          ]}
        />

        <Choice
          title="Stress"
          options={[
            "Low",
            "Moderate",
            "High"
          ]}
        />

        <Input
          label="Occupation / Work Pattern"
        />

        <Input
          label="Typical Routine"
        />

      </div>

      <Navigation
        back={back}
        next={next}
      />

    </Page>
  );
}


/* =========================
   PAGE 10
========================= */

function Page10({ next, back }) {

  const [prakriti, setPrakriti] =
    useState("");

  return (
    <Page
      title="NOVA Assessment"
      subtitle="Record practitioner observations and questionnaire responses."
    >

      <div className="infoBox">

        <span>✨</span>

        <div>

          <b>
            Practitioner support
          </b>

          <small>
            This section is for observation
            and documentation.
          </small>

        </div>

      </div>

      <div className="card">

        <h3>
          Prakriti Questionnaire
        </h3>

        <div className="prakriti">

          {[
            "Vata",
            "Pitta",
            "Kapha"
          ].map((item) => (

            <button
              key={item}
              className={
                prakriti === item
                  ? "prakritiCard selected"
                  : "prakritiCard"
              }
              onClick={() =>
                setPrakriti(item)
              }
            >

              <strong>
                {item[0]}
              </strong>

              <b>
                {item}
              </b>

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

      <Navigation
        back={back}
        next={next}
      />

    </Page>
  );
}


/* =========================
   PAGE 11
========================= */

function Page11({ next, back }) {

  return (
    <Page
      title="Vitals & Examination"
      subtitle="Complete the structured visit intake."
    >

      <div className="card">

        <div className="grid4">

          <Input
            label="Height"
            placeholder="cm"
          />

          <Input
            label="Weight"
            placeholder="kg"
          />

          <Input
            label="BMI"
            placeholder="kg/m²"
          />

          <Input
            label="Blood Pressure"
            placeholder="120/80"
          />

          <Input
            label="Pulse"
            placeholder="bpm"
          />

          <Input
            label="Temperature"
            placeholder="°C"
          />

          <Input
            label="SpO₂"
            placeholder="%"
          />

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

            <b>
              Core intake complete
            </b>

            <small>
              You can review previous sections.
            </small>

          </div>

        </div>

      </div>

      <Navigation
        back={back}
        next={next}
        nextText="View Patient Timeline →"
      />

    </Page>
  );
}


/* =========================
   REUSABLE COMPONENTS
========================= */

function Page({
  title,
  subtitle,
  children
}) {

  return (
    <div>

      <div className="pageHeader">

        <small>
          CASE INTAKE
        </small>

        <h1>
          {title}
        </h1>

        <p>
          {subtitle}
        </p>

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


function Select({
  label,
  options
}) {

  return (
    <label>

      {label}

      <select>

        <option>
          Select
        </option>

        {options.map((item) => (

          <option key={item}>
            {item}
          </option>

        ))}

      </select>

    </label>
  );
}


function Feature({
  icon,
  title,
  text
}) {

  return (
    <div className="feature">

      <div className="featureIcon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


function CheckBox({
  checked = false,
  setChecked,
  title,
  text
}) {

  return (
    <label className="checkbox">

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          setChecked?.(
            event.target.checked
          )
        }
      />

      <div>

        <b>
          {title}
        </b>

        <small>
          {text}
        </small>

      </div>

    </label>
  );
}


function Activity({ text }) {

  return (
    <div className="activity">

      <span>
        ✓
      </span>

      <div>

        <b>
          {text}
        </b>

        <small>
          Just now
        </small>

      </div>

    </div>
  );
}


function TextCard({ title }) {

  return (
    <div className="card textCard">

      <h3>
        {title}
      </h3>

      <textarea
        rows="3"
        placeholder={
          `Enter ${title.toLowerCase()}...`
        }
      />

    </div>
  );
}


function Choice({
  title,
  options
}) {

  const [selected, setSelected] =
    useState("");

  return (
    <div className="choice">

      <div>

        <b>
          {title}
        </b>

        <small>
          Patient reported
        </small>

      </div>

      <div className="choiceButtons">

        {options.map((item) => (

          <button
            key={item}
            className={
              selected === item
                ? "choiceButton selected"
                : "choiceButton"
            }
            onClick={() =>
              setSelected(item)
            }
          >

            {selected === item
              ? "✓ "
              : ""}

            {item}

          </button>

        ))}

      </div>

    </div>
  );
}


function IntegratedPage({ title, subtitle, src, back, next, nextLabel }) {
  return (
    <div className="integratedPage">
      <div className="integratedPageHeader">
        <div>
          <span className="badge">AYUSH Care · Case Workflow</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="integratedActions">
          <button className="secondary" onClick={back}>← Back</button>
          {next && <button className="primary" onClick={next}>{nextLabel || "Continue →"}</button>}
        </div>
      </div>
      <div className="integratedFrameCard">
        <iframe title={title} src={src} className="integratedFrame" />
      </div>
    </div>
  )
}

/* =========================
   PAGE 14 - FINAL CASE SUMMARY
========================= */

function FinalCaseSummary({ back }) {

  const missingFields = [
    {
      id: "emergency-contact",
      label: "Emergency contact",
      section: "Patient Information"
    },
    {
      id: "family-history",
      label: "Family history",
      section: "History"
    },
    {
      id: "attachments",
      label: "Clinical attachment",
      section: "Attachments"
    }
  ];

  const handleMissingField = (field) => {
    const element = document.getElementById(field.id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      element.focus?.();
    }
  };

  return (
    <div className="finalSummary">

      {/* HEADER */}
      <div className="pageHeader">

        <small>
          CASE REVIEW
        </small>

        <h1>
          Final Case Summary
        </h1>

        <p>
          Review all patient information before completing the case.
        </p>

      </div>


      {/* COMPLETENESS */}
      <div className="card completenessCard">

        <div className="completenessHeader">

          <div>

            <span className="badge">
              Case Review
            </span>

            <h2>
              Case Completeness
            </h2>

            <p>
              Most required information has been captured.
            </p>

          </div>

          <div className="completenessScore">
            87%
          </div>

        </div>


        <div className="progressTrack">

          <div
            className="progressFill"
            style={{ width: "87%" }}
          />

        </div>


        <div className="missingSummary">

          <b>
            ⚠ 3 fields need attention
          </b>

          <span>
            Click a missing field below to review it.
          </span>

        </div>


        <div className="missingFields">

          {missingFields.map((field) => (

            <button
              key={field.id}
              className="missingField"
              onClick={() =>
                handleMissingField(field)
              }
            >

              <span>
                ⚠
              </span>

              <div>

                <b>
                  {field.label}
                </b>

                <small>
                  {field.section}
                </small>

              </div>

              <span>
                →
              </span>

            </button>

          ))}

        </div>

      </div>


      {/* PATIENT INFORMATION */}
      <SummarySection
        title="Patient Information"
        icon="👤"
      >

        <div className="summaryGrid">

          <SummaryItem
            label="Patient Name"
            value="Demo Patient"
          />

          <SummaryItem
            label="Age"
            value="28 years"
          />

          <SummaryItem
            label="Sex"
            value="Female"
          />

          <SummaryItem
            label="Language"
            value="English"
          />

          <SummaryItem
            label="Contact Number"
            value="Not provided"
          />

          <div id="emergency-contact">
            <SummaryItem
              label="Emergency Contact"
              value="Missing"
              warning
            />
          </div>

        </div>

      </SummarySection>


      {/* SYMPTOMS */}
      <SummarySection
        title="Symptoms & Chief Complaint"
        icon="🩺"
      >

        <div className="summaryBlock">

          <b>
            Primary Complaint
          </b>

          <p>
            Patient reports general discomfort and fatigue.
          </p>

        </div>

        <div className="summaryTags">

          {[
            "Fatigue",
            "Headache",
            "Sleep Issue"
          ].map((item) => (

            <span
              className="summaryTag"
              key={item}
            >
              ✓ {item}
            </span>

          ))}

        </div>

      </SummarySection>


      {/* HISTORY */}
      <SummarySection
        title="History"
        icon="📋"
      >

        <div className="summaryGrid">

          <SummaryItem
            label="Medical History"
            value="Recorded"
          />

          <SummaryItem
            label="Surgical History"
            value="Recorded"
          />

          <SummaryItem
            label="Current Medication"
            value="Recorded"
          />

          <SummaryItem
            label="Allergies"
            value="Recorded"
          />

          <div id="family-history">
            <SummaryItem
              label="Family History"
              value="Missing"
              warning
            />
          </div>

        </div>

      </SummarySection>


      {/* LIFESTYLE */}
      <SummarySection
        title="Lifestyle"
        icon="🌿"
      >

        <div className="summaryGrid">

          <SummaryItem
            label="Diet"
            value="Mixed"
          />

          <SummaryItem
            label="Sleep"
            value="Regular"
          />

          <SummaryItem
            label="Activity"
            value="Moderate"
          />

          <SummaryItem
            label="Stress"
            value="Moderate"
          />

          <SummaryItem
            label="Occupation"
            value="Not specified"
          />

          <SummaryItem
            label="Routine"
            value="Recorded"
          />

        </div>

      </SummarySection>


      {/* AYUSH ASSESSMENT */}
      <SummarySection
        title="AYUSH / NOVA Assessment"
        icon="✨"
      >

        <div className="assessmentCard">

          <div>

            <small>
              Prakriti
            </small>

            <strong>
              Vata
            </strong>

          </div>

          <div>

            <small>
              Observation
            </small>

            <strong>
              Practitioner assessment recorded
            </strong>

          </div>

        </div>

      </SummarySection>


      {/* VITALS */}
      <SummarySection
        title="Vitals & Examination"
        icon="❤️"
      >

        <div className="vitalsGrid">

          <Vital
            label="Height"
            value="165 cm"
          />

          <Vital
            label="Weight"
            value="60 kg"
          />

          <Vital
            label="BMI"
            value="22.0"
          />

          <Vital
            label="Blood Pressure"
            value="120/80"
          />

          <Vital
            label="Pulse"
            value="72 bpm"
          />

          <Vital
            label="Temperature"
            value="36.8 °C"
          />

          <Vital
            label="SpO₂"
            value="98%"
          />

        </div>

      </SummarySection>


      {/* ATTACHMENTS */}
      <SummarySection
        title="Attachments"
        icon="📎"
      >

        <div
          id="attachments"
          className="attachmentBox"
          tabIndex="-1"
        >

          <div className="attachmentIcon">
            📎
          </div>

          <div>

            <b>
              No clinical attachment added
            </b>

            <small>
              Optional reports, documents or images can be attached.
            </small>

          </div>

          <span className="warningBadge">
            Missing
          </span>

        </div>

      </SummarySection>


      {/* FINAL WARNING */}
      <div className="card finalWarning">

        <div className="warningIcon">
          ⚠
        </div>

        <div>

          <h3>
            Review before completing
          </h3>

          <p>
            Please review the highlighted missing fields.
            You can still go back and update the case.
          </p>

        </div>

      </div>


      {/* NAVIGATION */}
      <div className="navigation">

        <button
          className="secondary"
          onClick={back}
        >
          ← Back
        </button>

        <button
          className="primary"
          onClick={() =>
            alert("Case review completed successfully.")
          }
        >
          Complete Case ✓
        </button>

      </div>

    </div>
  );
}


/* =========================
   SUMMARY COMPONENTS
========================= */

function SummarySection({
  title,
  icon,
  children
}) {

  return (
    <section className="card summarySection">

      <div className="summarySectionHeader">

        <span className="summaryIcon">
          {icon}
        </span>

        <h2>
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}


function SummaryItem({
  label,
  value,
  warning = false
}) {

  return (
    <div
      className={
        warning
          ? "summaryItem warning"
          : "summaryItem"
      }
    >

      <small>
        {label}
      </small>

      <b>
        {warning ? "⚠ " : ""}
        {value}
      </b>

    </div>
  );
}


function Vital({
  label,
  value
}) {

  return (
    <div className="vitalCard">

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>
  );
}
createRoot(
  document.getElementById("root")
).render(
  <App />
);
