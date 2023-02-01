import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import { getFilterCategoriesWithIcons } from './utils'
import { showSubCategoryFilter } from './utils'
import { fetchCategoriesResponse } from '../__test__'

jest.mock('shared/services/configuration/configuration')

describe('getFilterCategoriesWithIcon', () => {
  beforeEach(() => {
    configuration.map.optionsIncidentMap.hasSubfiltersEnabled = [
      'afval',
      'wegen-verkeer-straatmeubilair',
    ]
  })
  const mockData =
    fetchCategoriesResponse.results as unknown as Categories['results']

  it('should return only public accessible categories as filter', () => {
    const results = getFilterCategoriesWithIcons(mockData)

    expect(
      results.find(
        (filter) => filter.slug === 'container-voor-plastic-afval-is-vol'
      )
    ).toBeUndefined()

    expect(results.find((filter) => filter.slug === 'afval')).toBeTruthy()
  })

  it('should return filters with icon', () => {
    const results = getFilterCategoriesWithIcons(mockData)

    expect(results.find((filter) => filter.slug === 'overig')?.icon).toEqual(
      '/assets/images/icon-incident-marker.svg'
    )

    expect(
      results.find((filter) => filter.slug === 'overlast-bedrijven-en-horeca')
        ?.icon
    ).toEqual(
      'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/overlast-bedrijven-en-horeca/bedrijven.svg?temp_url_sig=44addc6725e4523b2115f0285d9312c35d006533aee756b3b77344b71c75b98d&temp_url_expires=1665401495'
    )
  })
})

describe('showSubCategoryFilter', () => {
  beforeEach(() => {
    configuration.map.optionsIncidentMap.hasSubfiltersEnabled = [
      'afval',
      'wegen-verkeer-straatmeubilair',
    ]
  })

  it('should return false on default', () => {
    configuration.map.optionsIncidentMap.hasSubfiltersEnabled = []
    const result = showSubCategoryFilter('afval')

    expect(result).toEqual(false)
  })

  it('should return true when main category has subFilter enabled', () => {
    const result = showSubCategoryFilter('afval')

    expect(result).toEqual(true)
  })
})
