// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect } from 'react'

import { Heading } from '@amsterdam/asc-ui'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import type { Filter } from '../../types'
import { updateFilterCategory } from '../utils'
import { getCombinedFilters } from '../utils/get-combined-filters'
import { FilterCategory } from './FilterCategory'
import { FilterCategoryWithSub } from './FilterCategoryWithSub'
import { Underlined } from './styled'
import { getFilterCategoriesWithIcons } from './utils'

export interface Props {
  filters: Filter[]
  setFilters: (categories: Filter[]) => void
  setMapMessage: (mapMessage: JSX.Element | string) => void
}

export const FilterPanel = ({ filters, setFilters, setMapMessage }: Props) => {
  const { get, data, error } = useFetch<Categories>()

  const toggleFilter = useCallback(
    (filter: Filter, newFilterActive: boolean) => {
      let allFilters = filters
      const combinedFilters = getCombinedFilters(filter, filters)

      combinedFilters.forEach((categoryFilter) => {
        if (categoryFilter.filterActive !== newFilterActive) {
          allFilters = updateFilterCategory(categoryFilter.name, allFilters)
        }
      })
      setFilters(allFilters)
    },
    [filters, setFilters]
  )

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
      <Underlined />
      {filters
        .filter((filter: Filter) => filter.incidentsCount)
        .map((filter: Filter) => {
          const { name, filterActive, _display, icon, subCategories } = filter

          return subCategories ? (
            <FilterCategoryWithSub
              key={name}
              filter={filter}
              onToggleCategory={toggleFilter}
            />
          ) : (
            <>
              <FilterCategory
                key={name}
                onToggleCategory={() => {
                  toggleFilter(filter, !filterActive)
                }}
                selected={filterActive}
                text={_display || name}
                icon={icon}
              />
              <Underlined />
            </>
          )
        })}
    </>
  )
}
