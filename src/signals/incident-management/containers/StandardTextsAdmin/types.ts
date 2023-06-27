import type { StandardText } from 'types/api/standard-texts'

export interface StandardTextsAdminValue {
  page: number
  setPage: (pageNumber: number) => void
}

export interface StandardTextsData {
  count: number
  results: StandardText[]
  _links: {
    next: {
      href: string | null
    }
    previous: {
      href: string | null
    }
    self: {
      href: string
    }
  }
}
