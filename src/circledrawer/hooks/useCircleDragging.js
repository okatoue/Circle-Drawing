import { useState } from 'react';
import { getCircleDisplayProps } from '../components/CircleTypes';

export const useCircleDragging = (circles, setCircles, selectedCircle, setSelectedCircle) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false);

  const getSnappedPosition = (movingCircle, newX, newY) => {
    const { radiusInPixels: movingRadius } = getCircleDisplayProps(movingCircle);
    const snapThreshold = 20;
    
    let snappedX = newX;
    let snappedY = newY;
    let snapped = false;

    for (const otherCircle of circles) {
      if (otherCircle.id === movingCircle.id) continue;
      
      const { radiusInPixels: otherRadius } = getCircleDisplayProps(otherCircle);
      const minDistance = movingRadius + otherRadius;
      
      const dx = newX - otherCircle.x;
      const dy = newY - otherCircle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance + snapThreshold) {
        const angle = Math.atan2(dy, dx);
        snappedX = otherCircle.x + Math.cos(angle) * minDistance;
        snappedY = otherCircle.y + Math.sin(angle) * minDistance;
        snapped = true;
        break;
      }
    }
    
    return { x: snappedX, y: snappedY, snapped };
  };

  const handleMouseDown = (e, circleId) => {
    e.stopPropagation();
    setSelectedCircle(circleId);
    setIsDragging(true);
    
    const svg = e.currentTarget.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    const circle = circles.find(c => c.id === circleId);
    setDragStart({ x: svgP.x - circle.x, y: svgP.y - circle.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    const movingCircle = circles.find(c => c.id === selectedCircle);
    const newX = svgP.x - dragStart.x;
    const newY = svgP.y - dragStart.y;

    const snappedPos = getSnappedPosition(movingCircle, newX, newY);
    setIsSnapped(snappedPos.snapped);

    setCircles(circles.map(circle =>
      circle.id === selectedCircle
        ? { ...circle, x: snappedPos.x, y: snappedPos.y }
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
