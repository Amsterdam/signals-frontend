import { State } from 'hooks/useFetch'

export type QueryParameters = {
  pageSize?: number
  page?: number
}

export type FetchHookResponse<T> = State<T>
