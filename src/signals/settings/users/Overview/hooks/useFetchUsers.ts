// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useState, useEffect, useCallback } from 'react'

import { PAGE_SIZE as page_size } from 'containers/App/constants'
import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'

import type { FetchError } from 'hooks/useFetch'
import type UsersData from 'types/api/users'

import filterData from '../../../filterData'

export type Filters = {
  profile_department_code?: string
  role?: string
  is_active?: 'true' | 'false'
  username?: string
}

// name mapping from API values to human readable values
const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
  profile: 'profile',
}

type FetchUsersProps = {
  filters?: URLSearchParams
  page?: number
}

type User = {
  id: number
  Status: boolean
  Rol: Array<string>
  Gebruikersnaam: string
  Afdeling: string
}

type Users = {
  count: number
  list: Array<User>
}

interface FetchResponse {
  isLoading: boolean
  users: Users
  error?: boolean | FetchError
  get: (params?: FetchUsersProps) => void
}

const useFetchUsers = (): FetchResponse => {
  const [users, setUsers] = useState<Users>({ count: 0, list: [] })
  const { get: fetch, data, isLoading, error } = useFetch<UsersData>()

  const get = useCallback(
    async ({ filters, page }: FetchUsersProps = {}) => {
      const pageParams = { page, page_size }
      const entries = filters ? Array.from(filters.entries()) : []

      const filterParams = entries.length
        ? entries
            .filter(
              ([key, value]: [string, string]) => value !== '*' && key !== ''
            )
            .reduce(
              (
                acc: Record<string, string>,
                [filter, value]: [string, string]
              ) => ({ ...acc, [filter]: value }),
              {}
            )
        : {}

      const queryParams = { ...pageParams, ...filterParams }

      await fetch(configuration.USERS_ENDPOINT, queryParams)
    },
    [fetch]
  )

  useEffect(() => {
    if (!data) return

    const filteredUserData: Array<User> = filterData(data.results, colMap).map(
      ({ profile, id, Status, Rol, Gebruikersnaam }) => ({
        id,
        Status,
        Rol,
        Gebruikersnaam,
        Afdeling: profile?.departments ? profile.departments.join(', ') : '',
      })
    )

    setUsers({ count: data.count, list: filteredUserData })
  }, [data])

  return { get, users, isLoading, error }
}

export default useFetchUsers
