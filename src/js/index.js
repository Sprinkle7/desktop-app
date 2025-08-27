import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error('Failed to render React app:', error);
    }
  }
});

// Also try immediate mounting as fallback
if (document.readyState !== 'loading') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error('Immediate mounting failed:', error);
    }
  }
}
