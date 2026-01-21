export interface Ad {
  id: number
  created_at: string
  title: string
  description: string
  contact: string
  image_url: string | null
  likes: number
  user_id: string | null
  whatsapp_preferred: boolean
  sms_preferred: boolean
  call_preferred: boolean
}

export type AdInsert = Omit<Ad, 'id' | 'created_at' | 'likes'>
