import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'https://mcp-micro-collection-partner.onrender.com', 
  withCredentials: true
});