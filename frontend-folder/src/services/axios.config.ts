import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('banner_access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// On 401 — clear token and redirect to splash (only if user was previously authenticated)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const token = localStorage.getItem('banner_access_token')
      // Only redirect if there was a token (i.e. session expired), not for guest requests
      if (token) {
        localStorage.removeItem('banner_access_token')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  },
)

export { BASE_URL }
export default axiosInstance
