# Codeless Technologies – Google Sheets Database Architecture

This directory provides the schema and CSV templates to set up the Google Spreadsheet for Codeless Technologies' dynamic portfolio.

The spreadsheet serves as the **single source of truth** for all portfolio content. An administrator can add, edit, reorder, feature, publish, and unpublish projects simply by editing rows in Google Sheets. No frontend code changes or GitHub deployments are required.

---

## Worksheets Overview

The spreadsheet must contain four worksheets with exact names:

1. **`PROJECTS`**
2. **`PROJECT_DETAILS`**
3. **`PROJECT_MEDIA`**
4. **`SITE_CONFIG`**

---

## Worksheet 1: `PROJECTS`

Stores top-level metadata for each project.

| Column Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `project_id` | String | Unique project identifier | `PRJ001` |
| `slug` | String | URL-friendly unique identifier | `codevoice` |
| `project_name` | String | Display name of the product or system | `CodeVoice` |
| `tagline` | String | One-line headline descriptor | `AI-Powered Conversational Voice Engine` |
| `short_description` | String | 1–2 sentence summary for cards | `Real-time bidirectional speech synthesis...` |
| `full_description` | String | Comprehensive overview of the system | `CodeVoice is Codeless Technologies' flagship...` |
| `category` | String | Project taxonomy category | `AI & Voice Technology` |
| `technologies` | String (Comma-separated) | Tech stack list | `Python, FastAPI, React, ONNX, WebSockets` |
| `thumbnail_image` | String (URL) | Direct image URL or Google Drive share link | `https://drive.google.com/file/d/...` |
| `cover_image` | String (URL) | High-res detail page hero cover image | `https://drive.google.com/file/d/...` |
| `live_url` | String (URL) | URL of running application (optional) | `https://voice.codelessai.in` |
| `github_url` | String (URL) | Public repository URL (optional) | `https://github.com/codelesstechnologies/...` |
| `status` | String | Project phase | `Development`, `Production`, `Live`, `Beta` |
| `featured` | Boolean (`TRUE`/`FALSE`) | Whether to show on Homepage featured section | `TRUE` |
| `published` | Boolean (`TRUE`/`FALSE`) | Visibility flag (`FALSE` hides everywhere) | `TRUE` |
| `created_date` | String / Date | Creation date for sorting | `2026-03-15` |
| `sort_order` | Number | Numeric priority for ordering | `1` |

---

## Worksheet 2: `PROJECT_DETAILS`

Stores granular editorial sections for each project.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `project_id` | String | Foreign key matching `PROJECTS.project_id` |
| `section_type` | String | Section category: `overview`, `problem`, `solution`, `features`, `architecture`, `outcomes`, `additional` |
| `heading` | String | Section header display title |
| `content` | String / JSON | Paragraph text or JSON array for bulleted features |
| `sort_order` | Number | Display order within the detail page |

---

## Worksheet 3: `PROJECT_MEDIA`

Stores screenshots, diagrams, and gallery images.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `media_id` | String | Unique media identifier (e.g. `MED001`) |
| `project_id` | String | Foreign key matching `PROJECTS.project_id` |
| `image_url` | String (URL) | Direct URL or Google Drive share link |
| `caption` | String | Descriptive caption displayed under lightbox viewer |
| `media_type` | String | Type: `thumbnail`, `cover`, `screenshot`, `gallery` |
| `sort_order` | Number | Sort sequence in gallery |

---

## Worksheet 4: `SITE_CONFIG`

Stores dynamic company configuration, contact information, and branding.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `key` | String | Configuration key |
| `value` | String | Value for the corresponding key |

Supported keys:
- `company_name`: `Codeless Technologies`
- `company_tagline`: `Building Intelligent Digital Solutions.`
- `company_description`: Company background summary
- `website`: `https://portfolio.codelessai.in`
- `email`: `contact@codelessai.in`
- `phone`: `+91 98765 43210`
- `whatsapp`: `+919876543210`
- `linkedin`: `https://www.linkedin.com/company/codeless-technologies`
- `logo_url`: Optional direct logo image URL
- `portfolio_title`: `Codeless Technologies | Engineering Intelligence`
- `contact_cta_text`: Custom project inquiry prompt text
