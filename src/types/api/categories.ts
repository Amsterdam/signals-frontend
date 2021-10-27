import type { Category } from '../category'

export default interface Categories {
  _links: {
    self: {
      href: string
    }
    next: {
      href: string | null
    }
    previous: {
      href: string | null
    }
  }
  count: number
  results: Array<Category>
}
