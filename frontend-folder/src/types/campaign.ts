export interface Campaign {
  id: string
  user_id: string
  duration_days: number
  amount_paid: number
  payment_ref: string
  status: 'pending' | 'paid' | 'active' | 'completed'
  start_date?: string
  end_date?: string
  created_at: string
}
