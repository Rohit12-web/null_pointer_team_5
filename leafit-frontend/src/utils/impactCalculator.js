// Impact calculation utilities

export const calculateCarbonSaved = (activities) => {
  return activities.reduce((total, activity) => {
    return total + (activity.carbonSaved || 0);
  }, 0);
};

export const calculateWaterSaved = (activities) => {
  return activities.reduce((total, activity) => {
    return total + (activity.waterSaved || 0);
  }, 0);
};

export const calculateTreesEquivalent = (carbonSaved) => {
  // Average tree absorbs about 21.77 kg of CO2 per year
  return carbonSaved / 21.77;
};

export const calculateImpactScore = (activities) => {
  const carbonSaved = calculateCarbonSaved(activities);
  const waterSaved = calculateWaterSaved(activities);
  
  // Simple scoring formula
  return Math.round(carbonSaved * 10 + waterSaved * 0.5);
};

export default {
  calculateCarbonSaved,
  calculateWaterSaved,
  calculateTreesEquivalent,
  calculateImpactScore,
};
