import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CalculatorHub ErrorBoundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 16px' }}>
          <div className="card" style={{ textAlign: 'center', borderColor: 'var(--warning)', padding: '36px 24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--warning-soft)',
              color: 'var(--warning)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Calculator Temporarily Unavailable
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              An unexpected error occurred while rendering this tool. You can reset to clear state and retry.
            </p>

            <button
              onClick={this.handleReset}
              className="btn-primary"
              style={{ gap: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Reset Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
