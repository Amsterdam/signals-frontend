export type UserNames = {
  _links: {
    self: {
      href: string
    }
    next: {
      href: string
    }
    previous: {
      href: string
    }
  }
  count: number
  results: Array<{
    username: string
  }>
}
