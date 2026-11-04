import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Database, Copy, Check, ExternalLink } from 'lucide-react';
import { portfolioApi } from '../services/api';

interface AdminApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRefreshed: () => void;
}

export const AdminApiModal: React.FC<AdminApiModalProps> = ({
  isOpen,
  onClose,
  onDataRefreshed,
}) => {
  const currentStatus = portfolioApi.getStatus();
  const [apiUrl, setApiUrl] = useState(currentStatus.url);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'settings' | 'schema' | 'script'>('settings');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    portfolioApi.setCustomApiUrl(apiUrl);
    onDataRefreshed();
    setTestMessage('Configuration saved! Cache cleared.');
    setTestStatus('success');
  };

  const handleTestConnection = async () => {
    if (!apiUrl.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter a Google Apps Script Web App URL first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Pinging Google Apps Script endpoint...');

    try {
      const separator = apiUrl.includes('?') ? '&' : '?';
      const testUrl = `${apiUrl.trim()}${separator}action=projects&t=${Date.now()}`;
      const res = await fetch(testUrl, { method: 'GET' });

      if (!res.ok) {
        throw new Error(`HTTP error code ${res.status}`);
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        setTestStatus('success');
        setTestMessage(`Success! Verified connection. Retrieved ${json.projects.length} project(s) directly from Google Sheets.`);
        portfolioApi.setCustomApiUrl(apiUrl);
        onDataRefreshed();
      } else {
        throw new Error(json.error || 'Response succeeded but projects array was missing.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Connection test failed: ${err.message || 'CORS or Network Error'}. Ensure Apps Script is deployed as Web App with access set to "Anyone".`);
    }
  };

  const handleClearCache = async () => {
    portfolioApi.clearCache();
    await portfolioApi.getProjects(true);
    await portfolioApi.getSiteConfig(true);
    onDataRefreshed();
    setTestStatus('success');
    setTestMessage('In-memory and local cache refreshed from data source.');
  };

  const handleResetDefault = () => {
    setApiUrl('');
    portfolioApi.setCustomApiUrl('');
    onDataRefreshed();
    setTestStatus('idle');
    setTestMessage('Reset to bundled production seed data.');
  };

  const copyScriptToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const appsScriptSnippet = `/**
 * Google Apps Script for Codeless Technologies Portfolio
 * Deploy as: Web App -> Execute as: Me -> Who has access: Anyone
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'projects';
  var slug = (e && e.parameter && e.parameter.slug) ? e.parameter.slug : '';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var result = { success: false };

  try {
    if (action === 'site') {
      result.site = getSiteConfig(ss);
      result.success = true;
    } else if (action === 'project' && slug) {
      result = getProjectBySlug(ss, slug);
    } else {
      result.projects = getProjects(ss);
      result.success = true;
    }
  } catch (err) {
    result.success = false;
    result.error = err.toString();
  }

  var output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getProjects(ss) {
  var sheet = ss.getSheetByName('PROJECTS');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var projects = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    // Filter only published
    if (String(obj.published).toUpperCase() === 'TRUE') {
      obj.featured = String(obj.featured).toUpperCase() === 'TRUE';
      obj.published = true;
      if (typeof obj.technologies === 'string') {
        obj.technologies = obj.technologies.split(',').map(function(t) { return t.trim(); });
      }
      projects.push(obj);
    }
  }
  return projects.sort(function(a, b) { return (a.sort_order || 999) - (b.sort_order || 999); });
}

function getSiteConfig(ss) {
  var sheet = ss.getSheetByName('SITE_CONFIG');
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    var key = data[i][0];
    var val = data[i][1];
    if (key) config[key] = val;
  }
  return config;
}

function getProjectBySlug(ss, slug) {
  var allProjects = getProjects(ss);
  var matched = null;
  for (var i = 0; i < allProjects.length; i++) {
    if (String(allProjects[i].slug).toLowerCase() === String(slug).toLowerCase()) {
      matched = allProjects[i];
      break;
    }
  }
  if (!matched) return { success: false, error: 'Project not found' };

  var details = [];
  var dSheet = ss.getSheetByName('PROJECT_DETAILS');
  if (dSheet) {
    var dData = dSheet.getDataRange().getValues();
    var dHeaders = dData[0];
    for (var d = 1; d < dData.length; d++) {
      var dRow = dData[d];
      var dObj = {};
      for (var dj = 0; dj < dHeaders.length; dj++) {
        dObj[dHeaders[dj]] = dRow[dj];
      }
      if (dObj.project_id === matched.project_id) details.push(dObj);
    }
  }

  var media = [];
  var mSheet = ss.getSheetByName('PROJECT_MEDIA');
  if (mSheet) {
    var mData = mSheet.getDataRange().getValues();
    var mHeaders = mData[0];
    for (var m = 1; m < mData.length; m++) {
      var mRow = mData[m];
      var mObj = {};
      for (var mj = 0; mj < mHeaders.length; mj++) {
        mObj[mHeaders[mj]] = mRow[mj];
      }
      if (mObj.project_id === matched.project_id) media.push(mObj);
    }
  }

  return { success: true, project: matched, details: details, media: media };
}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-base font-bold text-white">
                Google Sheets Integration & Admin Sync
              </h2>
              <p className="text-xs text-neutral-400">
                Single source of truth for portfolio projects and metadata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-900/50 text-xs">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Google Sheets Schema (4 Tabs)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'script'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Google Apps Script Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Data Source: {currentStatus.isConfigured ? 'Live Google Apps Script' : 'Bundled Seed Dataset'}</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {currentStatus.isConfigured 
                      ? `Connected to: ${currentStatus.url}`
                      : 'Running with rich bundled projects for Codeless Technologies. You can connect your live Google Sheets Web App below.'}
                  </p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Cache</span>
                </button>
              </div>

              {/* Input for Google Apps Script Web App URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono text-xs"
                />
                <p className="text-xs text-neutral-400">
                  Paste the Web App URL generated when deploying your Google Apps Script project.
                </p>
              </div>

              {/* Test / Save buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors disabled:opacity-50"
                >
                  {testStatus === 'testing' ? 'Testing...' : 'Test Live Connection'}
                </button>

                <button
                  onClick={handleSaveUrl}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                >
                  Save URL
                </button>

                <button
                  onClick={handleResetDefault}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors ml-auto"
                >
                  Reset to Seed Data
                </button>
              </div>

              {/* Test Feedback */}
              {testMessage && (
                <div className={`p-3 rounded-md text-xs flex items-start gap-2.5 ${
                  testStatus === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-800/80 text-emerald-200'
                    : testStatus === 'error'
                    ? 'bg-rose-950/40 border border-rose-800/80 text-rose-200'
                    : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {testStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : testStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  ) : (
                    <RefreshCw className="w-4 h-4 shrink-0 animate-spin mt-0.5" />
                  )}
                  <span>{testMessage}</span>
                </div>
              )}

              {/* Quick Info Box */}
              <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs text-neutral-400">
                <h4 className="font-semibold text-neutral-200">How No-Code Editing Works:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-neutral-400">
                  <li>Edit any project, add a new row, or set <code>published = FALSE</code> in your Google Sheet.</li>
                  <li>Google Apps Script automatically exposes the new data at <code>action=projects</code>.</li>
                  <li>The portfolio refreshes its cache every 5 minutes (or immediately via the "Refresh Cache" button) without needing a GitHub deployment!</li>
                </ol>
              </div>

            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-6 text-xs text-neutral-300">
              <p className="text-neutral-400">
                Create a single Google Spreadsheet with the following 4 worksheets (exact names and column headers):
              </p>

              {/* Sheet 1: PROJECTS */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Worksheet 1: PROJECTS</h4>
                <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 font-mono text-[11px] overflow-x-auto">
                  project_id, slug, project_name, tagline, short_description, full_description, category, technologies, thumbnail_image, cover_image, live_url, github_url, status, featured, published, created_date, sort_order
                </div>
              </div>

              {/* Sheet 2: PROJECT_DETAILS */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Worksheet 2: PROJECT_DETAILS</h4>
                <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 font-mono text-[11px] overflow-x-auto">
                  project_id, section_type, heading, content, sort_order
                </div>
                <p className="text-neutral-400">
                  Supported <code>section_type</code>: <code>overview</code>, <code>problem</code>, <code>solution</code>, <code>features</code> (JSON array or bullets), <code>architecture</code>, <code>outcomes</code>.
                </p>
              </div>

              {/* Sheet 3: PROJECT_MEDIA */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Worksheet 3: PROJECT_MEDIA</h4>
                <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 font-mono text-[11px] overflow-x-auto">
                  media_id, project_id, image_url, caption, media_type, sort_order
                </div>
                <p className="text-neutral-400">
                  Google Drive links (e.g. <code>https://drive.google.com/file/d/...</code>) are automatically parsed and displayed.
                </p>
              </div>

              {/* Sheet 4: SITE_CONFIG */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Worksheet 4: SITE_CONFIG</h4>
                <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 font-mono text-[11px] overflow-x-auto">
                  key, value
                </div>
                <p className="text-neutral-400">
                  Keys: <code>company_name</code>, <code>company_tagline</code>, <code>company_description</code>, <code>website</code>, <code>email</code>, <code>phone</code>, <code>whatsapp</code>, <code>linkedin</code>, <code>contact_cta_text</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  In your Google Sheet, click <strong>Extensions → Apps Script</strong>, paste this code, and click <strong>Deploy → New deployment → Web App</strong>.
                </p>
                <button
                  onClick={() => copyScriptToClipboard(appsScriptSnippet)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Apps Script'}</span>
                </button>
              </div>

              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-md font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-96">
                {appsScriptSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>Codeless Technologies Portfolio v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-neutral-200 hover:text-white bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
