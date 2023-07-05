import type { StandardText } from 'types/api/standard-texts'

interface Option {
  key: string
  value: string
}

export interface StandardTextsAdminValue {
  page: number
  setPage: (pageNumber: number) => void
  statusFilter: Option | null
  setStatusFilter: (statusFilter: Option) => void
  activeFilter: Option | null
  setActiveFilter: (activeFilter: Option) => void
  searchQuery: string
  setSearchQuery: (searchQuery: string) => void
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
