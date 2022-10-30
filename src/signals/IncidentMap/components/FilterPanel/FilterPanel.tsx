// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import type { Filter } from '../../types'
import { updateFilterCategory } from '../utils'
import { FilterCategory } from './FilterCategory'
import { FilterCategoryWithSub } from './FilterCategoryWithSub'
import { Wrapper } from './styled'
import { getFilterCategoriesWithIcons } from './utils'

export interface Props {
  filters: Filter[]
  setFilters: (categories: Filter[]) => void
  setMapMessage: (mapMessage: JSX.Element | string) => void
}

export const FilterPanel = ({ filters, setFilters, setMapMessage }: Props) => {
  const { get, data, error } = useFetch<Categories>()

  const toggleFilter = useCallback(
    /**
     *
     * @param allFilters these are the filters derived from the checkboxes.
     * They can be either main or sub categories or a combination of both
     * @param checked
     */
    (allFilters: Filter[], newFilterActive: boolean) => {
      let updatedFilters = filters

      allFilters.forEach((categoryFilter) => {
        if (categoryFilter.filterActive !== newFilterActive) {
          updatedFilters = updateFilterCategory(
            categoryFilter.name,
            updatedFilters
          )
        }
      })
      setFilters(updatedFilters)
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
      <Wrapper>
        {filters.map((filter: Filter) => {
          const {
            name,
            filterActive,
            _display,
            icon,
            subCategories,
            nrOfIncidents,
          } = filter
          return subCategories ? (
            <FilterCategoryWithSub
              key={name}
              filter={filter}
              onToggleCategory={toggleFilter}
            />
          ) : (
            <FilterCategory
              key={name}
              onToggleCategory={() => {
                toggleFilter([filter], !filterActive)
              }}
              selected={filterActive}
              text={
                _display + ' nr ' + nrOfIncidents ||
                name + ' nr ' + nrOfIncidents
              }
              icon={icon}
            />
          )
        })}
      </Wrapper>
    </>
  )
}
