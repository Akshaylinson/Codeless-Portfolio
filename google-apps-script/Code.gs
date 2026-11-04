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
 * 5. Run seedProjects() ONCE to populate the 6 demo projects.
 * 6. Click: Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL into your .env or the in-app Admin Sync modal.
 */

/**
 * Run ONCE to create the PROJECTS and SITE_CONFIG worksheets.
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
    ['email',             'hello@codelessai.in'],
    ['phone',             ''],
    ['whatsapp',          ''],
    ['linkedin',          ''],
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

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  var msg = '';
  if (created.length) msg += 'Created: ' + created.join(', ') + '.\n';
  if (skipped.length) msg += 'Already existed (skipped): ' + skipped.join(', ') + '.';
  Logger.log('Setup Complete: ' + (msg || 'Nothing to do.'));
}

/**
 * Run ONCE to seed the PROJECTS sheet with the 6 demo projects.
 * Safe to re-run: skips rows whose project_id already exists.
 */
function seedProjects() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('PROJECTS');
  if (!sheet) {
    Logger.log('PROJECTS sheet not found. Run setupSpreadsheet() first.');
    return;
  }

  var colMap = [
    'project_id','slug','project_name','tagline','short_description','full_description',
    'category','technologies','thumbnail_image','cover_image','live_url','github_url',
    'status','featured','published','created_date','sort_order',
    'image_1','image_1_caption','image_2','image_2_caption','image_3','image_3_caption'
  ];

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h) { return String(h).trim(); });

  var existingIds = [];
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var idCol = headers.indexOf('project_id') + 1;
    var existingData = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
    existingIds = existingData.map(function(r) { return String(r[0]).trim(); });
  }

  var projects = [
    [
      'PRJ001', 'codevoice', 'CodeVoice',
      'Intelligent AI Voice Platform & Conversational Speech Engine',
      'Real-time conversational voice synthesis and agent framework delivering ultra-low-latency bidirectional speech interactions.',
      'CodeVoice is Codeless Technologies\' flagship conversational speech technology platform. Built for latency-critical telephony and customer support automation, it combines custom streaming acoustic neural models with sub-200ms round-trip speech synthesis, real-time sentiment extraction, and seamless CRM integrations.',
      'AI & Voice Technology', 'Python, FastAPI, React, ONNX, WebSockets, PyTorch',
      '', '', 'https://voice.codelessai.in', 'https://github.com/codelesstechnologies/codevoice-core',
      'Development', 'TRUE', 'TRUE', '2026-03-15', 1,
      '', '', '', '', '', ''
    ],
    [
      'PRJ002', 'aivoa-pharmaceutical-qms', 'AIVOA.AI',
      'Enterprise Pharmaceutical Quality Management & GMP Compliance',
      'Intelligent electronic batch records, CAPA workflow automation, and 21 CFR Part 11 compliant audit verification for life sciences.',
      'AIVOA.AI represents a leap forward in pharmaceutical quality and validation systems. Engineered in strict compliance with FDA 21 CFR Part 11 and EU Annex 11, it automates deviation tracking, audit trails, and automated batch release protocol verification through verifiable data integrity checks.',
      'Pharmaceutical Software', 'TypeScript, Next.js, PostgreSQL, Tailwind CSS, AuditLog21, Python',
      '', '', 'https://aivoa.codelessai.in', '',
      'Production', 'TRUE', 'TRUE', '2026-02-10', 2,
      '', '', '', '', '', ''
    ],
    [
      'PRJ003', 'bizflow-automation-engine', 'BizFlow Omni',
      'Autonomous Enterprise Process Automation & Orchestration',
      'Autonomous workflow execution engine linking legacy enterprise databases, third-party ERPs, and AI task planners.',
      'BizFlow Omni solves enterprise data silos by automating complex multi-stage approvals, document parsing, invoice reconciliation, and data synchronization between SAP, Salesforce, and bespoke internal systems.',
      'Business Automation', 'Go, React, Redis, Temporal, Docker, REST API',
      '', '', 'https://bizflow.codelessai.in', 'https://github.com/codelesstechnologies/bizflow-engine',
      'Production', 'TRUE', 'TRUE', '2026-01-20', 3,
      '', '', '', '', '', ''
    ],
    [
      'PRJ004', 'visionsense-edge-analytics', 'VisionSense Edge',
      'Real-Time Computer Vision & Industrial Edge Telemetry',
      'High-speed edge camera inference platform for defect inspection, facility safety monitoring, and vehicle telemetry.',
      'VisionSense Edge deploys quantized computer vision models onto edge gateway hardware, achieving 30+ FPS video analysis with zero external cloud dependencies. Designed for manufacturing plants and logistics facilities.',
      'Computer Vision & Edge AI', 'C++, Python, TensorRT, WebRTC, React, Tailwind CSS',
      '', '', '', 'https://github.com/codelesstechnologies/visionsense',
      'Development', 'TRUE', 'TRUE', '2025-11-14', 4,
      '', '', '', '', '', ''
    ],
    [
      'PRJ005', 'synthetix-pharmadocs', 'Synthetix PharmaDocs',
      'Regulatory Dossier & Submission Automation Platform',
      'Automated eCTD regulatory dossier compiler and chemical composition validation engine for pharmaceutical submissions.',
      'Synthetix PharmaDocs simplifies the preparation of drug master files (DMF) and investigational new drug (IND) dossiers. Features automated cross-reference verification and regulatory terminology reconciliation.',
      'Pharmaceutical Software', 'Python, FastAPI, React, NLP, Elasticsearch',
      '', '', 'https://pharmadocs.codelessai.in', '',
      'Beta', 'FALSE', 'TRUE', '2025-10-05', 5,
      '', '', '', '', '', ''
    ],
    [
      'PRJ006', 'novaspeech-multilingual-tts', 'NovaSpeech TTS',
      'Ultra-Low Latency Multilingual Neural Voice Generator',
      'High-fidelity neural text-to-speech API supporting 24+ languages with streaming acoustic pitch and pacing controls.',
      'NovaSpeech generates lifelike human speech from text streams with studio acoustic warmth. Used by interactive kiosks, audio-book publishers, and accessibility tools.',
      'AI & Voice Technology', 'Rust, PyTorch, gRPC, Docker, React',
      '', '', 'https://novaspeech.codelessai.in', 'https://github.com/codelesstechnologies/novaspeech',
      'Live', 'FALSE', 'TRUE', '2025-08-18', 6,
      '', '', '', '', '', ''
    ]
  ];

  var added = [];
  var skipped = [];

  projects.forEach(function(row) {
    var projectId = String(row[0]);
    if (existingIds.indexOf(projectId) !== -1) {
      skipped.push(projectId);
      return;
    }
    var orderedRow = headers.map(function(h) {
      var idx = colMap.indexOf(h);
      return idx !== -1 ? row[idx] : '';
    });
    sheet.appendRow(orderedRow);
    added.push(projectId);
  });

  Logger.log(
    'Seed complete. Added: [' + added.join(', ') + ']. ' +
    'Skipped (already exist): [' + skipped.join(', ') + '].'
  );
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
