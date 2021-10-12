import type { Category } from '../category'

export default interface Categories {
  _links: {
    self: string
    next: string
    previous: string
  }
  count: number
  results: Array<Category>
}
