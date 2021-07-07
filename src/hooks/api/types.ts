import type { State } from 'hooks/useFetch'

export type QueryParameters = {
  pageSize?: number
  page?: number
}

export interface GetHookResponse<T, U extends Array<unknown>> extends State<T> {
  get: (...args: U) => Promise<void>
}
