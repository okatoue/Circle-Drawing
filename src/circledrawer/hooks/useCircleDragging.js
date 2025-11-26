import { useState } from 'react';
import { CIRCLE_TYPES, PX_PER_INCH } from '../components/CircleTypes';

export const useCircleDragging = (
  circles,
  setCircles,
  selectedCircle,
  setSelectedCircle,
  zoom,
  panOffset,
  editingCircle
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false);

  const EPSILON = 0.5;
  const MAX_ITERATIONS = 20;
  const MIN_PUSH_THRESHOLD = 0.1;
  const RELAX_FACTOR = 0.7;
  const MAX_STRETCH_FACTOR = 1.5;
  const MAX_EXTRA_PIXELS = 2;

  const getCarrierRadius = (circle) => (circle.diameter / 2) * PX_PER_INCH;

  const getBellRadius = (circle) => {
    if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return 0;
    if (!circle.bellOD || circle.bellOD <= circle.diameter) return 0;
    return (circle.bellOD / 2) * PX_PER_INCH;
  };

  const getSpacerRadius = (circle) => {
    if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return 0;
    if (!circle.spacerOD || circle.spacerOD <= 0) return 0;
    return (circle.spacerOD / 2) * PX_PER_INCH;
  };

  const getMinDistance = (movingCircle, otherCircle) => {
    const movingCarrier = getCarrierRadius(movingCircle);
    const movingBell = getBellRadius(movingCircle);
    const movingSpacerRadius = getSpacerRadius(movingCircle);

    const otherCarrier = getCarrierRadius(otherCircle);
    const otherBell = getBellRadius(otherCircle);
    const otherSpacerRadius = getSpacerRadius(otherCircle);

    const movingBypasses = movingCircle.bypassBellSpacer === true;

    let minDist = movingCarrier + otherCarrier;

    if (movingBell > 0) {
      minDist = Math.max(minDist, movingBell + otherCarrier);
    }

    if (otherBell > 0) {
      minDist = Math.max(minDist, movingCarrier + otherBell);
    }

    if (!movingBypasses) {
      if (movingSpacerRadius > 0) {
        minDist = Math.max(minDist, movingSpacerRadius + otherCarrier);
      }

      if (otherSpacerRadius > 0) {
        minDist = Math.max(minDist, movingCarrier + otherSpacerRadius);
      }
    }

    return minDist;
  };

  const computeOverlaps = (movingCircle, x, y) => {
    let pushX = 0;
    let pushY = 0;
    let maxPenetration = 0;
    let overlapCount = 0;

    for (const other of circles) {
      if (other.id === movingCircle.id) continue;

      const minDist = getMinDistance(movingCircle, other);

      const dx = x - other.x;
      const dy = y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const penetration = minDist - dist;

      if (penetration > EPSILON) {
        overlapCount++;
        if (penetration > maxPenetration) {
          maxPenetration = penetration;
        }

        let normalX;
        let normalY;
        if (dist > 0.001) {
          normalX = dx / dist;
          normalY = dy / dist;
        } else {
          normalX = 1;
          normalY = 0;
        }

        pushX += normalX * penetration;
        pushY += normalY * penetration;
      }
    }

    if (overlapCount > 0) {
      pushX /= overlapCount;
      pushY /= overlapCount;

      const mag = Math.hypot(pushX, pushY);
      if (mag > 0.0001) {
        pushX = (pushX / mag) * maxPenetration;
        pushY = (pushY / mag) * maxPenetration;
      } else {
        pushX = 0;
        pushY = 0;
      }
    }

    return { pushX, pushY, maxPenetration, overlapCount };
  };

  const getValidPosition = (movingCircle, currentX, currentY, targetX, targetY) => {
    let newX = targetX;
    let newY = targetY;

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const { pushX, pushY, maxPenetration, overlapCount } = computeOverlaps(
        movingCircle,
        newX,
        newY
      );

      if (overlapCount === 0 || maxPenetration <= EPSILON) {
        break;
      }

      const pushMagnitude = Math.hypot(pushX, pushY);
      if (pushMagnitude < MIN_PUSH_THRESHOLD) {
        break;
      }

      newX += pushX * RELAX_FACTOR;
      newY += pushY * RELAX_FACTOR;
    }

    const finalCheck = computeOverlaps(movingCircle, newX, newY);
    if (finalCheck.maxPenetration > EPSILON * 2) {
      return { x: currentX, y: currentY };
    }

    const moveToTargetX = targetX - currentX;
    const moveToTargetY = targetY - currentY;
    const moveToCandidateX = newX - currentX;
    const moveToCandidateY = newY - currentY;

    const lenToTarget = Math.hypot(moveToTargetX, moveToTargetY);
    const lenToCandidate = Math.hypot(moveToCandidateX, moveToCandidateY);

    if (lenToTarget < 1e-6) {
      return { x: currentX, y: currentY };
    }

    const dot = moveToTargetX * moveToCandidateX + moveToTargetY * moveToCandidateY;

    if (dot <= 0) {
      return { x: currentX, y: currentY };
    }

    if (lenToCandidate > lenToTarget * MAX_STRETCH_FACTOR + MAX_EXTRA_PIXELS) {
      return { x: currentX, y: currentY };
    }

    return { x: newX, y: newY };
  };

  const handleMouseDown = (e, circleId) => {
    if (editingCircle) return;

    e.stopPropagation();
    setSelectedCircle(circleId);
    setIsDragging(true);

    const svg = e.currentTarget.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const gElement = svg.querySelector('g');
    const ctm = gElement.getScreenCTM();
    const svgP = pt.matrixTransform(ctm.inverse());

    const circle = circles.find((c) => c.id === circleId);
    setDragStart({ x: svgP.x - circle.x, y: svgP.y - circle.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || editingCircle) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const gElement = svg.querySelector('g');
    const ctm = gElement.getScreenCTM();
    const svgP = pt.matrixTransform(ctm.inverse());

    const movingCircle = circles.find((c) => c.id === selectedCircle);
    if (!movingCircle) return;

    const targetX = svgP.x - dragStart.x;
    const targetY = svgP.y - dragStart.y;

    const validPos = getValidPosition(
      movingCircle,
      movingCircle.x,
      movingCircle.y,
      targetX,
      targetY
    );

    setCircles(
      circles.map((circle) =>
        circle.id === selectedCircle
          ? { ...circle, x: validPos.x, y: validPos.y }
          : circle
      )
    );
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
