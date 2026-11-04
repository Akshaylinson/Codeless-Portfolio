/**
 * CODELESS TECHNOLOGIES – DYNAMIC PORTFOLIO API
 * 
 * Google Apps Script Web App (Read-Only JSON API)
 * Spreadsheet Backend: Google Sheets (2 worksheets: PROJECTS, SITE_CONFIG)
 * Frontend Target: https://portfolio.codelessai.in (GitHub Pages)
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open your Google Spreadsheet.
 * 2. Click: Extensions → Apps Script
 * 3. Replace Code.gs with this file.
 * 4. Run setupSpreadsheet() ONCE to create worksheets.
 * 5. Click: Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into your .env or the in-app Admin Sync modal.
 */

/**
 * Run ONCE from the Apps Script editor to initialize worksheets.
 * Safe to re-run: skips sheets that already exist.
 */
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var SHEETS = {
    PROJECTS: [
      'project_id', 'slug', 'project_name', 'tagline', 'short_description',
      'full_description', 'category', 'technologies', 'thumbnail_image',
      'cover_image', 'live_url', 'github_url', 'status', 'featured',
      'published', 'created_date', 'sort_order',
      'image_1', 'image_1_caption',
      'image_2', 'image_2_caption',
      'image_3', 'image_3_caption'
    ],
    SITE_CONFIG: ['key', 'value']
  };

  var SITE_CONFIG_DEFAULTS = [
    ['company_name',       'Codeless Technologies'],
    ['company_tagline',    'Building Intelligent Digital Solutions.'],
    ['company_description','Codeless Technologies is an AI-first company building intelligent software solutions, AI voice agents, and business process automation platforms.'],
    ['website',           'https://portfolio.codelessai.in'],
    ['email',             'contact@codelessai.in'],
    ['phone',             '+91 98765 43210'],
    ['whatsapp',          '+919876543210'],
    ['linkedin',          'https://www.linkedin.com/company/codeless-technologies'],
    ['logo_url',          ''],
    ['portfolio_title',   'Codeless Technologies | Engineering Intelligence'],
    ['contact_cta_text',  'Have a project in mind? Let\'s build something intelligent together.']
  ];

  var created = [];
  var skipped = [];

  for (var name in SHEETS) {
    var existing = ss.getSheetByName(name);
    if (existing) {
      skipped.push(name);
      continue;
    }

    var sheet = ss.insertSheet(name);
    var headers = SHEETS[name];
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    if (name === 'SITE_CONFIG') {
      sheet.getRange(2, 1, SITE_CONFIG_DEFAULTS.length, 2).setValues(SITE_CONFIG_DEFAULTS);
      sheet.autoResizeColumns(1, 2);
    }

    created.push(name);
  }

  // Remove default blank Sheet1 if present
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  var msg = '';
  if (created.length) msg += 'Created: ' + created.join(', ') + '.\n';
  if (skipped.length) msg += 'Already existed (skipped): ' + skipped.join(', ') + '.';
  Logger.log('Setup Complete: ' + (msg || 'Nothing to do.'));
}

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action || 'projects';
  var callback = params.callback || '';

  var payload = { success: false, timestamp: new Date().toISOString() };

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'site') {
      payload.site = getSiteConfigData(ss);
      payload.success = true;
    } else if (action === 'projects') {
      payload.projects = getPublishedProjectsData(ss);
      payload.success = true;
    } else {
      payload.error = 'Unrecognized action: ' + action + '. Supported: site, projects';
    }
  } catch (err) {
    payload.success = false;
    payload.error = 'Spreadsheet API Error: ' + err.toString();
  }

  var jsonString = JSON.stringify(payload);

  if (callback && /^[a-zA-Z0-9_]+$/.test(callback)) {
    var jsonp = ContentService.createTextOutput(callback + '(' + jsonString + ');');
    jsonp.setMimeType(ContentService.MimeType.JAVASCRIPT);
    return jsonp;
  }

  var output = ContentService.createTextOutput(jsonString);
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getPublishedProjectsData(ss) {
  var sheet = ss.getSheetByName('PROJECTS');
  if (!sheet) throw new Error('Worksheet "PROJECTS" not found.');

  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  var headers = values[0].map(function(h) { return String(h).trim(); });
  var projects = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }

    if (String(item.published).trim().toUpperCase() !== 'TRUE') continue;

    item.published = true;
    item.featured = String(item.featured).trim().toUpperCase() === 'TRUE';
    item.sort_order = Number(item.sort_order) || 999;

    if (typeof item.technologies === 'string') {
      item.technologies = item.technologies
        .split(',')
        .map(function(t) { return t.trim(); })
        .filter(function(t) { return t.length > 0; });
    } else if (!item.technologies) {
      item.technologies = [];
    }

    if (item.created_date instanceof Date) {
      item.created_date = Utilities.formatDate(item.created_date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }

    // Normalize optional image fields to empty string if blank
    ['image_1', 'image_1_caption', 'image_2', 'image_2_caption', 'image_3', 'image_3_caption'].forEach(function(key) {
      item[key] = item[key] ? String(item[key]).trim() : '';
    });

    projects.push(item);
  }

  return projects.sort(function(a, b) { return a.sort_order - b.sort_order; });
}

function getSiteConfigData(ss) {
  var sheet = ss.getSheetByName('SITE_CONFIG');
  if (!sheet) return {};

  var values = sheet.getDataRange().getValues();
  var config = {};

  for (var i = 1; i < values.length; i++) {
    var key = String(values[i][0]).trim();
    if (key) config[key] = values[i][1];
  }

  return config;
}
