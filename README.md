# Join - Task Management Application

Ein modernes Task-Management-System, entwickelt mit Angular und Firebase, das Teams dabei hilft, Projekte effizient zu organisieren und zu verwalten.

## Überblick

Join ist eine vollständige Kanban-Board-Anwendung, die es Benutzern ermöglicht:
-  Tasks zu erstellen, bearbeiten und verwalten
-  Kontakte zu verwalten und Tasks zuzuweisen
-  Projektfortschritt auf einem Kanban-Board zu verfolgen
-  Deadlines und Prioritäten zu setzen


##  Features

###  Authentifizierung
- **Benutzer-Registrierung** mit Email und Passwort
- **Secure Login** mit Firebase Authentication
- **Guest-Login** für Demo-Zwecke
- **Logout-Funktionalität** mit Success-Messages

###  Task-Management
- **Kanban-Board** mit Drag & Drop
- **Task-Status**: To Do, In Progress, Await Feedback, Done
- **Prioritäten**: Low, Medium, Urgent
- **Deadlines** mit Datum-Picker
- **Task-Kategorien** und -Beschreibungen

###  Kontakt-Management
- **Kontakte hinzufügen** und bearbeiten
- **Task-Zuweisung** an Kontakte
- **Kontakt-Profile** mit Namen und E-Mail

###  Benutzeroberfläche
- **Responsive Design** für alle Geräte
- **Dark Theme** mit professionellem Look
- **Animationen** und Success-Messages
- **Intuitive Navigation** zwischen Bereichen

##  Technologie-Stack

### Frontend
- **Angular 17** - Modern Web Framework
- **TypeScript** - Typsichere Programmierung
- **SCSS** - Advanced CSS mit Variablen und Mixins
- **Angular Material** - UI-Komponenten
- **RxJS** - Reactive Programming

### Backend & Database
- **Firebase Authentication** - Benutzer-Management
- **Cloud Firestore** - NoSQL-Datenbank
- **Firebase Hosting** - Deployment

### Development Tools
- **Angular CLI** - Entwicklungsumgebung
- **Git** - Versionskontrolle
- **VS Code** - IDE mit Extensions

##  Installation & Setup

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn
- Git

### 1. Repository klonen
```bash
git clone https://github.com/anne-dalchow/join.git
cd join
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Firebase konfigurieren
1. Erstellen Sie ein Firebase-Projekt auf [Firebase Console](https://console.firebase.google.com/)
2. Aktivieren Sie Authentication (Email/Password)
3. Erstellen Sie eine Firestore-Datenbank
4. Kopieren Sie die Firebase-Config in `src/app/app.config.ts`

### 4. Development Server starten
```bash
npm start
```
Die Anwendung ist unter `http://localhost:4200` verfügbar.

##  Projekt-Struktur

```
src/
├── app/
│   ├── login/                    # Login & Registrierung
│   ├── mainpage/                 # Hauptbereich
│   │   ├── board/                # Kanban-Board
│   │   ├── contacts/             # Kontakt-Management
│   │   ├── add-task/             # Task erstellen
│   │   └── mainpage.component.*  # Dashboard/Summary
│   ├── pages/                    # Statische Seiten
│   │   ├── help/
│   │   ├── legalnotice/
│   │   └── privacypolice/
│   ├── shared/                   # Geteilte Komponenten
│   │   ├── services/             # Angular Services
│   │   ├── header/               # Navigation
│   │   ├── nav/                  # Sidebar
│   │   └── addtask-modal/        # Task-Modal
│   └── interfaces/               # TypeScript Interfaces
├── assets/                       # Bilder, Fonts, Icons
└── styles.scss                   # Globale Styles
```

##  Development Commands

```bash
ng serve                          # Development server (http://localhost:4200)
ng build                          # Build für Production
ng test                           # Unit Tests via Karma
ng e2e                            # End-to-End Tests
ng generate component name        # Neue Komponente generieren
ng lint                           # Code Linting
```

##  Deployment

### Firebase Hosting
```bash
# Build für Production
ng build

# Firebase Tools installieren (falls nicht vorhanden)
npm install -g firebase-tools

# Firebase Login
firebase login

# Deployment
firebase deploy
```

##  Browser-Unterstützung

-  Chrome (empfohlen)
-  Firefox
- Safari
- Edge
-  Mobile Browser (iOS Safari, Chrome Mobile)

##  Angular CLI Informationen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

##  Contributing

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen


---

**Projekt Repository:** [GitHub](https://github.com/anne-dalchow/join)
