/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render } from '@testing-library/react'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import Map from 'components/Map'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'
import useFetch from '../../../hooks/useFetch'
import FilterCategoryPanel, { updateCategory } from './FilterCategoryPanel'
import { get, useFetchResponse } from './mapTestUtils'

jest.mock('hooks/useFetch')

const renderWithContext = () =>
  render(
    withAppContext(
      <Map mapOptions={MAP_OPTIONS}>
        <FilterCategoryPanel passFilterCategories={jest.fn()} />
      </Map>
    )
  )

describe('FilterCategoryPanel', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('renders the FilterCategoryPanel', () => {
    expect(get).not.toHaveBeenCalled()

    const { queryByTestId } = renderWithContext()

    expect(queryByTestId('filterCategoryPanel')).toBeInTheDocument()

    expect(get).toHaveBeenCalledWith(
      expect.stringContaining(configuration.CATEGORIES_ENDPOINT)
    )
  })

  describe('updateCategory method', () => {
    const openbaarGroenEnWater = {
      name: 'Openbaar groen en water',
      filterActive: true,
      slug: 'openbaar-groen-en-water',
    }
    it('does not update when the category name attribute does not match categoryName', () => {
      const noMatch = updateCategory('Afval', openbaarGroenEnWater)
      expect(noMatch).toEqual(openbaarGroenEnWater)
    })

    it('updates the category when the category name attribute matches categoryName', () => {
      const match = updateCategory(
        'Openbaar groen en water',
        openbaarGroenEnWater
      )
      const updated = {
        ...openbaarGroenEnWater,
        filterActive: false,
      }
      expect(match).toEqual(updated)
    })
  })
})
