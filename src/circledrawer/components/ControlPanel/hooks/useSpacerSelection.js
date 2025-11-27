import { useMemo } from 'react';

export const useSpacerSelection = (selectedCircleData, getValidSpacersForSelectedCircle) => {
  const validSpacers = useMemo(() => {
    if (!selectedCircleData || selectedCircleData.type !== 'CARRIER_OD') {
      return [];
    }
    return getValidSpacersForSelectedCircle ? getValidSpacersForSelectedCircle() : [];
  }, [selectedCircleData, getValidSpacersForSelectedCircle]);

  const hasNoValidSpacers = validSpacers.length === 0 && selectedCircleData?.diameter > 0;

  return {
    validSpacers,
    hasNoValidSpacers
  };
};