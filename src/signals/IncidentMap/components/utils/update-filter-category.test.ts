import { mockFiltersLong } from '../__test__'
import { updateFilterCategory } from './update-filter-category'

describe('updateFilterCategory', () => {
  it('should set filter inactive', () => {
    const result = updateFilterCategory('Afval', mockFiltersLong)

    expect(result[0].filterActive).toEqual(false)
  })

  it('should set filter active', () => {
    const result = updateFilterCategory('Afval', mockFiltersLong)

    expect(result[0].filterActive).toEqual(false)

    const resultSecond = updateFilterCategory('Afval', result)

    expect(resultSecond[0].filterActive).toEqual(true)
  })
})
