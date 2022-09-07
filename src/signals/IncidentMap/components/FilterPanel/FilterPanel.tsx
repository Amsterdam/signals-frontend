// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useState, useEffect, Fragment } from 'react'

import { ChevronLeft, ChevronRight } from '@amsterdam/asc-assets'
import { Checkbox, Paragraph, Heading } from '@amsterdam/asc-ui'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

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

export type Props = {
  filters: Filter[]
  setFilters: (categories: Filter[]) => void
  setMapMessage: React.Dispatch<React.SetStateAction<string>>
}

export const FilterPanel = ({ filters, setFilters, setMapMessage }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

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
      const filters: Filter[] = data.results
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

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [isOpen])

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

          <Heading as="h4">Filter op onderwerp</Heading>
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
        </StyledPanelContent>
      )}
      <StyledButton
        className={isOpen ? '' : 'hiddenPanel'}
        onClick={() => setIsOpen(!isOpen)}
        size={60}
        variant="blank"
        iconSize={24}
        icon={isOpen ? <ChevronLeft /> : <ChevronRight />}
        aria-label={isOpen ? 'Sluit filter panel' : 'Open filter panel'}
      />
    </Fragment>
  )
}
