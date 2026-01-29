import api from './api';

export const activityService = {
  // Get all user activities
  getActivities: async () => {
    return api.get('/activities/');
  },
  
  // Log a new activity
  logActivity: async (activityData) => {
    return api.post('/activities/', {
      activity_type: activityData.type,
      activity_subtype: activityData.subType,
      activity_name: activityData.name,
      quantity: parseFloat(activityData.quantity),
      unit: activityData.unit,
      notes: activityData.notes || '',
      activity_date: activityData.date || null,  // Send the selected date
    });
  },
  
  // Get user stats with breakdown
  getUserStats: async () => {
    return api.get('/user/stats/');
  },
  
  // Get leaderboard
  getLeaderboard: async (sortBy = 'total_points', limit = 50) => {
    return api.get(`/leaderboard/?sort=${sortBy}&limit=${limit}`);
  },
  
  // Get global stats
  getGlobalStats: async () => {
    return api.get('/stats/');
  },

  // Calculate impact preview (client-side calculation before submitting)
  calculateImpactPreview: (activityType, subType, quantity) => {
    const CO2_FACTORS = {
      // Transport
      'public_transport': 0.14,
      'cycling': 0.21,
      'walking': 0.21,
      'carpooling': 0.08,
      'electric_vehicle': 0.10,
      // Electricity
      'led_lights': 0.04,
      'unplug_devices': 0.02,
      'ac_reduction': 0.15,
      'solar_energy': 0.50,
      'natural_light': 0.06,
      // Recycling
      'plastic_recycling': 0.50,
      'paper_recycling': 1.00,
      'composting': 0.30,
      'reusable_bags': 0.10,
      'reduced_packaging': 0.20,
      // Water
      'shorter_shower': 0.01,
      'fix_leaks': 0.02,
      'rainwater': 0.01,
      'efficient_washing': 0.05,
      'turned_off_tap': 0.005,
      // Food
      'plant_based_meal': 2.50,
      'local_food': 0.50,
      'no_food_waste': 0.70,
      'homegrown': 1.00,
      'seasonal_food': 0.30,
      // Other
      'tree_planting': 22.0,
      'eco_drive': 0.50,
      'awareness': 0.10,
      'cleanup': 0.20,
      'donation': 0.50,
    };

    const WATER_FACTORS = {
      'shorter_shower': 10.0,
      'fix_leaks': 20.0,
      'rainwater': 1.0,
      'efficient_washing': 50.0,
      'turned_off_tap': 12.0,
    };

    const POINTS_FACTORS = {
      // Transport
      'public_transport': 15,
      'cycling': 20,
      'walking': 20,
      'carpooling': 10,
      'electric_vehicle': 12,
      // Electricity
      'led_lights': 5,
      'unplug_devices': 3,
      'ac_reduction': 15,
      'solar_energy': 50,
      'natural_light': 8,
      // Recycling
      'plastic_recycling': 25,
      'paper_recycling': 30,
      'composting': 20,
      'reusable_bags': 10,
      'reduced_packaging': 15,
      // Water
      'shorter_shower': 10,
      'fix_leaks': 25,
      'rainwater': 15,
      'efficient_washing': 20,
      'turned_off_tap': 5,
      // Food
      'plant_based_meal': 30,
      'local_food': 20,
      'no_food_waste': 25,
      'homegrown': 35,
      'seasonal_food': 15,
      // Other
      'tree_planting': 100,
      'eco_drive': 40,
      'awareness': 30,
      'cleanup': 50,
      'donation': 25,
    };

    const qty = parseFloat(quantity) || 0;
    const co2Factor = CO2_FACTORS[subType] || 0.1;
    const waterFactor = WATER_FACTORS[subType] || 0;
    const pointsFactor = POINTS_FACTORS[subType] || 10;

    return {
      co2_saved: Math.round(qty * co2Factor * 1000) / 1000,
      water_saved: Math.round(qty * waterFactor * 100) / 100,
      points: Math.round(qty * pointsFactor),
    };
  },
};

export default activityService;
