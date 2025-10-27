# Coaching 101: Digital Coaching Workbook

![Core Values Recovery](https://img.shields.io/badge/Core_Values-Recovery-1D4486?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0-D4AA4C?style=for-the-badge)

## Overview

**Coaching 101: Core Values Foundations for Recovery Coaches** is a comprehensive, digital-first interactive workbook for the 21-hour, three-day peer recovery coach training program. This web-based application transforms the traditional participant manual into an engaging, modern learning experience.

### Key Features

- **🎨 Digital-First Design** - Modern, responsive web application optimized for all devices
- **💾 Auto-Save Functionality** - All work is automatically saved to your browser as you type
- **📊 Progress Tracking** - Visual progress bar shows completion percentage
- **🎯 Interactive Forms** - All exercises, reflections, and worksheets are digital
- **🪞 Digital Values Cards** - Interactive card selection replacing physical card sorts
- **📱 Mobile Responsive** - Works seamlessly on phones, tablets, and desktops
- **🖨️ Print-Friendly** - Export and print your completed workbook
- **💾 Import/Export** - Save your work as JSON and restore it later
- **🎨 Core Values Branding** - Navy (#1D4486) and Gold (#D4AA4C) color scheme
- **🔒 Privacy-First** - All data stored locally in your browser (no server required)

## Quick Start

### Option 1: Open Locally

1. Download all files to your computer
2. Open `index.html` in any modern web browser
3. Start your learning journey!

### Option 2: Deploy to Web Server

1. Upload all files to your web hosting
2. Navigate to the URL in your browser
3. Share with participants via the URL

### Option 3: GitHub Pages (Recommended)

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Access via: `https://yourusername.github.io/coaching101`

## File Structure

```
coaching101/
├── index.html          # Main application file (all 3 days + resources)
├── styles.css          # Core Values Recovery branded styling
├── app.js             # Navigation, auto-save, and interactive features
├── content.js         # Content data structure (optional reference)
├── README.md          # This file
├── CLAUDE.md          # Project instructions for AI assistance
├── Participant_Manual.md    # Original markdown source
├── Facilitator_Manual.md    # Facilitator's guide
└── Coaching_101_Requirements_Packet.md  # Requirements specification
```

## How to Use

### For Participants

1. **Bookmark the Page** - Save the URL or file location for easy access
2. **Navigate** - Use the top navigation to move between days
3. **Complete Exercises** - Fill out forms as you progress through training
4. **Auto-Save** - Your work saves automatically; look for the progress bar
5. **Export** - Click "Export Workbook" to download your complete responses
6. **Print** - Click "Print Version" or use your browser's print function

### For Facilitators

1. Share the workbook URL or file with participants before Day 1
2. Encourage participants to bookmark and test access
3. Use the workbook during training sessions as the interactive companion
4. Participants can complete reflection exercises in real-time
5. Export functionality allows participants to save their work
6. Print-friendly design supports backup paper copies if needed

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
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Minimum**: Any browser with ES6 JavaScript support and localStorage
- **Mobile**: iOS Safari 12+, Chrome Mobile 70+, Samsung Internet 10+

### Storage
- Uses browser `localStorage` for data persistence
- No external database required
- Data stored locally on user's device
- Typical storage: 50-200KB depending on completion

### Privacy & Security
- **No tracking** - Zero analytics or tracking scripts
- **Local-only** - All data stays on participant's device
- **No server** - Can run entirely offline after initial load
- **Export control** - Participants control their data export

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

### Static Hosting (Recommended)
- GitHub Pages (free)
- Netlify (free tier)
- Vercel (free tier)
- AWS S3 + CloudFront
- Any web server (Apache, Nginx)

### No Hosting Required
- Distribute `index.html`, `styles.css`, and `app.js` as a ZIP
- Participants open `index.html` locally in their browser
- Works completely offline

## Data Management

### Auto-Save
- Saves every time a field loses focus (blur event)
- Saves on every keystroke (input event) with debouncing
- Visual progress indicator updates every 5 seconds

### Export Format
Exports as JSON with the following structure:
```json
{
  "exportDate": "2025-10-27T...",
  "version": "1.0",
  "participant": "Coaching 101 Participant",
  "formData": {
    "field-id": "value",
    ...
  }
}
```

### Import
Participants can import previously exported JSON files to restore their work.

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
- **LocalStorage Limits**: Most browsers limit to 5-10MB (more than enough)
- **Print Formatting**: Some browsers may render print differently

## Troubleshooting

### Data Not Saving
1. Check if browser allows localStorage (some private modes block it)
2. Clear browser cache and reload
3. Try a different browser
4. Export your data as backup

### Progress Not Updating
1. Refresh the page
2. Clear browser cache
3. Check JavaScript console for errors

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
