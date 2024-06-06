import axios from 'axios';

// Define the User interface
interface User {
  status: number;
  message: string;
  data: {
    _id: string;
    username: string;
    email: string;
    accessToken: string;
    updatedAt: string;
  };
}

// Create Axios instance
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api/v1/',
});
// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user: User = JSON.parse(userJson || '');
        if (user && user.data && user.data.accessToken) {
          config.headers.Authorization = `Bearer ${user.data.accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
