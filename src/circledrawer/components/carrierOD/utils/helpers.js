
export const svgToScreen = (svgX, svgY, zoom, panOffset) => {
  const canvas = document.querySelector('.drawing-canvas');
  if (!canvas) return { x: svgX, y: svgY };
  
  const rect = canvas.getBoundingClientRect();
  const screenX = rect.left + (svgX * zoom) + panOffset.x;
  const screenY = rect.top + (svgY * zoom) + panOffset.y;
  
  return { x: screenX, y: screenY };
};

/**
 * Generate spacer label text based on configuration
 */
export const getSpacerLabelText = (circle) => {
  if (circle.selectedSpacer && circle.autoSpacerEnabled) {
    return `${circle.selectedSpacer.spacerName} ø${circle.spacerOD.toFixed(2)}"`;
  } else if (circle.spacerOD) {
    return `Spacer ø${circle.spacerOD.toFixed(2)}"`;
  }
  return '';
};

/**
 * Generate spacer tooltip text with full configuration details
 */
export const getSpacerTooltip = (circle) => {
  if (!circle.selectedSpacer) return '';
  const s = circle.selectedSpacer;
  let tooltip = `${s.spacerName}\nRunner Height: ${s.runnerHeight}"`;
  if (s.bellClearance !== null) {
    tooltip += `\nBell Clearance: ${s.bellClearance.toFixed(2)}"`;
  }
  if (s.configuration && s.configuration.length > 0) {
    const configStr = s.configuration.map(c => `${c.quantity}×${c.type}`).join(', ');
    tooltip += `\nConfig: ${configStr}`;
  }
  return tooltip;
};

/**
 * Generate SVG arc path string for runner bands
 */
export const generateArcPath = (cx, cy, radius, startAngle, endAngle) => {
  const start = {
    x: cx + radius * Math.cos(startAngle),
    y: cy + radius * Math.sin(startAngle)
  };
  const end = {
    x: cx + radius * Math.cos(endAngle),
    y: cy + radius * Math.sin(endAngle)
  };
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};