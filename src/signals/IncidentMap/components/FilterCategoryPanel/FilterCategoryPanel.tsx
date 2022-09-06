// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Checkbox, Paragraph } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'
import { useFetch } from 'hooks'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type Categories from 'types/api/categories'

import {
  StyledPanelContent,
  StyledLabel,
  CategoryFilter,
  Wrapper,
} from './styled'

export type FilterCategory = {
  name: string
  _display?: string
  filterActive: boolean
  slug: string
}

type FilterCategoryPanelProps = {
  passFilterCategories: (categories: FilterCategory[]) => void
}

export const updateCategory = (
  categoryName: string,
  category: FilterCategory
) => {
  if (category.name === categoryName) {
    return {
      ...category,
      filterActive: !category.filterActive,
    }
  } else {
    return category
  }
}

export const FilterCategoryPanel: FC<FilterCategoryPanelProps> = ({
  passFilterCategories,
}) => {
  const { get, data } = useFetch<Categories>()
  console.log('--- ~ data', data)
  const [mainCategories, setMainCategories] = useState<FilterCategory[]>()

  const toggleFilter = (categoryName: string) => {
    const updated = mainCategories?.map((category) =>
      updateCategory(categoryName, category)
    )
    setMainCategories(updated)
  }

  useEffect(() => {
    if (!mainCategories) return
    passFilterCategories(mainCategories)
  }, [mainCategories, passFilterCategories])

  useEffect(() => {
    if (!data) {
      get(configuration.CATEGORIES_ENDPOINT)
    }
  }, [get, data])

  useEffect(() => {
    if (data?.results) {
      const categories = data.results
        .filter(({ is_public_accessible }) => is_public_accessible)
        .map((category) => ({
          name: category.name,
          _display: category._display,
          filterActive: true,
          slug: category.slug,
        }))

      setMainCategories(categories)
    }
  }, [data])

  return (
    <StyledPanelContent data-testid="filterCategoryPanel">
      <Paragraph>
        Op deze kaart staan meldingen in de openbare ruimte waarmee we aan het
        werk zijn. Vanwege privacy staat een klein deel van de meldingen niet op
        de kaart.
      </Paragraph>
      {mainCategories && (
        <>
          <Paragraph>
            <strong>Filter op onderwerp</strong>
          </Paragraph>
          <Wrapper>
            {mainCategories?.map(({ name, filterActive, _display }) => {
              return (
                <CategoryFilter key={name}>
                  <StyledLabel htmlFor={name} label={_display || name}>
                    <Checkbox
                      id={name}
                      checked={filterActive}
                      onChange={() => toggleFilter(name)}
                    />
                  </StyledLabel>
                </CategoryFilter>
              )
            })}
          </Wrapper>
        </>
      )}
    </StyledPanelContent>
  )
}
