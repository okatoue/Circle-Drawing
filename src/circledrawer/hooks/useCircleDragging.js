import { useState } from 'react';
import { CIRCLE_TYPES, PX_PER_INCH } from '../components/CircleTypes';

export const useCircleDragging = (circles, setCircles, selectedCircle, setSelectedCircle, zoom, panOffset, editingCircle) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false);

  // Get the carrier radius (solid circle only)
  const getCarrierRadius = (circle) => {
    return (circle.diameter / 2) * PX_PER_INCH;
  };

  // Get the Bell OD radius if present
  const getBellRadius = (circle) => {
    if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return 0;
    if (!circle.bellOD || circle.bellOD <= circle.diameter) return 0;
    return (circle.bellOD / 2) * PX_PER_INCH;
  };

  // Get the Spacer OD radius if present
  const getSpacerRadius = (circle) => {
    if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return 0;
    if (!circle.spacerOD || circle.spacerOD <= 0) return 0;
    return (circle.spacerOD / 2) * PX_PER_INCH;
  };

  // COLLISION DETECTION
  const getValidPosition = (movingCircle, newX, newY) => {
    const movingCarrierRadius = getCarrierRadius(movingCircle);
    const movingBellRadius = getBellRadius(movingCircle);
    const movingSpacerRadius = getSpacerRadius(movingCircle);
    
    let validX = newX;
    let validY = newY;
    let collisionDetected = false;

    // Check collision with every other circle
    for (const otherCircle of circles) {
      if (otherCircle.id === movingCircle.id) continue;
      
      // Skip collision checks if moving circle is casing (casing bypasses all restrictions)
if (movingCircle.type === CIRCLE_TYPES.CASING) continue;

// Skip collision checks with casing circles (casing doesn't block other circles)
if (otherCircle.type === CIRCLE_TYPES.CASING) continue;

      const otherCarrierRadius = getCarrierRadius(otherCircle);
      
      // Calculate distance from new position to other circle
      const dx = newX - otherCircle.x;
      const dy = newY - otherCircle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
// Check 1: Carrier-to-Carrier collision (ALWAYS enforced)
      const carrierMinDistance = movingCarrierRadius + otherCarrierRadius + 0.5;
      if (distance < carrierMinDistance) {
        const angle = Math.atan2(dy, dx);
        validX = otherCircle.x + Math.cos(angle) * carrierMinDistance;
        validY = otherCircle.y + Math.sin(angle) * carrierMinDistance;
        collisionDetected = true;
        break;
      }

      // Check 2: Bell OD cannot intrude into other Carrier OD (ALWAYS enforced)
      if (movingBellRadius > 0) {
        const bellMinDistance = movingBellRadius + otherCarrierRadius + 0.5;
        if (distance < bellMinDistance) {
          const angle = Math.atan2(dy, dx);
          validX = otherCircle.x + Math.cos(angle) * bellMinDistance;
          validY = otherCircle.y + Math.sin(angle) * bellMinDistance;
          collisionDetected = true;
          break;
        }
      }

      // Check 3: Spacer collision - ONLY if moving circle does NOT have bypass enabled
      if (movingSpacerRadius > 0 && !movingCircle.bypassBellSpacer) {
        const spacerToCarrierDistance = movingSpacerRadius + otherCarrierRadius + 0.5;
        if (distance < spacerToCarrierDistance) {
          const angle = Math.atan2(dy, dx);
          validX = otherCircle.x + Math.cos(angle) * spacerToCarrierDistance;
          validY = otherCircle.y + Math.sin(angle) * spacerToCarrierDistance;
          collisionDetected = true;
          break;
        }
      }
      
      // Check 4: Other circles' spacers block moving circle (unless moving circle has bypass)
      const otherSpacerRadius = getSpacerRadius(otherCircle);
      if (otherSpacerRadius > 0 && !movingCircle.bypassBellSpacer) {
        const otherSpacerToMovingCarrier = otherSpacerRadius + movingCarrierRadius + 0.5;
        if (distance < otherSpacerToMovingCarrier) {
          const angle = Math.atan2(dy, dx);
          validX = otherCircle.x + Math.cos(angle) * otherSpacerToMovingCarrier;
          validY = otherCircle.y + Math.sin(angle) * otherSpacerToMovingCarrier;
          collisionDetected = true;
          break;
        }
      }
    }
    
    return { x: validX, y: validY, collisionDetected };
  };

  // Recursive collision resolution for complex scenarios
  const getFullyValidPosition = (movingCircle, newX, newY, maxIterations = 10) => {
    let currentX = newX;
    let currentY = newY;
    let hasCollision = true;
    let iterations = 0;
    
    // Keep adjusting position until no collisions or max iterations
    while (hasCollision && iterations < maxIterations) {
      const result = getValidPosition(movingCircle, currentX, currentY);
      currentX = result.x;
      currentY = result.y;
      hasCollision = result.collisionDetected;
      iterations++;
    }
    
    return { x: currentX, y: currentY };
  };

  const handleMouseDown = (e, circleId) => {
    if (editingCircle) return; // Don't drag while editing
    
    e.stopPropagation();
    setSelectedCircle(circleId);
    setIsDragging(true);
    
    const svg = e.currentTarget.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    // Get the transform of the g element
    const gElement = svg.querySelector('g');
    const ctm = gElement.getScreenCTM();
    const svgP = pt.matrixTransform(ctm.inverse());
    
    const circle = circles.find(c => c.id === circleId);
    setDragStart({ x: svgP.x - circle.x, y: svgP.y - circle.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || editingCircle) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    // Get the transform of the g element
    const gElement = svg.querySelector('g');
    const ctm = gElement.getScreenCTM();
    const svgP = pt.matrixTransform(ctm.inverse());

    const movingCircle = circles.find(c => c.id === selectedCircle);
    if (!movingCircle) return;
    
    // Calculate desired new position
    const desiredX = svgP.x - dragStart.x;
    const desiredY = svgP.y - dragStart.y;

    // Get valid position (enforces all collision rules)
    const validPos = getFullyValidPosition(movingCircle, desiredX, desiredY);

    // Update circle position
    setCircles(circles.map(circle =>
      circle.id === selectedCircle
        ? { ...circle, x: validPos.x, y: validPos.y }
        : circle
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsSnapped(false);
  };

  return {
    isDragging,
    isSnapped,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};