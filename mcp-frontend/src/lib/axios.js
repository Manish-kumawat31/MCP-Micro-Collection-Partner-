import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'https://mcp-system-ddcn.onrender.com', 
  withCredentials: true
});