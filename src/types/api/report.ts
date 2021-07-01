type Category = {
  name: string
  departments: string[]
}

export interface Report {
  total_signal_count: number
  results: { category: Category; signal_count: number }[]
}
