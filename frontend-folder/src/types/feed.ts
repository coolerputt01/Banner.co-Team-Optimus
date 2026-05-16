export interface Ad {
  id: string
  user_id: string
  title: string
  description?: string | null
  media_url?: string | null
  tags: string[]   // backend always returns [] not null
  likes?: number
  comments?: number
  views_count?: number
}

export interface FeedResponse {
  ads: Ad[]
  total: number
}
