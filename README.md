# Coaching 101: Digital Coaching Workbook

![Core Values Recovery](https://img.shields.io/badge/Core_Values-Recovery-1D4486?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0-D4AA4C?style=for-the-badge)

## Overview

**Coaching 101: Core Values Foundations for Recovery Coaches** is a comprehensive, digital-first interactive workbook for the 21-hour, three-day peer recovery coach training program. This web-based application transforms the traditional participant manual into an engaging, modern learning experience.

### Key Features

- **🔐 Secure Accounts** - Email / password authentication backed by HTTP-only cookies
- **☁️ Cloud Auto-Sync** - Autosave writes progress to a SQLite database for cross-device access
- **📊 Real-Time Progress** - Visual completion tracking + admin reporting endpoints
- **🎯 Interactive Forms** - All exercises, reflections, and worksheets remain fully digital
- **🪞 Digital Values Cards** - Tap-to-select values deck with engagement logging
- **📱 Mobile Responsive** - Optimized layouts for phones, tablets, and desktops
- **🖨️ Print & Export** - JSON export and print-friendly output for offline archives
- **🎨 Core Values Branding** - Navy (#1D4486) and Gold (#D4AA4C) color system
- **📈 Engagement Signals** - Server records navigation and key actions for facilitators
- **📋 Admin Dashboard** - Browser-based progress reporting for admins with module filters
- **🟢 Live Presence** - Real-time view of who is online, what module they're in, and their current section

## Quick Start

### Prerequisites

- Node.js 18+ (or newer)  
- npm 9+  
- macOS/Windows/Linux (tested on Apple Silicon macOS)

### Run Locally

1. Install dependencies  
   ```bash
   npm install
   ```
2. Start the coaching backend + static server  
   ```bash
   npm start
   ```
3. Visit `http://localhost:3000` and create an account.  
   - The very first account automatically gains the `admin` role.  
   - Subsequent users are registered as `participant`.
4. Launch any module (`/`, `/families`, `/intervention`) and your progress will auto-sync.

### Production Deployment

- Host the Express server (e.g., Fly.io, Render, Railway, VPS).  
- Set `JWT_SECRET` to a strong random string in the environment.  
- Use reverse proxy/HTTPS (nginx, Caddy, etc.).  
- Persist the `data/` directory so `coaching101.db` survives restarts.  
- Optional: set `FRONTEND_ORIGIN` with a comma-separated list of allowed origins for CORS.

### Environment Variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `JWT_SECRET` | Signing key for auth cookies (required in production) | `JWT_SECRET="super-long-random-string"` |
| `FRONTEND_ORIGIN` | Comma-separated allowlist of origins for CORS | `FRONTEND_ORIGIN="https://training.corevaluesrecovery.org"` |
| `ADMIN_EMAILS` | Comma-separated list of emails that should have the `admin` role | `ADMIN_EMAILS="you@example.com, partner@example.org"` |

`ADMIN_EMAILS` overrides the default “first account is admin” rule. Whenever a listed user logs in (or hits `/api/auth/me`), their role is upgraded automatically. Remove an email from the list to demote on next login or session check.

## File Structure

```
coaching101/
├── apiClient.js              # Browser client for authenticated API calls
├── app.js                    # Front-end logic shared by all modules
├── content.js                # Structured content reference
├── data/
│   └── coaching101.db        # SQLite database (auto-created)
├── families/
│   └── index.html            # Family Recovery module
├── images/                   # Shared image assets (values cards, icons)
├── index.html                # Coaching 101 module
├── intervention/
│   ├── index.html            # Interventionist module
│   └── styles.css            # Module-specific styling
├── package.json              # Dependencies + scripts
├── server/
│   ├── auth.js               # JWT, bcrypt, session helpers
│   ├── db.js                 # SQLite schema + helpers
│   └── index.js              # Express application entry point
├── styles.css                # Shared branding + layout
└── README.md                 # Project documentation
```

## How to Use

### For Participants

1. **Create an Account** – Register with your email the first time you log in.
2. **Pick a Module** – Coaching 101 (`/`), Families (`/families`), or Intervention (`/intervention`).
3. **Work Normally** – Fill out exercises; progress autosaves every few seconds.
4. **Watch the Status** – Header badge shows “Saving…” / “Saved” and your name.
5. **Export or Print** – Use the footer controls to back up or print at any time.

### For Facilitators

1. **Claim the Admin Seat** – The first user to register becomes `admin`.
2. **Enroll Participants** – Share the hosted URL; each participant creates their own login.
3. **Monitor Progress** – Call `GET /api/admin/progress` for rollover status by user/module.
4. **Watch Live Sessions** – Visit `/admin/` to see active sessions, current sections, and up-to-the-minute progress. The dashboard auto-refreshes every ~15 seconds while open.
5. **Track Engagement** – `GET /api/admin/engagement` surfaces recent events (navigation, exports, etc.).
6. **Query Live Presence** – `GET /api/admin/active-sessions` returns the same data shown in the dashboard table.
7. **Data Portability** – The SQLite file in `data/coaching101.db` can be backed up or queried directly.

### For Administrators

1. **Open the dashboard** – Visit `/admin/` on the same host as the workbook (e.g., `http://localhost:3000/admin/`).
2. **Sign in** – Use your Core Values Recovery credentials. Only accounts with the `admin` role can proceed.
3. **Review snapshots** – Summary cards show total participants, active participants, average progress, and latest updates.
4. **Filter & search** – Narrow results by module or participant name/email; refresh anytime for the latest autosave data.
5. **Export raw data** – Use the REST endpoints or query `coaching101.db` for deeper reporting and archival exports.

## Digital Features Breakdown

### Welcome Section
- Training overview
- Learning outcomes
- Core Values philosophy (Guide Not Guru, Four Foundations)

### Day 1: Foundations & Identity (7 hours)
- **Session 1**: Recovery story reflection, digital Values Cards, participant connections
- **Session 2**: Coaching vs other roles comparison, identity reflection, scripts & blocks
- **Session 3**: GROW Model worksheet and practice forms
- **Session 4**: Mirror vs Mentor reflections and practice notes
- **Session 5**: Levels of listening, challenges, and practice reflections
- **Session 6**: Open vs closed questions, powerful questions practice
- **Reflection**: Day 1 end-of-day reflection

### Day 2: Skills & Structures (7 hours)
- **Session 1**: Core ethical principles (5 principles with examples)
- **Session 2**: ETHICS Framework practice worksheet
- **Sessions 3 & 4**: 6 ethics scenarios with ETHICS analysis forms
- **Session 5**: Recovery Capital assessment (4 domains)
- **Session 6**: SMART goals and action planning worksheet
- **Reflection**: Day 2 end-of-day reflection

### Day 3: Practice & Integration (7 hours)
- **Session 1**: Coaching conversation structure (Opening, Exploration, Deepening, Commitment)
- **Session 2**: Coaching triads preparation
- **Session 3**: 3 rounds of triad practice with role-based forms
- **Session 4**: Coaching strengths, growth edges, development plan
- **Session 5**: Letter to future self, closing reflections, congratulations

### Resources Section
- GROW Model quick reference
- ETHICS Framework quick reference
- Powerful Questions Bank (categorized)
- State Certification Pathways (UT/OH/TX)
- Recommended resources (books, organizations, online learning)
- Glossary of key terms

## Technical Specifications

### Browser Requirements
- **Recommended**: Latest Chrome, Edge, Firefox, or Safari
- **Minimum**: Browsers with ES6, Fetch API, and cookie support
- **Mobile**: iOS Safari 12+, Chrome Mobile 70+, Samsung Internet 10+
- **Cookies**: HTTP-only session cookie must remain enabled

### Storage
- SQLite database stored at `data/coaching101.db`
- Autosave syncs via authenticated API calls (JSON payloads)
- Supports concurrent sessions across devices/browsers
- Typical record size: ~75–250KB per user per module depending on completion

### Privacy & Security
- **Hashed passwords** – Stored with bcrypt (`12` rounds) in SQLite.
- **HTTP-only cookies** – Sessions delivered via signed JWT cookies.
- **CORS controls** – Optional `FRONTEND_ORIGIN` whitelist for multi-domain deployments.
- **Participant exports** – Users can export/delete their responses at any time.
- **Admin-only reports** – Progress/engagement endpoints require `admin` role cookies.

### Responsive Breakpoints
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px-1199px (adapted columns)
- **Mobile**: <768px (stacked layout)

## Customization

### Colors
To customize the Core Values Recovery colors, edit `styles.css`:

```css
:root {
    --navy: #1D4486;    /* Primary brand color */
    --gold: #D4AA4C;    /* Accent color */
    /* ... other variables */
}
```

### Content
All content is in `index.html` for easy editing. Each section is clearly marked with HTML comments.

### Fonts
The application uses Google Fonts:
- **Bebas Neue** - Headings
- **Roboto Condensed** - Body text

## Deployment Options

- Render, Railway, Fly.io, or similar Node hosting with persistent volumes
- Heroku or Azure App Service (configure `npm start` entry point)
- Docker container behind nginx/Caddy with HTTPS termination
- Self-managed VM (Ubuntu/Debian) using PM2 or systemd to run `npm start`

## Data Management

### Auto-Save
- Debounced sync (~1.5 s) after each keystroke/blur
- Cloud persistence via `PUT /api/progress/:moduleId`
- Header badge reflects saving state in real time

### Export Format
Exports as JSON with the following structure:
```json
{
  "exportDate": "2025-10-27T...",
  "moduleId": "coaching101",
  "user": {
    "id": 1,
    "email": "person@example.com"
  },
  "formData": {
    "field-id": "value",
    ...
  }
}
```

### Import
Participants can import previously exported JSON files to restore their work. Imports immediately sync to the database.

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast color scheme (navy/white)
- Readable font sizes (minimum 16px body)
- Form labels properly associated with inputs

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 80+ | ✅ Full |
| Firefox | 75+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Edge | 80+ | ✅ Full |
| iOS Safari | 12+ | ✅ Full |
| Chrome Mobile | 70+ | ✅ Full |

## Known Limitations

- **Browser Dependency**: Data is tied to the browser and device used
- **No Cloud Sync**: Switching devices requires manual export/import
- **Session Cookies**: Ensure cookies are enabled so autosave requests stay authenticated
- **Print Formatting**: Some browsers may render print differently

## Troubleshooting

### Data Not Saving
1. Confirm you are logged in (header should show your name + “Saved” status)
2. Check network connectivity or VPN/firewall rules blocking `PUT /api/progress`
3. Review server logs for SQLite permission errors
4. Export your data as a local backup

### Progress Not Updating
1. Refresh the page to re-run calculation
2. Ensure JavaScript is enabled
3. Check browser console for validation errors

### Can't Navigate Between Sections
1. Ensure JavaScript is enabled
2. Try a different browser
3. Check browser console for errors

## Support

For issues, questions, or contributions:
- Review the `CLAUDE.md` file for project context
- Check the original `Participant_Manual.md` for content reference
- Consult the `Facilitator_Manual.md` for training context

## License

This training material is property of Core Values Recovery.

## Credits

- **Training Design**: Core Values Recovery
- **Digital Workbook**: Built with vanilla HTML, CSS, and JavaScript
- **Fonts**: Google Fonts (Bebas Neue, Roboto Condensed)
- **Icons**: Emoji (🪞 🧭 🗼 🌳)

---

**Version**: 1.0
**Last Updated**: October 2025
**Contact**: Core Values Recovery

🪞 🧭 🗼 🌳

*May you coach from your values, trust the process, and honor the guide within you.*
