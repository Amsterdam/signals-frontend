// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect } from 'react'

import { Heading } from '@amsterdam/asc-ui'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import type { Filter } from '../../types'
import FilterCategories from './FilterCategories'
import { Wrapper } from './styled'
import { getFilterCategoriesWithIcons } from './utils'

export interface Props {
  filters: Filter[]
  setFilters: (categories: Filter[]) => void
  setMapMessage: (mapMessage: JSX.Element | string) => void
  toggleFilter: (categories: Filter[], checked: boolean) => void
}

export const FilterPanel = ({
  filters,
  setFilters,
  setMapMessage,
  toggleFilter,
}: Props) => {
  const { get, data, error } = useFetch<Categories>()

  useEffect(() => {
    if (filters.length === 0) {
      get(configuration.CATEGORIES_ENDPOINT)
    }
  }, [filters, get])

  useEffect(() => {
    if (data?.results) {
      const filters: Filter[] = getFilterCategoriesWithIcons(data.results)

      setFilters(filters)
    }
  }, [data, setFilters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen filter categorieën worden opgehaald.')
    }
  }, [error, setMapMessage])

  if (filters.length === 0) {
    return null
  }

  return (
    <>
      <Heading as="h4">Filter op onderwerp</Heading>
      <Wrapper>
        {filters.map((filter) => (
          <FilterCategories
            key={filter.name}
            filter={filter}
            onToggleCategory={toggleFilter}
          />
        ))}
      </Wrapper>
    </>
  )
}
