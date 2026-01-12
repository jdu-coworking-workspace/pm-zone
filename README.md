<div align="center">
  <h1><img src="https://project-management-gs.vercel.app/favicon.ico" width="20" height="20" alt="project-management Favicon">
   project-management</h1>
  <p>
    An open-source project management platform built with ReactJS and Tailwind CSS.
  </p>
  <p>
    <a href="https://github.com/GreatStackDev/project-management/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/GreatStackDev/project-management?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/GreatStackDev/project-management/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
    <a href="https://github.com/GreatStackDev/project-management/issues"><img src="https://img.shields.io/github/issues/GreatStackDev/project-management?style=for-the-badge" alt="GitHub issues"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📱 Progressive Web App](#-progressive-web-app)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 📝 Features <a name="-features"></a>

- **Progressive Web App (PWA):** Install on desktop and mobile devices for native app experience
- **Offline Support:** Works offline with cached data and automatic sync when back online
- **Multiple Workspaces:** Allow multiple workspaces to be created, each with its own set of projects, tasks, and members.
- **Project Management:** Manage projects, tasks, and team members.
- **Analytics:** View project analytics, including progress, completion rate, and team size.
- **Task Management:** Assign tasks to team members, set due dates, and track task status.
- **User Management:** Invite team members, manage user roles, and view user activity.

## 🛠️ Tech Stack <a name="-tech-stack"></a>

- **Frontend:** ReactJS with Redux Toolkit
- **Backend:** Express.js + Socket.IO for real-time updates
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React for icons
- **PWA:** Service Workers, Web App Manifest, offline-first architecture

## 📱 Progressive Web App <a name="-progressive-web-app"></a>

This application is a fully functional Progressive Web App (PWA) that can be installed on desktop and mobile devices!

### ✨ PWA Features

- **📲 Installable:** Add to home screen on mobile or install on desktop for native app experience
- **⚡ Offline Support:** Works without internet connection using cached data
- **🔄 Auto-Updates:** Automatically notifies users when new version is available
- **🎨 Themed:** Custom splash screen and theme colors matching app design
- **🚀 Fast Loading:** Cached assets load instantly

### 🧪 Testing PWA

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in Chrome/Edge
# Wait 30 seconds - install button appears in top-right
# Click "Install App" to install as PWA
```

### 📱 Installation

**Desktop (Chrome/Edge):**
1. Visit the app URL
2. Click the purple "Install App" button (top-right)
3. Or use browser menu > "Install PM Zone"

**Mobile (iOS Safari):**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"

**Mobile (Android Chrome):**
1. Open in Chrome
2. Tap install banner or menu > "Install app"

### 📚 Documentation

- **Complete Guide:** See `PWA_COMPLETE.md` for full implementation details
- **Testing Guide:** See `PWA_TESTING_GUIDE.md` for testing checklist
- **Icon Generation:** See `public/icons/README.md` for creating production icons

### 🎯 Production Deployment

1. Generate PNG icons: `./generate-icons.sh your-logo.png`
2. Deploy to HTTPS server (required for PWA)
3. Test installation on real devices
4. Run Lighthouse audit for PWA score

## 🚀 Getting Started <a name="-getting-started"></a>

First, install the dependencies. We recommend using `npm` for this project.

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

You can start editing the page by modifying `src/App.jsx`. The page auto-updates as you edit the file.

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.
