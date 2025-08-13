import axios from "axios";


const apiClient  = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 10000,
  withCredentials: true,
});



export default apiClient ;
