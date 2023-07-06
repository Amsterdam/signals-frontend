// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment, useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import {
  Row,
  Column,
  themeSpacing,
  Button,
  SearchBar,
  CompactPager,
} from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import DataView from 'components/DataView'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import Select from 'components/Select'
import { PAGE_SIZE } from 'containers/App/constants'
import { makeSelectUserCan } from 'containers/App/selectors'
import useDebounce from 'hooks/useDebounce'
import { inputSelectDepartmentsSelector } from 'models/departments/selectors'
import { inputSelectRolesSelector } from 'models/roles/selectors'
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes'

import useFetchUsers from './hooks/useFetchUsers'

type Params = {
  pageNum: string
}

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`

const StyledSearchbar = styled(SearchBar)`
  height: ${themeSpacing(11)};

  & div,
  & input {
    height: 100% !important;
  }

  > button {
    display: none;
  }
`

const StyledDataView = styled(DataView)`
  th:first-child,
  th:nth-child(2) {
    width: 25%;
  }

  th:last-child {
    width: 120px;
  }
`

const StyledCompactPager = styled(CompactPager)`
  max-width: 200px;
  margin-top: ${themeSpacing(6)};
`

const selectUserActive = [
  { key: 'all', name: 'Alles', value: '*' },
  { key: 'active', name: 'Actief', value: 'true' },
  { key: 'inactive', name: 'Niet actief', value: 'false' },
]

const UsersOverviewContainer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pageNum } = useParams<Params>()
  const page = pageNum ? Number.parseInt(pageNum, 10) : 1
  const [filters, setFilters] = useState(new URLSearchParams(location.search))
  const {
    get,
    isLoading,
    users: { list: data, count },
  } = useFetchUsers()
  const userCan = useSelector(makeSelectUserCan)
  const selectRoles = useSelector(inputSelectRolesSelector)
  const selectDepartments = useSelector(inputSelectDepartmentsSelector)
  const selectedDepartment = filters.get('profile_department_code')
    ? selectDepartments.find(
        ({ value }) => value === filters.get('profile_department_code')
      )?.value
    : undefined

  const selectedRole = filters.get('role')
    ? selectRoles.find(({ value }) => value === filters.get('role'))?.value
    : undefined

  useEffect(() => {
    setFilters(new URLSearchParams(location.search))
  }, [location])

  useEffect(() => {
    get({ page, filters })
  }, [get, page, filters])

  const setUsernameFilter = useCallback(
    (value: string) => {
      filters.set('username', value)
      navigate(`${USERS_PAGED_URL}/1?${filters.toString()}`)
    },
    [filters, navigate]
  )

  const createOnChangeFilter = useCallback(
    (event) => {
      const { value } = event.target

      if (value !== filters.get('username')) {
        setUsernameFilter(value)
      }
    },
    [setUsernameFilter, filters]
  )

  const debouncedOnChangeFilter = useDebounce(createOnChangeFilter, 250)

  const selectOnChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      event.preventDefault()
      const { name, value } = event.currentTarget
      filters.set(name, value)
      navigate(`${USERS_PAGED_URL}/1?${filters.toString()}`)
    },
    [filters, navigate]
  )

  const onItemClick = useCallback(
    (event) => {
      if (userCan('change_user') === false) {
        event.preventDefault()
        return
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = event

      if (itemId) {
        navigate(`${USER_URL}/${itemId}`)
      }
    },
    [navigate, userCan]
  )

  const onPaginationClick = useCallback(
    (pageToNavigateTo: number) => {
      global.window.scrollTo(0, 0)
      navigate(`${USERS_PAGED_URL}/${pageToNavigateTo}?${filters.toString()}`)
    },
    [filters, navigate]
  )

  const columnHeaders = ['Gebruikersnaam', 'Rol', 'Afdeling', 'Status']
  return (
    <Fragment>
      <PageHeader title={`Gebruikers${count ? ` (${count})` : ''}`}>
        {userCan('add_user') && (
          <HeaderButton variant="primary" forwardedAs={Link} to={USER_URL}>
            Gebruiker toevoegen
          </HeaderButton>
        )}
      </PageHeader>

      <Row data-testid="usersOverview">
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <StyledDataView
              headers={columnHeaders}
              filters={[
                <StyledSearchbar
                  placeholder=""
                  onChange={(event) => {
                    event.persist()
                    debouncedOnChangeFilter(event)
                  }}
                  onClear={() => setUsernameFilter('')}
                  value={filters.get('username') || ''}
                  data-testid="filterUsersByUsername"
                />,

                <Select
                  id="roleSelect"
                  name="role"
                  value={selectedRole}
                  options={selectRoles}
                  optionKey="name"
                  onChange={selectOnChange}
                />,

                <Select
                  id="departmentSelect"
                  name="profile_department_code"
                  value={selectedDepartment || '*'}
                  options={selectDepartments}
                  optionKey="value"
                  onChange={selectOnChange}
                />,

                <Select
                  id="userActiveSelect"
                  name="is_active"
                  value={filters.get('is_active') ?? undefined}
                  options={selectUserActive}
                  optionKey="value"
                  onChange={selectOnChange}
                />,
              ]}
              columnOrder={columnHeaders}
              invisibleColumns={['id']}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
              data={(!isLoading && data?.length > 0 && data) || []}
            />
          </Column>

          {!isLoading && count > PAGE_SIZE && (
            <Column span={12}>
              <StyledCompactPager
                data-testid="pagination"
                collectionSize={count}
                pageSize={PAGE_SIZE}
                page={page}
                onPageChange={onPaginationClick}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default UsersOverviewContainer
