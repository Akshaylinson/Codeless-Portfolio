/**
 * CODELESS TECHNOLOGIES – DYNAMIC PORTFOLIO API
 * 
 * Google Apps Script Web App (Read-Only JSON API)
 * Spreadsheet Backend: Google Sheets
 * Frontend Target: https://portfolio.codelessai.in (GitHub Pages)
 *
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Spreadsheet containing the 4 worksheets:
 *    - PROJECTS
 *    - PROJECT_DETAILS
 *    - PROJECT_MEDIA
 *    - SITE_CONFIG
 * 2. Click: Extensions -> Apps Script
 * 3. Replace the contents of Code.gs with this exact code.
 * 4. Click: Deploy -> New deployment
 * 5. Select type: "Web app"
 * 6. Set Description: "Codeless Portfolio API v1"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone"  <-- CRITICAL FOR PUBLIC READ-ONLY ACCESS
 * 9. Click "Deploy" and copy the provided Web App URL.
 * 10. Paste the Web App URL into your .env or the in-app Admin Sync modal.
 */

var CACHE_EXPIRATION_SECONDS = 300; // 5 minutes cache

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action || 'projects';
  var slug = params.slug || '';
  var callback = params.callback || ''; // Optional JSONP support if needed

  var responsePayload = {
    success: false,
    timestamp: new Date().toISOString()
  };

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'site') {
      responsePayload.site = getSiteConfigData(ss);
      responsePayload.success = true;
    } else if (action === 'project' && slug) {
      var projectData = getProjectBySlugData(ss, slug);
      if (projectData) {
        responsePayload.success = true;
        responsePayload.project = projectData.project;
        responsePayload.details = projectData.details;
        responsePayload.media = projectData.media;
      } else {
        responsePayload.success = false;
        responsePayload.error = 'Project with slug "' + slug + '" not found or is unpublished.';
      }
    } else if (action === 'projects') {
      responsePayload.projects = getPublishedProjectsData(ss);
      responsePayload.success = true;
    } else {
      responsePayload.error = 'Unrecognized action: ' + action + '. Supported actions: site, projects, project';
    }
  } catch (err) {
    responsePayload.success = false;
    responsePayload.error = 'Spreadsheet API Error: ' + err.toString();
  }

  var jsonString = JSON.stringify(responsePayload);

  // If JSONP requested
  if (callback && /^[a-zA-Z0-9_]+$/.test(callback)) {
    var jsonpOutput = ContentService.createTextOutput(callback + '(' + jsonString + ');');
    jsonpOutput.setMimeType(ContentService.MimeType.JAVASCRIPT);
    return jsonpOutput;
  }

  // Standard JSON output
  var output = ContentService.createTextOutput(jsonString);
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Retrieve all published projects from the PROJECTS worksheet
 */
function getPublishedProjectsData(ss) {
  var sheet = ss.getSheetByName('PROJECTS');
  if (!sheet) {
    throw new Error('Worksheet "PROJECTS" not found in spreadsheet.');
  }

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

    // Only process published projects
    var isPublished = String(item.published).trim().toUpperCase() === 'TRUE';
    if (isPublished) {
      item.published = true;
      item.featured = String(item.featured).trim().toUpperCase() === 'TRUE';
      item.sort_order = Number(item.sort_order) || 999;

      // Parse technologies into an array if string
      if (typeof item.technologies === 'string') {
        item.technologies = item.technologies
          .split(',')
          .map(function(t) { return t.trim(); })
          .filter(function(t) { return t.length > 0; });
      } else if (!item.technologies) {
        item.technologies = [];
      }

      // Format created_date cleanly
      if (item.created_date instanceof Date) {
        item.created_date = Utilities.formatDate(item.created_date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }

      projects.push(item);
    }
  }

  // Sort by sort_order ascending
  return projects.sort(function(a, b) {
    return (a.sort_order || 999) - (b.sort_order || 999);
  });
}

/**
 * Retrieve project by slug along with its details and media
 */
function getProjectBySlugData(ss, slug) {
  var projects = getPublishedProjectsData(ss);
  var matched = null;

  for (var i = 0; i < projects.length; i++) {
    if (String(projects[i].slug).toLowerCase() === String(slug).toLowerCase()) {
      matched = projects[i];
      break;
    }
  }

  if (!matched) return null;

  // Retrieve matching details
  var details = [];
  var dSheet = ss.getSheetByName('PROJECT_DETAILS');
  if (dSheet) {
    var dValues = dSheet.getDataRange().getValues();
    if (dValues.length > 1) {
      var dHeaders = dValues[0].map(function(h) { return String(h).trim(); });
      for (var d = 1; d < dValues.length; d++) {
        var dRow = dValues[d];
        var dObj = {};
        for (var dj = 0; dj < dHeaders.length; dj++) {
          dObj[dHeaders[dj]] = dRow[dj];
        }
        if (dObj.project_id === matched.project_id) {
          dObj.sort_order = Number(dObj.sort_order) || 999;
          details.push(dObj);
        }
      }
      details.sort(function(a, b) { return a.sort_order - b.sort_order; });
    }
  }

  // Retrieve matching media
  var media = [];
  var mSheet = ss.getSheetByName('PROJECT_MEDIA');
  if (mSheet) {
    var mValues = mSheet.getDataRange().getValues();
    if (mValues.length > 1) {
      var mHeaders = mValues[0].map(function(h) { return String(h).trim(); });
      for (var m = 1; m < mValues.length; m++) {
        var mRow = mValues[m];
        var mObj = {};
        for (var mj = 0; mj < mHeaders.length; mj++) {
          mObj[mHeaders[mj]] = mRow[mj];
        }
        if (mObj.project_id === matched.project_id) {
          mObj.sort_order = Number(mObj.sort_order) || 999;
          media.push(mObj);
        }
      }
      media.sort(function(a, b) { return a.sort_order - b.sort_order; });
    }
  }

  return {
    project: matched,
    details: details,
    media: media
  };
}

/**
 * Retrieve key-value configuration from SITE_CONFIG
 */
function getSiteConfigData(ss) {
  var sheet = ss.getSheetByName('SITE_CONFIG');
  if (!sheet) return {};

  var values = sheet.getDataRange().getValues();
  var config = {};

  for (var i = 1; i < values.length; i++) {
    var key = String(values[i][0]).trim();
    var val = values[i][1];
    if (key) {
      config[key] = val;
    }
  }

  return config;
}
