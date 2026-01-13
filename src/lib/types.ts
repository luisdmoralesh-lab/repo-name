export interface Ad {
  id: number
  created_at: string
  title: string
  description: string
  contact: string
  image_url: string | null
}

export type AdInsert = Omit<Ad, 'id' | 'created_at'>
