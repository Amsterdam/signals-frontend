import type { StatusCode } from '../../definitions/types'

export type StandardText = {
  active: boolean
  id: number
  meta: Record<any, any>
  state: StatusCode
  text: string
  title: string
}

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
