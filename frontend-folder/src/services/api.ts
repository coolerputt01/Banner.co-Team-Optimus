import axiosInstance, { BASE_URL } from './axios.config'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const initiateLogin = () => {
  window.location.href = `${BASE_URL}/auth/login`
}

export const initiateLogout = () => {
  localStorage.removeItem('banner_access_token')
  window.location.href = `${BASE_URL}/auth/logout`
}

// ─── User ─────────────────────────────────────────────────────────────────────
export const getMe = () => axiosInstance.get('/users/me')

export const updateMe = (formData: FormData) =>
  axiosInstance.put('/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ─── Feed ─────────────────────────────────────────────────────────────────────
export const getFeed = (limit = 10) =>
  axiosInstance.get(`/feed?limit=${limit}`)

// ─── Ads ──────────────────────────────────────────────────────────────────────
export const createAd = (formData: FormData) =>
  axiosInstance.post('/ads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteAd = (adId: string) =>
  axiosInstance.delete(`/ads/${adId}`)

// ─── Likes ────────────────────────────────────────────────────────────────────
export const likeAd = (adId: string) =>
  axiosInstance.post(`/ads/${adId}/like`)

export const unlikeAd = (adId: string) =>
  axiosInstance.delete(`/ads/${adId}/like`)

export const getLikeCount = (adId: string) =>
  axiosInstance.get(`/ads/${adId}/likes`)

export const isLiked = (adId: string) =>
  axiosInstance.get(`/ads/${adId}/is-liked`)

// ─── Comments ─────────────────────────────────────────────────────────────────
export const addComment = (adId: string, content: string) =>
  axiosInstance.post(`/ads/${adId}/comments`, { content })

export const getComments = (adId: string, skip = 0, limit = 20) =>
  axiosInstance.get(`/ads/${adId}/comments?skip=${skip}&limit=${limit}`)

export const deleteComment = (commentId: string) =>
  axiosInstance.delete(`/comments/${commentId}`)

// ─── Views ────────────────────────────────────────────────────────────────────
export const recordView = (adId: string) =>
  axiosInstance.post(`/ads/${adId}/view`)

export const getViewCount = (adId: string) =>
  axiosInstance.get(`/ads/${adId}/views`)

// ─── Campaigns ────────────────────────────────────────────────────────────────
export const initiateCampaign = (duration_days: number) => {
  const fd = new FormData()
  fd.append('duration_days', String(duration_days))
  return axiosInstance.post('/campaigns/initiate', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
