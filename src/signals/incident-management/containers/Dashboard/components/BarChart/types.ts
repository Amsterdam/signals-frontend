export interface RawData {
  total: number
  results: undefined[]
}

export interface VegaLiteBarChartItem {
  datum: {
    status: string
    slug: string
    tag: string
    nrOfIncidents: number
    nrOfIncidents_start: number
    nrOfIncidents_end: number
  }
}
