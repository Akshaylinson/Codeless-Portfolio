/**
 * Image normalization and Google Drive direct URL conversion utility.
 * Supports:
 * - Google Drive share URLs
 * - Google Drive open/uc URLs
 * - Direct CDN URLs (WebP, PNG, JPEG)
 * - Local Vite asset paths
 */

export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '';

  const trimmed = url.trim();

  // Only transform Google Drive share/open/uc URLs into direct stream URLs.
  // All other URLs (GitHub raw, CDN, custom domains, etc.) are returned as-is.
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  return trimmed;
}

/**
 * Returns a tasteful, dark tech SVG placeholder data URI with title
 */
export function getFallbackImageSvg(title: string = 'Codeless Technologies'): string {
  const safeTitle = (title || 'Codeless Tech')
    .replace(/[&<>"']/g, '')
    .slice(0, 36);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none">
    <rect width="800" height="500" fill="#0c0d10"/>
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f242d" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="800" height="500" fill="url(#grid)" />
    <circle cx="400" cy="220" r="48" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
    <path d="M 385 220 L 415 220 M 400 205 L 400 235" stroke="#f4f4f5" stroke-width="1.5" stroke-linecap="round"/>
    <text x="400" y="310" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="14" font-weight="500" letter-spacing="1" text-anchor="middle">${safeTitle.toUpperCase()}</text>
    <text x="400" y="335" fill="#52525b" font-family="system-ui, sans-serif" font-size="11" letter-spacing="1.5" text-anchor="middle">CODELESS TECHNOLOGIES</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
