// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useClickOutside } from '@amsterdam/asc-ui'
import { useForm, FormProvider } from 'react-hook-form'

import useLocationReferrer from 'hooks/useLocationReferrer'
import { generateParams } from 'shared/services/api/api'
import IncidentManagementContext from 'signals/incident-management/context'
import {
  DASHBOARD_URL,
  INCIDENTS_URL,
} from 'signals/incident-management/routes'
import history from 'utils/history'

import { filterNames } from './constants'
import SelectList from './SelectList'
import { FilterBar } from './styled'
import type { Option } from './types'

type Props = {
  setQueryString: (queryString: string) => void
}

export const Filter = ({ setQueryString }: Props) => {
  const [filterActiveName, setFilterActiveName] = useState('')
  const { dashboardFilter, setDashboardFilter } = useContext(
    IncidentManagementContext
  )

  const location = useLocationReferrer() as { referrer: string }

  const methods = useForm<{ [key: string]: Option }>({
    defaultValues: Object.fromEntries(
      filterNames.map((name) => [
        name,
        (location?.referrer === INCIDENTS_URL &&
          dashboardFilter &&
          dashboardFilter[name]) || {
          display: '',
          value: '',
        },
      ])
    ),
  })

  const { getValues, watch, resetField } = methods

  const refFilterContainer = useRef<HTMLDivElement>(null)

  useClickOutside(
    refFilterContainer,
    () => filterActiveName && setFilterActiveName('')
  )

  const handleCallback = useCallback(() => {
    const filters = getValues()
    // Department is not an actual filter of the endpoint. It only determines which categories a user sees.
    delete filters.department

    const selectedFilters: { [key: string]: string } = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        return [[key], value?.value]
      })
    )

    const params = generateParams(selectedFilters)

    setQueryString(params)
  }, [setQueryString, getValues])

  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      if (type === 'change') {
        handleCallback()

        if (name === 'department') {
          resetField('category_slug')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getValues, handleCallback, resetField, watch])

  useEffect(() => {
    handleCallback()
  }, [handleCallback])

  /**
   * This make sure dashboard filters value get cleared
   * when moving to another page without a backlink state property,
   * except when entering the dashboard.
   */
  useEffect(() => {
    const unlisten = history.listen(
      (location: { pathname: string; state?: any }) => {
        if (
          location.pathname === INCIDENTS_URL &&
          location.state?.useDashboardFilters
        ) {
          setDashboardFilter(getValues())
        } else if (location.pathname !== DASHBOARD_URL) {
          setDashboardFilter({})
        }
      }
    )
    return () => unlisten()
  }, [getValues, setDashboardFilter])

  useEffect(() => {
    refFilterContainer.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [filterActiveName])

  return (
    <FilterBar ref={refFilterContainer}>
      <FormProvider {...methods}>
        <SelectList
          filterActiveName={filterActiveName}
          setFilterActiveName={setFilterActiveName}
          setQueryString={setQueryString}
        />
      </FormProvider>
    </FilterBar>
  )
}
