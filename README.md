# NOVA – Patient Case Workflow

A modern healthcare frontend designed for managing patient cases through a structured digital workflow. The application provides a step-by-step process for patient registration, consent, profile creation, clinical history, lifestyle information, NOVA assessment, vitals, patient timeline, and patient reports.

## Project Overview

NOVA is a frontend application designed to simplify and digitize the patient case-management process.

The application follows a guided workflow that helps healthcare professionals collect and organize patient information in a structured manner.

### Main Workflow

1. Welcome
2. Sign In
3. Patient Registration
4. Consent & Privacy
5. Patient Profile
6. Case Wizard
7. Chief Complaint
8. Patient History
9. Lifestyle Information
10. NOVA Assessment
11. Vitals & Examination
12. Patient Timeline
13. Patient Report

---

## Features

* Digital Patient Case Workflow
* Patient Registration & Profile Management
* Consent & Privacy Section
* Chief Complaint and Medical History
* Lifestyle Information
* NOVA Assessment
* Vitals & Physical Examination
* Patient Timeline
* Patient Report
* Global Settings
* Light & Dark Theme
* Adjustable Font Size
* High Contrast Mode
* Accessibility Support
* Reduced Motion Option
* Multiple Language Options
* Settings Persistence using Local Storage

---

## Technologies Used

* React.js – Frontend UI development
* Vite – Development server and build tool
* TypeScript / TSX – React components
* JavaScript / JSX – Application logic
* CSS – Styling and responsive UI
* LocalStorage – Saving user interface preferences
* HTML – Integrated timeline and report pages

---

## Project Structure

```text
NOVA/
│
├── index.html
├── package.json
├── vite.config.ts
│
├── public/
│   └── pages/
│       ├── Dashboard.html
│       ├── timeline.html
│       ├── report.html
│       └── legacy-styles.css
│
└── src/
    ├── main.jsx
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── index.css
    │
    ├── components/
    │   ├── Dashboard.tsx
    │   ├── AppointmentMock.tsx
    │   └── SettingsAccessibility.tsx
    │
    └── context/
        └── SettingsContext.tsx
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ayushvats07/SIH-2026.git
```

### 2. Navigate into the project

```bash
cd SIH-2026
```

If the React project is inside another folder, navigate into the folder containing `package.json`.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The terminal will provide a local URL, usually similar to:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## Development

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Global Settings

The project includes a global settings panel accessible through the settings icon.

Users can customize:

### Theme

* Light Mode
* Dark Mode

### Font Size

* Small
* Medium
* Large

### Accessibility

* High Contrast
* Reduced Motion

### Language

The interface provides options for:

* English
* Hindi
* Kannada
* Tamil
* Telugu
* Bengali
* Marathi
* Gujarati

Settings are stored using browser localStorage, allowing preferences to remain available across the application.

---

## Patient Case Workflow

The application guides the user through a structured patient case.

### Patient Registration

Collects basic patient information and starts a new case.

### Consent & Privacy

Provides a dedicated section for patient consent and privacy-related information.

### Patient Profile

Stores important patient details required for the case.

### Case Wizard

Guides the healthcare professional through the clinical information collection process.

### Clinical Information

The workflow includes:

* Chief Complaint
* Patient History
* Lifestyle Information
* NOVA Assessment
* Vitals
* Physical Examination

### Patient Timeline

Displays the patient's case progression and relevant events over time.

### Patient Report

Provides a structured report view containing information collected during the case workflow.

---

## Project Goal

The primary goal of NOVA is to provide a simple, accessible, and structured digital interface for managing patient cases.

The system aims to:

* Reduce manual paperwork
* Organize patient information
* Improve clinical workflow
* Make patient information easier to review
* Provide accessibility-friendly controls
* Create a consistent digital patient journey

---

## Future Improvements

Possible future improvements include:

* Backend integration
* Secure user authentication
* Database integration
* Real patient data management
* PDF report generation
* Appointment management
* Doctor and patient dashboards
* Advanced patient search
* Analytics and clinical insights
* Role-based access control
* Multilingual content translation
* Cloud deployment

---

## Team

NOVA

Hackathon: Smart India Hackathon (SIH) 2026

---

## License

This project is developed for educational and hackathon purposes.

---

## Acknowledgement

This project was developed as part of Smart India Hackathon 2026, with the goal of creating a digital solution for improving healthcare workflows.
