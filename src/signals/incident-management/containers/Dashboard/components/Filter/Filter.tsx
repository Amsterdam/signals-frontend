// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useClickOutside } from '@amsterdam/asc-ui'
import { useForm, FormProvider } from 'react-hook-form'

import useLocationReferrer from 'hooks/useLocationReferrer'
import { generateParams } from 'shared/services/api/api'
import IncidentManagementContext from 'signals/incident-management/context'
import type { IncidentManagementContextType } from 'signals/incident-management/context'
import { INCIDENTS_URL } from 'signals/incident-management/routes'

import { filterNames } from './constants'
import SelectList from './SelectList'
import { FilterBar } from './styled'
import type { DashboardFilter } from './types'

type Props = {
  setQueryString: (queryString: string) => void
}

export const Filter = ({ setQueryString }: Props) => {
  const [filterActiveName, setFilterActiveName] = useState('')
  const { dashboardFilter, setDashboardFilter } =
    useContext<IncidentManagementContextType>(IncidentManagementContext)

  const location = useLocationReferrer() as { referrer: string }

  // TODO: check whether INCIDENT URL is needed here.
  const methods = useForm<DashboardFilter>({
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

    setDashboardFilter((prevFilter) => ({
      ...prevFilter,
      ...filters,
    }))

    const selectedFilters: { [key: string]: string } = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        return [[key], value?.value]
      })
    )

    const params = generateParams(selectedFilters)

    setQueryString(params)
  }, [getValues, setDashboardFilter, setQueryString])

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
