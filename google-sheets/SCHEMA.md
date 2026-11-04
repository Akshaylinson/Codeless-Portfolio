# Codeless Technologies – Google Sheets Database Architecture

The spreadsheet contains **two worksheets**:

1. **`PROJECTS`** — all project data including images
2. **`SITE_CONFIG`** — company branding and contact configuration

---

## Worksheet 1: `PROJECTS`

| Column Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `project_id` | String | Unique project identifier | `PRJ001` |
| `slug` | String | URL-friendly unique identifier | `codevoice` |
| `project_name` | String | Display name | `CodeVoice` |
| `tagline` | String | One-line headline | `AI-Powered Conversational Voice Engine` |
| `short_description` | String | 1–2 sentence summary for cards | `Real-time bidirectional speech synthesis...` |
| `full_description` | String | Full overview shown on detail page | `CodeVoice is...` |
| `category` | String | Project taxonomy | `AI & Voice Technology` |
| `technologies` | String (comma-separated) | Tech stack | `Python, FastAPI, React` |
| `thumbnail_image` | String (URL) | Card thumbnail | `https://drive.google.com/file/d/...` |
| `cover_image` | String (URL) | Detail page hero image | `https://drive.google.com/file/d/...` |
| `live_url` | String (URL) | Live demo URL (optional) | `https://voice.codelessai.in` |
| `github_url` | String (URL) | GitHub repo URL (optional) | `https://github.com/...` |
| `status` | String | Project phase | `Development`, `Production`, `Live`, `Beta` |
| `featured` | Boolean | Show on homepage featured section | `TRUE` |
| `published` | Boolean | Visibility flag (`FALSE` hides everywhere) | `TRUE` |
| `created_date` | String / Date | Creation date | `2026-03-15` |
| `sort_order` | Number | Display order priority | `1` |
| `image_1` | String (URL) | Gallery image 1 (optional) | `https://drive.google.com/file/d/...` |
| `image_1_caption` | String | Caption for image 1 (optional) | `Dashboard overview` |
| `image_2` | String (URL) | Gallery image 2 (optional) | `https://drive.google.com/file/d/...` |
| `image_2_caption` | String | Caption for image 2 (optional) | `Pipeline architecture` |
| `image_3` | String (URL) | Gallery image 3 (optional) | `https://drive.google.com/file/d/...` |
| `image_3_caption` | String | Caption for image 3 (optional) | `Mobile view` |

**Notes:**
- `image_1`, `image_2`, `image_3` are all optional. Leave blank if not needed.
- The frontend only renders image cards for non-empty URLs — no blank placeholders are shown.
- Captions are optional even when the image URL is provided.

---

## Worksheet 2: `SITE_CONFIG`

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `key` | String | Configuration key |
| `value` | String | Value for the key |

Supported keys:
- `company_name`
- `company_tagline`
- `company_description`
- `website`
- `email`
- `phone`
- `whatsapp`
- `linkedin`
- `logo_url`
- `portfolio_title`
- `contact_cta_text`
