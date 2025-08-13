import apiClient from "./apiClient";

export async function requestHandler(method, url, data = null,headers = {}) {
  try {
    const response = await apiClient({ method, url, data ,headers});
    
    return { data: response.data, status: response.status, error: null };
  } catch (error) {
    return {
      data: null,
      status: error.response?.status,
      error: error.response?.data || error.message,
    };
  }
}