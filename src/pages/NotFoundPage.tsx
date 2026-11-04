import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center space-y-8">
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          ERROR 404 // RESOURCE NOT FOUND
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Page Not Located
        </h1>
        <p className="text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
          The route you requested does not exist or may have been unpublished in the Google Sheets database.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="px-6 py-3 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        <Link
          to="/projects"
          className="px-6 py-3 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Browse All Projects</span>
        </Link>
      </div>
    </div>
  );
};
