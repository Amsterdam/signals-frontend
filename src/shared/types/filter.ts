interface FilterOption {
  color: string
  email_sent_when_set: boolean
  key: string
  shows_remaining_sla_days: boolean
  value: string
}

export interface Filter {
  created_at: string
  id: number
  name: string
  options: Record<string, FilterOption[]>
  refresh: boolean
  show_on_overview: boolean
}
