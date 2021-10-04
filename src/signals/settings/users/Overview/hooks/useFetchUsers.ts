// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useState, useEffect } from 'react'

import { PAGE_SIZE as page_size } from 'containers/App/constants'
import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'

import type { FetchError } from 'hooks/useFetch'
import type UsersData from 'types/api/users'

import filterData from '../../../filterData'

// name mapping from API values to human readable values
const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
  profile: 'profile',
}

type FetchUsersProps = {
  filters?: Record<string, string>
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
}

const useFetchUsers = ({
  page,
  filters,
}: FetchUsersProps = {}): FetchResponse => {
  const [users, setUsers] = useState<Users>({ count: 0, list: [] })
  const { get, data, isLoading, error } = useFetch<UsersData>()

  useEffect(() => {
    const pageParams = { page, page_size }

    const filterParams = Object.entries(filters || {})
      .filter(([, value]) => value !== '*')
      .reduce((acc, [filter, value]) => ({ ...acc, [filter]: value }), {})

    const queryParams = { ...pageParams, ...filterParams }

    get(configuration.USERS_ENDPOINT, queryParams)
  }, [filters, get, page])

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

  return { isLoading, users, error }
}

export default useFetchUsers
