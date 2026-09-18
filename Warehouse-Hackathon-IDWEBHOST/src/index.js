import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '24px',
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                fontSize: '20px',
              }}>
                ⚠️
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#F1F5F9' }}>
                  Aplikasi Mengalami Kendala
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Terjadi runtime error saat memuat komponen.
                </p>
              </div>
            </div>
            <div style={{
              backgroundColor: '#0F172A',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#F87171',
              overflowX: 'auto',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap',
            }}>
              {this.state.error?.toString() || 'Unknown error'}
            </div>
            <button
              onClick={() => { window.location.reload(); }}
              style={{
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
