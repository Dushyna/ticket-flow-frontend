# 🎬 TicketFlow — SaaS-Plattform für Kinoverwaltung & Ticketverkauf

![React](https://shields.io)
![TypeScript](https://shields.io)
![TailwindCSS](https://shields.io)
![Redux Toolkit](https://shields.io)
![Vite](https://shields.io)
![i18next](https://shields.io)

**TicketFlow** ist eine moderne, mandantenfähige (Multi-Tenant) SaaS-Plattform für Kinoketten, unabhängige Kinos und
Kinobesucher. Entwickelt mit einer modernen **Dark-Glassmorphism**-Benutzeroberfläche, bietet die Anwendung ein
vollständiges Ökosystem für interaktives Saal-Design, dynamische Spielplanverwaltung, Online-Ticketkauf über Stripe, ein
Kassensystem (POS) sowie eine QR-Code-Einlasskontrolle.

🔗 **Backend-Repository:** [Dushyna/ticket-flow-backend](https://github.com)

---

## ✨ Hauptfunktionen

### 🍿 Für Kinobesucher (`ROLE_USER`)

* **Interaktive Sitzplatzauswahl:** Echtzeit-Sitzplan mit Anzeige der Preiskategorien (*Parkett, Amphitheater, Balkon,
  VIP-Loge*) und aktueller Verfügbarkeit.
* **Nahtloser Online-Checkout:** Sicherer Ticketkauf über **Stripe Checkout** mit automatischer Sitzplatzreservierung
  zur Vermeidung von Doppelbuchungen.
* **Sofortige E-Tickets (PDF & QR):** Download druckbarer PDF-Tickets mit individuellen QR-/UUID-Codes direkt nach der
  Zahlung.
* **Self-Service-Kontoverwaltung:** Registrierung mit E-Mail-Bestätigungscode, Passwort-Wiederherstellung und
  persönliche Buchungshistorie.
* **Mehrsprachigkeit (i18n):** Vollständige Lokalisierung der Benutzeroberfläche und Datumsformate auf **Deutsch (DE)**,
  **Englisch (EN)** und **Ukrainisch (UK)** inklusive automatischer Spracherkennung.

### 🏗️ Für Kinobetreiber (`ROLE_TENANT_ADMIN`)

* **Multi-Kino-Dashboard:** Zentrale Verwaltung mehrerer Kinostandorte, Saalpläne und aktueller Spielpläne.
* **Visueller Saal-Designer:** Interaktiver Matrix-Editor mit anpassbarer Reihen- und Spaltenanzahl, Zonen-Pinseln,
  Rückgängig-Funktion (Undo-Historie), Kapazitätsberechnung und **PNG-Export**.
* **Dynamische Spielplan- & Filmkatalogverwaltung:** Filme anlegen, Vorstellungen mit automatischer
  Überschneidungsprüfung planen und Basispreise festlegen.
* **Flexible Preisgestaltung & Ticketkategorien:** Konfiguration individueller Tickettypen (z. B. *Erwachsene,
  Student/Schüler, Kind*) mit prozentualen Rabatten oder Aufschlägen.
* **Personal- & Rollenverwaltung:** Zuweisung und Verwaltung von Berechtigungen für Kassierer, Einlasskontrolleure und
  Administratoren.

### 🎟️ Für Kinopersonal (`ROLE_CASHIER` & `ROLE_CONTROLLER`)

* **Kassenarbeitsplatz (POS):** Spezielles Kassenterminal für schnellen Vor-Ort-Verkauf, sofortige Ticketausgabe,
  Verkaufshistorie und erneuten Ticketdruck.
* **Einlasskontrolle (QR-Scanner):** Schnelle Ticketvalidierung am Eingang per QR-Code-Scan oder manueller Eingabe der
  Ticket-UUID.

---

## 🛠 Technologie-Stack

* **Core:** React 19, TypeScript 5.9, Vite 8
* **State Management & API:** Redux Toolkit & RTK Query (inklusive automatischem `401`-Token-Refresh-Interceptor)
* **Styling & Icons:** Tailwind CSS v4 (Custom Dark Glassmorphism Theme), Lucide React, React Icons, React World Flags
* **Formulare & Validierung:** Formik + Yup
* **Routing:** React Router v7 (Rollenbasierte geschützte Routen / RBAC)
* **Internationalisierung:** `i18next`, `react-i18next`, `i18next-browser-languagedetector` (`DE`, `EN`, `UK`)
* **Sicherheit:** HttpOnly-Cookie-basierte JWT-Authentifizierung + automatische `X-XSRF-TOKEN` CSRF-Header-Integration,
  Google OAuth2

---

## 🚀 Installation & Start

### Voraussetzungen

* **Node.js** (Version 20+ empfohlen)
* Laufende Instanz des [TicketFlow Backends](https://github.com) unter `http://localhost:8080`

### Schritte zur Ausführung

1. **Repository klonen:**
   ```bash
   git clone https://github.com
   cd ticket-flow-frontend
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```
   Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar und verbindet sich automatisch mit
   `http://localhost:8080/api/v1`.

### Verfügbare Skripte

* `npm run dev` — Startet den lokalen Vite-Entwicklungsserver
* `npm run build` — Führt die TypeScript-Typprüfung durch und erstellt den Production-Build
* `npm run lint` — Überprüft den Code mit ESLint
* `npm run preview` — Startet eine lokale Vorschau des Production-Builds

---

## 📸 Anwendungsmodule im Überblick

| Modul                        | Beschreibung                                                                                        |
|:-----------------------------|:----------------------------------------------------------------------------------------------------|
| **Dashboard**                | Übersicht der eigenen Kinos, anstehenden Vorstellungen und Schnellzugriff auf Verwaltungsfunktionen |
| **Saal-Designer**            | Visueller Sitzplatz-Editor mit Preiszonen, Undo-Historie und PNG-Export                             |
| **Film- & Spielplan-Editor** | Globaler Filmkatalog und konfliktfreie Vorstellungsplanung                                          |
| **Ticketkategorien**         | Individuelle Rabatt- und Aufschlagsregeln für verschiedene Besuchergruppen                          |
| **Kassenarbeitsplatz**       | Vor-Ort-Ticketverkauf (POS), Verkaufshistorie und Nachdruck von Tickets                             |
| **Einlasskontrolle**         | Echtzeit-QR-/UUID-Scanner zur Ticketprüfung am Einlass                                              |
| **Personalverwaltung**       | Rollenbasierte Zugriffskontrolle (`SUPER_ADMIN`, `TENANT_ADMIN`, `CASHIER`, `CONTROLLER`, `USER`)   |
