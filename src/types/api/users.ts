export default interface Users {
  _links: {
    self: string
    next: string
    previous: string
  }
  count: number
  results: Array<Result>
}

interface Profile {
  note: string
  departments: Array<string>
}

interface Result {
  _display: string
  id: number
  username: string
  is_active: boolean
  roles: Array<string>
  profile: Profile | null
}
