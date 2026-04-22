import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Aperture, RefreshCw, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react';
import { processImageReflectivity } from '../utils/imageProcessing';
import { jsPDF } from 'jspdf';

export default function ImageAnalyzer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setResults(null); // Reset previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = () => {
    if (!imageSrc || !imageRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    // Simulate slight delay for dramatic processing effect
    setTimeout(() => {
      try {
        const analysisResults = processImageReflectivity(imageRef.current, canvasRef.current);
        setResults(analysisResults);
      } catch (err) {
        console.error("Error processing image:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 800);
  };

  const downloadPDFReport = () => {
    if (!results) return;
    setIsDownloading(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(6, 182, 212); // Accent cyan
        doc.text("LuminaTrack Assessment Report", 20, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
        
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Evaluation Results", 20, 50);
        
        doc.setFontSize(14);
        doc.text(`Estimated Coefficient: ${results.score} mcd/m2/lx`, 20, 65);
        
        let statusColor = [0, 0, 0];
        if (results.status === 'PASS') statusColor = [16, 185, 129];
        else if (results.status === 'WARNING') statusColor = [245, 158, 11];
        else statusColor = [239, 68, 68];
        
        doc.text("Compliance Status:", 20, 80);
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(results.status, 65, 80);
        
        doc.setTextColor(0, 0, 0);
        doc.text(`Highly Reflective Area Coverage: ${results.area}%`, 20, 95);
        doc.text(`Peak Pixel Luminance: ${results.maxLuminance}/255`, 20, 110);
        
        if (canvasRef.current && imageSrc) {
          doc.addPage();
          doc.setFontSize(16);
          doc.text("Heatmap Visualized Source", 20, 20);
          const canvasDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
          doc.addImage(canvasDataUrl, 'JPEG', 20, 30, 170, Math.min(170 * (canvasRef.current.height / canvasRef.current.width), 240));
        }

        doc.save("LuminaTrack-Report.pdf");
      } catch (err) {
        console.error("Failed to generate PDF", err);
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Retro-Reflectivity Analyzer</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload an image taken with flash to evaluate road marking visibility.</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Input Panel */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Upload Dropzone */}
          <div className="glass-panel" style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: imageSrc ? 'var(--accent-teal)' : 'var(--panel-border)',
            transition: 'all 0.3s ease'
          }}>
            {!imageSrc ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', color: 'var(--accent-cyan)' }}>
                  <UploadCloud size={40} />
                </div>
                <h3 style={{ margin: 0 }}>Upload Image</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>JPG, PNG or WEBP formats</p>
                <label className="btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>
                  Browse Files
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img 
                  ref={imageRef}
                  src={imageSrc} 
                  alt="Uploaded" 
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <label className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <button 
                    className="btn-primary flex-center" 
                    onClick={runAnalysis}
                    disabled={isProcessing}
                    style={{ gap: '8px', padding: '8px 16px', fontSize: '14px' }}
                  >
                    {isProcessing ? <RefreshCw className="spin" size={16} /> : <Aperture size={16} />}
                    {isProcessing ? 'Processing Algorithm...' : 'Run Analysis'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          {!imageSrc && (
             <div className="glass-panel" style={{ padding: '1.5rem' }}>
             <h4 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Capture Guidelines</h4>
             <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
               <li>Take photo at night or in low light conditions</li>
               <li>Ensure camera flash is forced ON</li>
               <li>Hold the camera at steering wheel height (~1.2m)</li>
               <li>Point directly ahead at the road markings</li>
               <li>Avoid external bright lights (headlights) in frame</li>
             </ul>
           </div>
          )}
        </div>

        {/* Right Column: Output Panel */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Canvas Viewport */}
          <div className="glass-card" style={{ padding: '1.5rem', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Reflectivity Heatmap View</span>
              {results && <span style={{ fontSize: '12px', background: 'var(--accent-glow)', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>Processed Output</span>}
            </h3>
            
            <div style={{ 
              flex: 1, 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {!imageSrc && !results && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No image loaded. Please upload an image to begin.</p>
              )}
              
              {/* The canvas is always present but hidden until results exist */}
              <canvas 
                ref={canvasRef} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px',
                  display: results ? 'block' : 'none',
                  borderRadius: '6px'
                }} 
              />
              
              {isProcessing && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 15, 25, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', zIndex: 10 }}>
                  <RefreshCw className="spin" size={32} color="var(--accent-cyan)" />
                  <span className="text-gradient" style={{ fontWeight: '600' }}>Running Computer Vision Analysis...</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {results && (
            <div className="glass-panel" style={{ padding: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-secondary)', margin: 0 }}>Estimated Coefficient</h4>
                  <h2 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    {results.score} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>mcd/m²/lx</span>
                  </h2>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  {results.status === 'PASS' && (
                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={28} />
                      <h3 style={{ margin: 0 }}>COMPLIANT</h3>
                    </div>
                  )}
                  {results.status === 'WARNING' && (
                    <div style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={28} />
                      <h3 style={{ margin: 0 }}>MARGINAL</h3>
                    </div>
                  )}
                  {results.status === 'FAIL' && (
                    <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <XCircle size={28} />
                      <h3 style={{ margin: 0 }}>FAILED</h3>
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Base NHAI Standard: 150</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Highly Reflective Area Coverage:</span>
                  <span style={{ fontWeight: '600' }}>{results.area}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Peak Pixel Luminance:</span>
                  <span style={{ fontWeight: '600' }}>{results.maxLuminance}/255</span>
                </div>
                
                <button 
                  className="btn-secondary flex-center" 
                  onClick={downloadPDFReport}
                  disabled={isDownloading}
                  style={{ marginTop: '0.5rem', gap: '8px' }}
                >
                  {isDownloading ? <RefreshCw className="spin" size={16} /> : <Download size={16} />}
                  {isDownloading ? 'Generating...' : 'Download Full Report (PDF)'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
{/* add basic spin animation since not in css yet */}
<style dangerouslySetInnerHTML={{__html: `
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`}} />
    </div>
  );
}
