import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Certificate Generator Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '24px' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.5' }}>
              We encountered an error while generating your certificate. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary