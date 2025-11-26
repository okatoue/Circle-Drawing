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

  // ============================================================
  // CONFIGURATION
  // ============================================================

  // Tolerance for considering positions "valid" (pixels)
  // Increase if circles feel too sticky, decrease if they overlap visually
  const EPSILON = 0.5;

  // Max iterations for relaxation algorithm
  // Increase if circles don't settle properly in complex arrangements
  const MAX_ITERATIONS = 20;

  // Minimum push magnitude to continue iterating
  // Helps detect convergence and prevents infinite loops
  const MIN_PUSH_THRESHOLD = 0.1;

  // How aggressively we apply the computed push in each iteration.
  // 1.0 = full push (more "springy"), 0.3–0.7 = softer / more stable.
  const RELAX_FACTOR = 0.7;

  // Gating parameters to avoid "magnet repulsion"
  // We don't allow the solver to move the circle opposite your drag,
  // or to move *much* farther than the mouse actually moved.
  const MAX_STRETCH_FACTOR = 1.5; // allowed candidate distance vs mouse distance
  const MAX_EXTRA_PIXELS = 2;     // small constant cushion in pixels

  // ============================================================
  // RADIUS CALCULATIONS
  // ============================================================

  const getCarrierRadius = (circle) => {
    return (circle.diameter / 2) * PX_PER_INCH;
  };

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

  /**
   * Calculate the minimum allowed center-to-center distance between two circles.
   *
   * COLLISION RULES:
   * - Carrier OD vs Carrier OD: CANNOT overlap (always enforced)
   * - Bell OD vs Carrier OD: CANNOT overlap (always enforced)
   * - Spacer OD vs Carrier OD: protected, unless the MOVING circle has bypass enabled
   * - Spacer vs Spacer: CAN overlap (staggered positioning)
   * - Spacer vs Bell: CAN overlap
   * - Bell vs Bell: CAN overlap
   */
  const getMinDistance = (movingCircle, otherCircle) => {
  const movingCarrier = getCarrierRadius(movingCircle);
  const movingBell = getBellRadius(movingCircle);
  const movingSpacerRadius = getSpacerRadius(movingCircle);

  const otherCarrier = getCarrierRadius(otherCircle);
  const otherBell = getBellRadius(otherCircle);
  const otherSpacerRadius = getSpacerRadius(otherCircle);

  // Bypass only applies to the moving circle entering another spacer's territory
  const movingBypasses = movingCircle.bypassBellSpacer === true;

  // Start with carrier-to-carrier (ALWAYS applies - never bypass this)
  let minDist = movingCarrier + otherCarrier;

  // === BELL COLLISION RULES ===
  // Bell collisions are ALWAYS enforced (bypass does NOT apply)
  if (movingBell > 0) {
    minDist = Math.max(minDist, movingBell + otherCarrier);
  }

  if (otherBell > 0) {
    minDist = Math.max(minDist, movingCarrier + otherBell);
  }

  // === SPACER COLLISION RULES ===
  // Moving circle's Spacer always protects its own carrier
  if (movingSpacerRadius > 0) {
    minDist = Math.max(minDist, movingSpacerRadius + otherCarrier);
  }

  // Moving circle can opt to ignore other spacers when bypass is enabled
  if (otherSpacerRadius > 0 && !movingBypasses) {
    minDist = Math.max(minDist, movingCarrier + otherSpacerRadius);
  }

  // We intentionally do NOT check:
  // - Bell vs Bell (can overlap)
  // - Spacer vs Spacer (can overlap - staggered positioning)
  // - Bell vs Spacer (can overlap)

  return minDist;
};

  // ============================================================
  // CORE COLLISION ALGORITHM: ITERATIVE POSITION RELAXATION
  // ============================================================

  /**
   * Compute all overlaps at a given position and return the push-out vector.
   *
   * CHANGED:
   * - Instead of summing raw penetration vectors (which can explode in magnitude),
   *   we average the normals and scale by the *maximum* penetration.
   * - This gives a single, "soft" push direction out of all overlaps at once.
   */
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

      // Penetration depth (positive means overlapping)
      const penetration = minDist - dist;

      if (penetration > EPSILON) {
        overlapCount++;
        if (penetration > maxPenetration) {
          maxPenetration = penetration;
        }

        // Normal vector FROM other circle TO test position (escape direction)
        let normalX, normalY;
        if (dist > 0.001) {
          normalX = dx / dist;
          normalY = dy / dist;
        } else {
          // Circles are coincident - arbitrary direction
          normalX = 1;
          normalY = 0;
        }

        // Accumulate normals weighted by penetration
        pushX += normalX * penetration;
        pushY += normalY * penetration;
      }
    }

    if (overlapCount > 0) {
      // Average the normals
      pushX /= overlapCount;
      pushY /= overlapCount;

      // Normalize and scale by max penetration
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

  /**
   * MAIN COLLISION RESOLUTION FUNCTION
   *
   * Takes a target position and returns the nearest valid (non-overlapping) position.
   * Uses iterative relaxation - each iteration pushes the position out of all overlaps.
   *
   * NEW BEHAVIOR:
   * - Uses a softened, averaged push vector (less "explosive").
   * - After resolving collisions, we **gate** the move:
   *   - If the solver wants to move opposite to the mouse direction, we treat it as BLOCKED
   *     and keep the circle where it was -> feels like a hard stop instead of repulsion.
   */
  const getValidPosition = (movingCircle, currentX, currentY, targetX, targetY) => {
    let newX = targetX;
    let newY = targetY;

    // Iteratively relax position until no overlaps or we stop making progress
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const { pushX, pushY, maxPenetration, overlapCount } = computeOverlaps(
        movingCircle,
        newX,
        newY
      );

      // No overlaps (or tiny) -> we're good
      if (overlapCount === 0 || maxPenetration <= EPSILON) {
        break;
      }

      const pushMagnitude = Math.hypot(pushX, pushY);
      if (pushMagnitude < MIN_PUSH_THRESHOLD) {
        // Push is too small to matter -> stop iterating
        break;
      }

      // Apply softened push (relaxation)
      newX += pushX * RELAX_FACTOR;
      newY += pushY * RELAX_FACTOR;
    }

    // Final validation: if still overlapping after all iterations, fall back to current position
    const finalCheck = computeOverlaps(movingCircle, newX, newY);
    if (finalCheck.maxPenetration > EPSILON * 2) {
      return { x: currentX, y: currentY };
    }

    // ============================================================
    // GATING: DON'T MOVE "AGAINST" THE MOUSE OR TELEPORT
    // ============================================================

    const moveToTargetX = targetX - currentX;
    const moveToTargetY = targetY - currentY;
    const moveToCandidateX = newX - currentX;
    const moveToCandidateY = newY - currentY;

    const lenToTarget = Math.hypot(moveToTargetX, moveToTargetY);
    const lenToCandidate = Math.hypot(moveToCandidateX, moveToCandidateY);

    // If mouse hasn't really moved, don't move the circle
    if (lenToTarget < 1e-6) {
      return { x: currentX, y: currentY };
    }

    // Dot product tells us if candidate is roughly in the same direction as the drag
    const dot =
      moveToTargetX * moveToCandidateX + moveToTargetY * moveToCandidateY;

    // If dot <= 0, the solver wants to move opposite your drag -> feel like "repulsion".
    // Instead, we treat that as "blocked" and keep the circle where it was.
    if (dot <= 0) {
      return { x: currentX, y: currentY };
    }

    // Also clamp how far the solver is allowed to move compared to the mouse.
    // This prevents big teleports when deeply intersecting a cluster.
    if (lenToCandidate > lenToTarget * MAX_STRETCH_FACTOR + MAX_EXTRA_PIXELS) {
      return { x: currentX, y: currentY };
    }

    return { x: newX, y: newY };
  };

  // ============================================================
  // MOUSE EVENT HANDLERS
  // ============================================================

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

    // Where the mouse wants the circle to be
    const targetX = svgP.x - dragStart.x;
    const targetY = svgP.y - dragStart.y;

    // Find valid position using iterative relaxation + gating
    const validPos = getValidPosition(
      movingCircle,
      movingCircle.x, // current position (fallback)
      movingCircle.y,
      targetX, // target position (where mouse is)
      targetY
    );

    // Update circle position
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
    handleMouseUp,
  };
};
