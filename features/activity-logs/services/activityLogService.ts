import api from '@/lib/axios';
import { ActivityLogResponse } from '../types/activity-log.type';

export const getRecentActivities = async (limit: number = 10): Promise<ActivityLogResponse> => {
  try {
    const response = await api.get(`/activity-logs/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getAllActivities = async (): Promise<ActivityLogResponse> => {
  try {
    const response = await api.get('/activity-logs/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all activities:', error);
    throw error;
  }
}; 