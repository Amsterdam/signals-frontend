export type Doc = {
  centroide_ll: string // "POINT(4.89148099 52.37369669)"
  huis_nlt: string
  id: string
  postcode: string
  straatnaam: string
  weergavenaam: string
  woonplaatsnaam: string
}

export type RevGeo = {
  response: {
    docs: Doc[]
    maxScore: number
    numFound: number
    start: number
  }
}
