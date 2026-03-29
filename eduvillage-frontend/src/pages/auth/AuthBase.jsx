import React from 'react';
import { Link } from 'react-router-dom';

const AuthBase = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="/Long_logo.png" 
              alt="EduVillage Logo" 
              className="h-12 mx-auto mb-4"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1 
              className="text-3xl font-bold text-indigo-600 hidden"
              style={{ display: 'none' }}
            >
              EduVillage
            </h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content (Form) */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 EduVillage. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthBase;