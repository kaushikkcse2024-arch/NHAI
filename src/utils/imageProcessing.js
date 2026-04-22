export const processImageReflectivity = (imageElement, canvasElement) => {
  const ctx = canvasElement.getContext('2d', { willReadFrequently: true });
  
  // Set canvas dimensions to match image
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;
  
  // Draw original image
  ctx.drawImage(imageElement, 0, 0);
  
  // Extract pixel data
  const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  const data = imageData.data;
  
  let totalLuminance = 0;
  let reflectivePixels = 0;
  let maxLuminance = 0;
  
  // Process pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // Perceived luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    
    if (luminance > maxLuminance) maxLuminance = luminance;
    // Assuming dark background (asphalt), high luminance relates to retroreflective materials
    // Threshold for 'reflective' in flash night photography demo
    if (luminance > 180) {
      reflectivePixels++;
      totalLuminance += luminance;
      
      // Highlight highly reflective pixels with neon cyan heatmap effect
      // Keep Original R and B slightly, boost Cyan
      data[i] = r * 0.2; // Red down
      data[i+1] = Math.min(255, g + 100); // Green up
      data[i+2] = Math.min(255, b + 150); // Blue up
    } else if (luminance > 120) {
      // Medium reflective
      data[i] = r * 0.5;
      data[i+1] = g * 0.8;
      data[i+2] = b * 1.5;
    } else {
      // Darken non-reflective areas to create visual contrast
      data[i] = r * 0.3;
      data[i+1] = g * 0.3;
      data[i+2] = b * 0.4;
    }
  }
  
  // Put modified data back
  ctx.putImageData(imageData, 0, 0);
  
  // Calculate a mock score (mcd/m2/lx) based on average high-luminance pixels
  // In real life this requires calibration curves, camera EXIF data (shutter speed, ISO)
  // For the hackathon demo, we scale it.
  const averageHighLuminance = reflectivePixels > 0 ? (totalLuminance / reflectivePixels) : 0;
  
  // Base NHAI threshold is around 150 mcd/m2 for white markings
  // Let's map 255 luminance to roughly 300 mcd/m2 max
  const score = Math.round((averageHighLuminance / 255) * 350);
  
  const percentageArea = ((reflectivePixels / (data.length / 4)) * 100).toFixed(1);
  
  return {
    score: score,
    area: percentageArea,
    maxLuminance: Math.round(maxLuminance),
    status: score >= 150 ? 'PASS' : score >= 100 ? 'WARNING' : 'FAIL'
  };
};
