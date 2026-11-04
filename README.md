# Codeless Technologies – Dynamic Company Portfolio

**Production Domain:** [https://portfolio.codelessai.in](https://portfolio.codelessai.in)  
**Hosting Target:** GitHub Pages with Custom Domain & HTTPS  
**Frontend Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7  
**Data Engine:** Google Sheets (Single Source of Truth) via Google Apps Script (Read-Only JSON API)  
**Image Storage:** Google Drive direct public links + CDN support  

---

## 1. Architectural Philosophy

Codeless Technologies is an AI-first technology company developing intelligent software solutions, AI voice agents, and business process automation platforms.

This portfolio is an entirely **static frontend application**. It does **not** introduce Node.js server dependencies, containerized backends, or SQL databases. Instead, **Google Sheets acts as the database**, allowing administrators to publish, edit, or remove projects in real time without touching frontend code or redeploying the repository.

---

## 2. Directory Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Actions deployment to GitHub Pages
├── google-apps-script/
│   └── Code.gs                 # Production-ready Google Apps Script JSON API backend
├── google-sheets/
│   ├── SCHEMA.md               # Complete schema definition for all 4 worksheets
│   ├── PROJECTS.csv            # Ready-to-import template for PROJECTS sheet
│   ├── PROJECT_DETAILS.csv     # Ready-to-import template for PROJECT_DETAILS sheet
│   ├── PROJECT_MEDIA.csv       # Ready-to-import template for PROJECT_MEDIA sheet
│   └── SITE_CONFIG.csv         # Ready-to-import template for SITE_CONFIG sheet
├── public/
│   ├── 404.html                # GitHub Pages SPA redirect fallback (clean URLs)
│   ├── CNAME                   # Custom domain declaration (portfolio.codelessai.in)
│   ├── robots.txt              # Search engine crawler permissions
│   └── sitemap.xml             # XML sitemap for SEO indexing
├── src/
│   ├── assets/                 # High-resolution generated UI/AI visuals
│   ├── components/
│   │   ├── AdminApiModal.tsx   # In-app Google Sheets connection & cache manager
│   │   ├── Footer.tsx          # Quiet tech footer with dynamic contact links
│   │   ├── Lightbox.tsx        # High-res image gallery modal with keyboard navigation
│   │   ├── Navbar.tsx          # 3-zone Top Bar Contract navigation
│   │   ├── ProjectCard.tsx     # Zero-pill metadata project card
│   │   └── SmartImage.tsx      # Google Drive URL normalizer & resilient fallback
│   ├── pages/
│   │   ├── AboutPage.tsx       # Company background, mission, vision, and principles
│   │   ├── ContactPage.tsx     # Validated inquiry form & direct WhatsApp connection
│   │   ├── HomePage.tsx        # Hero, featured projects, capabilities, and CTAs
│   │   ├── NotFoundPage.tsx    # Custom 404 page
│   │   └── ProjectsPage.tsx    # Search, category/tech/status filtering, and sorting
│   ├── services/
│   │   ├── api.ts              # API service layer with caching and fallback
│   │   ├── imageUtils.ts       # Google Drive URL parser and SVG fallback generator
│   │   └── mockData.ts         # High-fidelity initial seed dataset
│   ├── types/
│   │   └── portfolio.ts        # TypeScript data contracts
│   ├── App.tsx                 # Application root & router wiring
│   ├── index.css               # Tailwind CSS v4 styling & dark theme variables
│   └── main.tsx                # React DOM entry point
├── .env.example
├── index.html                  # HTML entry point with SEO meta & SPA redirect restorer
└── vite.config.ts
```

---

## 3. Google Sheets & Apps Script Setup Guide

### Step 1: Create the Google Spreadsheet
1. Create a new Google Spreadsheet at [https://sheets.new](https://sheets.new).
2. Rename the document to **"Codeless Portfolio Database"**.
3. Create 4 worksheets with the exact names:
   - `PROJECTS`
   - `PROJECT_DETAILS`
   - `PROJECT_MEDIA`
   - `SITE_CONFIG`
4. In each worksheet, import or copy the header row and sample rows from the CSV files in `google-sheets/`.

### Step 2: Deploy Google Apps Script Web App
1. In the Google Spreadsheet, click **Extensions → Apps Script**.
2. Replace all existing code in `Code.gs` with the contents of `google-apps-script/Code.gs`.
3. Click the blue **Deploy** button in the top right → **New deployment**.
4. In the gear icon on the left, select **Web app**.
5. Set:
   - **Description:** `Codeless Portfolio API v1`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(Crucial: allows read-only GET requests from GitHub Pages)*
6. Click **Deploy** and authorize the script when prompted.
7. Copy the generated **Web app URL** (format: `https://script.google.com/macros/s/.../exec`).

### Step 3: Connect Frontend to Google Sheets
- **Option A (Environment Variable):** Set `VITE_GOOGLE_APPS_SCRIPT_URL="YOUR_WEB_APP_URL"` in your `.env` or GitHub repository secrets.
- **Option B (Instant in-app admin):** Open the website, click **Sheet Sync** in the top navigation bar, paste your Web App URL, and click **Test Live Connection**. It will immediately verify connectivity and cache the response.

---

## 4. Google Drive Image Storage Workflow

Google Drive public links are fully supported. Administrators can upload images to Google Drive and paste the share URL directly into the `thumbnail_image`, `cover_image`, or `image_url` columns.

### Recommended Google Drive Folder Hierarchy:
```text
Codeless Portfolio Assets/
├── CodeVoice/
│   ├── thumbnail.webp
│   ├── cover.webp
│   └── screenshot-01.webp
├── AIVOA/
│   ├── thumbnail.webp
│   └── cover.webp
└── BizFlow/
    ├── thumbnail.webp
    └── cover.webp
```

### Upload & Sharing Instructions:
1. Upload the image file (recommended: WebP, PNG, or JPEG, 1600×900 for covers, 1200×800 for thumbnails).
2. Right-click the file in Google Drive → **Share** → set General access to **"Anyone with the link can view"**.
3. Copy the link (e.g. `https://drive.google.com/file/d/1A2B3C4D5E/view?usp=sharing`).
4. Paste this exact link into the spreadsheet cell.
5. The frontend's `imageUtils.ts` automatically converts the Drive ID into a high-speed direct stream URL (`https://lh3.googleusercontent.com/d/1A2B3C4D5E`) with instant lazy loading and zero-broken-image fallbacks.

---

## 5. Administrator Content Workflow

| Action | Steps in Google Sheets |
| :--- | :--- |
| **Add Project** | Add a new row to `PROJECTS` with a unique `project_id` and URL-friendly `slug`. Add sections to `PROJECT_DETAILS` and screenshots to `PROJECT_MEDIA`. Set `published = TRUE`. |
| **Edit Project** | Edit text, links, or image URLs directly in the cell. Changes automatically propagate within 5 minutes or instantly upon clicking "Refresh Cache". |
| **Feature on Homepage** | Set `featured = TRUE` in `PROJECTS`. |
| **Unpublish Project** | Set `published = FALSE`. The project immediately disappears from featured, listings, search results, and direct slug URLs. |

---

## 6. GitHub Pages & Custom Domain Deployment

### Custom Domain: `https://portfolio.codelessai.in`

1. **GitHub Repository Configuration:**
   - Push this repository to GitHub (`main` branch).
   - In GitHub repository: **Settings → Pages** → Under **Build and deployment**, set Source to **GitHub Actions**.
   - Under **Custom domain**, enter: `portfolio.codelessai.in`.
   - Check **Enforce HTTPS**.

2. **DNS Record Setup (Domain Registrar):**
   - If using a subdomain (`portfolio.codelessai.in`): Add a **CNAME** record:
     - **Host / Name:** `portfolio`
     - **Target / Value:** `<your-github-username>.github.io`
   - (Or if apex domain, configure GitHub's 4 apex A records).

3. **Clean URL SPA Support on GitHub Pages:**
   - GitHub Pages serves static files and returns `404` for direct deep links like `/projects/codevoice` upon browser refresh.
   - We have implemented the industry-standard clean SPA URL solution:
     - `public/404.html` captures the deep route, encodes it into query params, and redirects to `/`.
     - `index.html` detects the redirect, executes `window.history.replaceState` before React Router mounts, and restores the URL cleanly without visible reload loops.

---

## 7. Development & Local Testing

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```
# Codeless-Portfolio
