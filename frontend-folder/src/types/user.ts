export interface User {
  id: string
  email: string
  business_name: string
  profile_picture?: string | null
  banner_picture?: string | null
  bio?: string | null
  number_of_ads_watched: number
  total_ads_watch_time: number
  verified: boolean
  wallet?: { balance: number } | null
}
