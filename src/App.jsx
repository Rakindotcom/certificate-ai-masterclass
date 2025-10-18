import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [fontSize, setFontSize] = useState(42)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const certificateRef = useRef(null)
  const nameRef = useRef(null)

  const handleGenerateCertificate = () => {
    if (name.trim()) {
      setImageLoading(true)
      setImageError(false)
      setShowCertificate(true)
    }
  }

  const handleDownload = async () => {
    if (certificateRef.current) {
      setIsGenerating(true)
      try {
        // Wait a bit to ensure all fonts and images are fully loaded
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const canvas = await html2canvas(certificateRef.current, {
          scale: 4, // Increased from 2 to 4 for Full HD quality
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
          foreignObjectRendering: true
        })
        
        const link = document.createElement('a')
        link.download = `certificate-${name.replace(/\s+/g, '-').toLowerCase()}.png`
        link.href = canvas.toDataURL('image/png', 1.0) // Maximum quality
        link.click()
      } catch (error) {
        console.error('Error generating certificate:', error)
        alert('Failed to generate certificate. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleReset = () => {
    setName('')
    setShowCertificate(false)
    setFontSize(42)
    setImageLoading(true)
    setImageError(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Dynamically adjust font size to ensure text never breaks
  useEffect(() => {
    if (showCertificate && nameRef.current && certificateRef.current) {
      const adjustFontSize = () => {
        const nameElement = nameRef.current
        const certificateElement = certificateRef.current
        
        // Get the available width (80% of certificate width)
        const availableWidth = certificateElement.offsetWidth * 0.8
        
        let currentFontSize = 42
        nameElement.style.fontSize = `${currentFontSize}px`
        
        // Keep reducing font size until text fits in one line
        while (nameElement.scrollWidth > availableWidth && currentFontSize > 16) {
          currentFontSize -= 2
          nameElement.style.fontSize = `${currentFontSize}px`
        }
        
        setFontSize(currentFontSize)
      }
      
      // Small delay to ensure elements are rendered
      setTimeout(adjustFontSize, 100)
    }
  }, [showCertificate, name])

  if (showCertificate) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            ref={certificateRef}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              fontFamily: 'Poppins, sans-serif',
              maxWidth: '600px',
              width: '100%'
            }}
            role="img"
            aria-label={`Certificate for ${name}`}
          >
            {/* Loading Spinner */}
            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                  Loading certificate...
                </span>
              </div>
            )}

            {/* Error State */}
            {imageError && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid #ef4444',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                color: '#ef4444'
              }}>
                <p>Failed to load certificate template</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            <img 
              src="/certificate.webp" 
              alt="Certificate Template" 
              style={{ 
                width: '100%', 
                height: 'auto',
                opacity: imageLoading ? 0.3 : 1,
                transition: 'opacity 0.3s ease'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="eager"
            />
            <div style={{
              position: 'absolute',
              top: '52%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              width: '100%'
            }}>
              <div 
                ref={nameRef}
                className="signature-name"
                style={{
                  textAlign: 'center',
                  fontSize: `${fontSize}px`,
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  maxWidth: '80%'
                }}
                role="text"
                aria-label={`Certificate recipient name: ${name}`}
              >
                {name}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleDownload}
              disabled={isGenerating || imageLoading || imageError}
              style={{
                backgroundColor: (isGenerating || imageLoading || imageError) ? '#9ca3af' : '#16a34a',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: (isGenerating || imageLoading || imageError) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={isGenerating ? 'Generating certificate, please wait' : 'Download certificate as PNG file'}
              aria-describedby="download-description"
            >
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </button>
            <button
              onClick={handleReset}
              style={{
                backgroundColor: '#4b5563',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label="Create a new certificate with different name"
            >
              Create Another
            </button>
          </div>
          <div id="download-description" style={{ 
            marginTop: '12px', 
            color: '#64748b', 
            fontSize: '14px', 
            textAlign: 'center' 
          }}>
            Downloads as high-quality PNG file
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
      display: 'flex',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="hero-container">
        {/* Hero Image */}
        <div className="hero-image">
          <img 
            src="/hero.jpg" 
            alt="Certificate Hero" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>

        {/* Form Section */}
        <div className="hero-form">
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '12px',
                  fontFamily: 'Anek Bangla, sans-serif',
                  lineHeight: '1.2'
                }}>
                  AI ফর স্মার্ট প্রোডাক্টিভিটি
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '20px', marginBottom: '8px' }}>Certificate Generator</p>
                <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.5' }}>
                  Generate beautiful, personalized certificates instantly
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="name-input"
                  style={{ 
                    display: 'block', 
                    color: '#e2e8f0', 
                    textAlign: 'left', 
                    fontWeight: '500',
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}
                >
                  Enter your name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCertificate()}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #667eea'
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                  aria-describedby="name-help"
                  aria-required="true"
                  autoComplete="name"
                />
                <div id="name-help" style={{ 
                  marginTop: '4px', 
                  color: '#94a3b8', 
                  fontSize: '12px' 
                }}>
                  This will appear on your certificate
                </div>
              </div>

              <button
                onClick={handleGenerateCertificate}
                disabled={!name.trim()}
                style={{
                  width: '100%',
                  background: name.trim() ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#374151',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  marginBottom: '16px',
                  boxShadow: name.trim() ? '0 8px 25px rgba(102, 126, 234, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (name.trim()) {
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  if (name.trim()) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }
                }}
                aria-label="Generate personalized certificate"
                aria-describedby="generate-help"
              >
                Generate Certificate
              </button>

              <div id="generate-help" style={{ color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                Enter your name to generate a personalized certificate
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
