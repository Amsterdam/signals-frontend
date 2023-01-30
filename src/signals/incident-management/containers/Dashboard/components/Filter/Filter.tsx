// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useRef, useState } from 'react'

import { useClickOutside } from '@amsterdam/asc-ui'
import { useForm, FormProvider } from 'react-hook-form'
import { generateParams } from 'shared/services/api/api'

import SelectList from './SelectList'
import { FilterBar } from './styled'
import type { Option } from './types'

type Props = {
  callback?: (queryString: string) => void
}

export const Filter = ({ callback }: Props) => {
  const [filterActiveName, setFilterActiveName] = useState('')

  const methods = useForm<{ [key: string]: Option }>({
    defaultValues: Object.fromEntries(
      ['department', 'category', 'priority', 'punctuality', 'district'].map(
        (name) => [name, { value: '', display: '' }]
      )
    ),
  })

  const { getValues, watch, resetField } = methods

  const refFilterContainer = useRef<HTMLDivElement>(null)

  useClickOutside(
    refFilterContainer,
    () => filterActiveName && setFilterActiveName('')
  )

  const handleCallback = useCallback(() => {
    const selectedFilters: { [key: string]: string } = Object.fromEntries(
      Object.entries(getValues()).map(([key, value]) => {
        return [[key], value?.value]
      })
    )

    const params = generateParams(selectedFilters)
    params && callback && callback(generateParams(selectedFilters))
  }, [callback, getValues])

  // on change form, call handleCallback as a service to the parent component
  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      if (name === 'department' && type === 'change') {
        resetField('category')
      }
      handleCallback()
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
        />
      </FormProvider>
    </FilterBar>
  )
}
