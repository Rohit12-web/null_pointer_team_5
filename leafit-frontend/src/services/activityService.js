import api from './api';

export const activityService = {
  getActivities: async () => {
    return api.get('/activities');
  },
  
  getActivity: async (id) => {
    return api.get(`/activities/${id}`);
  },
  
  createActivity: async (activityData) => {
    return api.post('/activities', activityData);
  },
  
  updateActivity: async (id, activityData) => {
    return api.put(`/activities/${id}`, activityData);
  },
  
  deleteActivity: async (id) => {
    return api.delete(`/activities/${id}`);
  },
};

export default activityService;
