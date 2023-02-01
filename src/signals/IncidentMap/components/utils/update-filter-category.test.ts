import { updateFilterCategory } from './update-filter-category'
import { mockFiltersLong } from '../__test__'

describe('updateFilterCategory', () => {
  it('should set filter inactive', () => {
    const result = updateFilterCategory('afval', mockFiltersLong)

    expect(result[0].filterActive).toEqual(false)
  })

  it('should set filter active', () => {
    const result = updateFilterCategory('afval', mockFiltersLong)

    expect(result[0].filterActive).toEqual(false)

    const resultSecond = updateFilterCategory('afval', result)

    expect(resultSecond[0].filterActive).toEqual(true)
  })
})
