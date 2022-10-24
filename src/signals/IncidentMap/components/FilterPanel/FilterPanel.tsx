// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect } from 'react'

import { Heading } from '@amsterdam/asc-ui'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import type { Filter } from '../../types'
import { FilterCategories } from './FilterCategories'
import { FilterCategory } from './FilterCategory'
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

  const showAfvalAndWegenCategories = (name: string) => {
    return name === 'Afval' || name === 'Wegen, verkeer, straatmeubilair'
  }

  return (
    <>
      <Heading as="h4">Filter op onderwerp</Heading>
      <Wrapper>
        {filters.map((filter) => {
          const { name, filterActive, _display, icon, subCategories } = filter
          return showAfvalAndWegenCategories(name) && subCategories ? (
            <FilterCategories
              key={name}
              filter={filter}
              onToggleCategory={toggleFilter}
            />
          ) : (
            <FilterCategory
              onToggleCategory={(checked: boolean) => {
                onToggleCategory([filter], checked)
              }}
              selected={filterActive}
              text={_display || name}
              icon={icon}
            />
          )
        })}
      </Wrapper>
    </>
  )
}
