export interface StandardTextForm {
  categories: number[]
  state: string
  title: string
  text: string
  active: boolean
}

export interface StandardTextDetailData {
  id: number
  active: boolean
  categories: number[]
  created_at: string
  state: string
  text: string
  title: string
  updated_at: string
}
