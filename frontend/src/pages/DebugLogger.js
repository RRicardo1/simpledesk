import React, { useEffect } from 'react';

const DebugLogger = () => {
  console.log('🔍 DebugLogger component rendering at:', new Date().toISOString());

  useEffect(() => {
    console.log('🔍 DebugLogger useEffect mounting');
    
    // Log all network requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      console.log('🌐 Network request:', args[0]);
      return originalFetch.apply(this, args)
        .then(response => {
          console.log('🌐 Network response:', args[0], response.status);
          return response;
        })
        .catch(error => {
          console.log('🌐 Network error:', args[0], error);
          throw error;
        });
    };

    // Log all console errors
    const originalError = console.error;
    console.error = function(...args) {
      console.log('❌ Console error detected:', args);
      originalError.apply(console, args);
    };

    // Log all unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.log('❌ Unhandled promise rejection:', event.reason);
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Log page visibility changes
    const handleVisibilityChange = () => {
      console.log('👁️ Page visibility changed:', document.visibilityState);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Log beforeunload events
    const handleBeforeUnload = (event) => {
      console.log('🚪 Page about to unload:', event);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Log any custom navigation events
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      console.log('📍 History pushState:', args);
      return originalPushState.apply(this, args);
    };
    
    window.history.replaceState = function(...args) {
      console.log('📍 History replaceState:', args);
      return originalReplaceState.apply(this, args);
    };

    // Cleanup function
    return () => {
      console.log('🔍 DebugLogger useEffect cleanup');
      window.fetch = originalFetch;
      console.error = originalError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return (
    <div style={{ padding: '32px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#000' }}>
        🔍 Debug Logger Component
      </h1>
      <div style={{ backgroundColor: '#f0f0f0', padding: '16px', marginBottom: '16px' }}>
        <p><strong>Component Status:</strong> Mounted and logging</p>
        <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Location:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</p>
      </div>
      <div style={{ backgroundColor: '#fff3cd', padding: '16px', border: '1px solid #ffeaa7' }}>
        <p><strong>⚠️ Instructions:</strong></p>
        <ul>
          <li>Open browser DevTools Console</li>
          <li>Watch for any network requests, errors, or events</li>
          <li>Look for patterns in the logs when refresh occurs</li>
          <li>Note the timing and frequency of any logs</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugLogger;