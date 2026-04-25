# AttendX — Smart Attendance Tracker

> A geofencing-based digital attendance system for colleges, built as a Progressive Web App (PWA).

-----

## 📌 Project Overview

AttendX is a web-based attendance management system designed to replace manual paper-based attendance in college classrooms. Teachers can start a session from their location, and students can only mark attendance if they are physically present within the defined geofence radius. The system uses PIN-based verification, real-time database sync, and works on any device without installation.

This project was developed as a **Diploma Final Year Major Project** by a Computer Science & Technology (CST) student at **Mirik Government Polytechnic College**.

-----

## 🎯 Problem Statement

Traditional attendance systems in colleges are:

- Time-consuming and paper-based
- Prone to proxy attendance (friends marking for absent students)
- Hard to maintain and retrieve historical records
- Not accessible in real time for teachers or students

AttendX solves all of these problems with a digital, location-verified, real-time system.

-----

## ✨ Features

### 👨‍🏫 Teacher (Admin) Features

- Secure registration and login with role-based access
- Create and manage classes with unique enrollment codes
- Start attendance sessions with auto-generated 4-digit Check-In and Check-Out PINs
- Geofence-based session — students must be within a set radius (e.g. 100m) to mark attendance
- View real-time attendance as students check in
- End sessions and view past session records
- Export attendance reports as CSV or JSON
- Send announcements to specific classes
- Admin PIN gate — sensitive actions (start session, delete class, settings) are protected by a personal PIN
- Inactivity auto-logout for security
- Dark mode support

### 🎒 Student Features

- Register with Student ID and enroll in classes using a class code
- View enrolled classes and active sessions
- Mark Check-In and Check-Out using PIN + geolocation verification
- View personal attendance history and records
- Calendar view of attendance
- Receive announcements from teachers
- In-app notifications

### 📱 PWA Features

- Installable on Android and iOS (works like a native app)
- Offline-capable (cached assets load without internet)
- Works in any modern browser without app store download

-----

## 🛠️ Technologies Used

|Category          |Technology                                 |
|------------------|-------------------------------------------|
|Frontend          |HTML5, CSS3, Vanilla JavaScript            |
|Backend / Database|Firebase Firestore (NoSQL, real-time)      |
|Authentication    |Firebase Authentication                    |
|Hosting           |Firebase Hosting / any static host         |
|Geolocation       |Browser Geolocation API + Haversine Formula|
|QR Code           |QR generation & scanning libraries         |
|PWA               |Service Worker, Web App Manifest           |
|Architecture      |Single Page Application (SPA)              |

-----

## 🏗️ System Architecture

```
┌──────────────┐        ┌─────────────────────┐
│   Teacher    │        │   Firebase Auth      │
│  (Browser)   │◄──────►│   (Login / Register) │
└──────┬───────┘        └─────────────────────┘
       │
       ▼
┌──────────────┐        ┌─────────────────────┐
│   AttendX    │◄──────►│   Cloud Firestore    │
│   (PWA App)  │        │   (Real-time DB)     │
└──────┬───────┘        └─────────────────────┘
       │
       ▼
┌──────────────┐
│   Student    │
│  (Browser)   │
└──────────────┘
```

**Firestore Collections:**

- `users` — Teacher and student profiles, roles, Admin PIN
- `classes` — Class details, enrolled students, enrollment codes
- `sessions` — Active and past attendance sessions, PINs, location
- `attendance` — Individual check-in/check-out records with distance
- `notifications` — Announcements and alerts per user

-----

## 🔐 Security Features

- **Role-based access** — Teachers and students see completely different interfaces
- **Geofence verification** — Student’s GPS coordinates are checked against session location using the Haversine formula before allowing check-in
- **Admin PIN gate** — Start Session, Delete Class, and Settings are all protected by a secondary Admin PIN (separate from login password)
- **PIN reset via password** — Admin PIN can only be reset by re-authenticating with the Firebase login password
- **Inactivity timer** — App warns and logs out after a period of inactivity
- **Session persistence control** — “Remember me” option uses browser local vs session storage

-----

## 📐 Key Algorithm — Haversine Formula

To verify a student is physically present, the app calculates the real-world distance between the student’s GPS coordinates and the teacher’s session location using the **Haversine formula**:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
distance = 2R × atan2(√a, √(1−a))
```

Where R = 6,371,000 metres (Earth’s radius). If the calculated distance exceeds the teacher-set radius, check-in is rejected.

-----

## 🚀 How to Run

1. Download or clone the project
1. Open `index.html` in any modern browser (Chrome recommended)
1. Register as a Teacher to create an account
1. Create a class and share the enrollment code with students
1. Students register and join the class using the code
1. Teacher starts a session → students check in with the PIN while physically present

> **Note:** Geolocation requires HTTPS or localhost to work. For production use, host on Firebase Hosting or any HTTPS server.

-----

## 📸 Screenshots

|Teacher Dashboard                 |Start Session                            |Student Check-In                |
|----------------------------------|-----------------------------------------|--------------------------------|
|Manage classes, sessions, students|PIN-protected session start with geofence|PIN + location verified check-in|

-----

## 🔮 Future Scope

- Face recognition for attendance verification
- Biometric integration
- Admin dashboard with analytics and charts
- SMS/Email alerts for low attendance
- Offline-first full sync when reconnected
- Department-level admin hierarchy
- Mobile app (Android/iOS) using React Native

-----

## 👨‍💻 Developer

**Name:** [Your Name]  
**Roll No:** [Your Roll Number]  
**Department:** Computer Science & Technology (CST)  
**College:** Mirik Government Polytechnic College  
**Academic Year:** 2024–2025  
**Guide:** [Teacher/Guide Name]

-----

## 📄 License

This project was developed for educational purposes as part of the Diploma in Computer Science & Technology final year curriculum.
