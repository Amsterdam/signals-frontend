// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Checkbox, Paragraph } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'
import { useFetch } from 'hooks'
import { useEffect, Fragment } from 'react'
import type Categories from 'types/api/categories'
import { ChevronLeft, ChevronRight } from '@amsterdam/asc-assets'

import { updateFilterCategories } from '../utils'

import {
  StyledPanelContent,
  StyledLabel,
  CategoryFilter,
  Wrapper,
  StyledButton,
} from './styled'

export type Filter = {
  name: string
  _display?: string
  filterActive: boolean
  slug: string
}

type Props = {
  setFilters: (categories: Filter[]) => void
  filters: Filter[]
  isOpen: boolean
  setShowPanel: React.Dispatch<React.SetStateAction<boolean>>
  setMapMessage: React.Dispatch<React.SetStateAction<string>>
}

export const FilterPanel = ({
  filters,
  setFilters,
  isOpen,
  setShowPanel,
  setMapMessage,
}: Props) => {
  const { get, data, error } = useFetch<Categories>()

  const toggleFilter = (categoryName: string) => {
    const updated = updateFilterCategories(categoryName, filters)

    setFilters(updated)
  }

  useEffect(() => {
    if (filters.length === 0) {
      get(configuration.CATEGORIES_ENDPOINT)
    }
  }, [filters, get])

  useEffect(() => {
    if (data?.results) {
      const filters = data.results
        .filter(({ is_public_accessible }) => is_public_accessible)
        .map((category) => ({
          name: category.name,
          _display: category._display,
          filterActive: true,
          slug: category.slug,
        }))

      setFilters(filters)
    }
  }, [data, setFilters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen filter categorieën worden opgehaald.')
      return
    }
  }, [error, setMapMessage])

  if (filters.length === 0) {
    return null
  }

  return (
    <Fragment>
      {isOpen && (
        <StyledPanelContent data-testid="filterCategoryPanel">
          <Paragraph>
            Op deze kaart staan meldingen in de openbare ruimte waarmee we aan
            het werk zijn. Vanwege privacy staat een klein deel van de meldingen
            niet op de kaart.
          </Paragraph>
          {
            <>
              <Paragraph>
                <strong>Filter op onderwerp</strong>
              </Paragraph>
              <Wrapper>
                {filters.map(({ name, filterActive, _display }) => {
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
          }
        </StyledPanelContent>
      )}
      <StyledButton
        className={isOpen ? '' : 'hiddenPanel'}
        onClick={() => setShowPanel(!isOpen)}
        size={60}
        variant="blank"
        iconSize={24}
        icon={isOpen ? <ChevronLeft /> : <ChevronRight />}
      />
    </Fragment>
  )
}
