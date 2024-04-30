import { isCaterpillarCategory } from './is-caterpillar-category'
import { mockCaterpillarFeatureGeo } from './test/mock-objects'

describe('isCaterpillarCategory', () => {
  it('should return true when feature id is a number and species is in properties', () => {
    expect(isCaterpillarCategory(mockCaterpillarFeatureGeo[0])).toBe(true)
  })

  it('should return true when feature id is a number and species is in properties array', () => {
    expect(isCaterpillarCategory(mockCaterpillarFeatureGeo[1])).toBe(true)
  })

  it('should return false when feature id is not a number', () => {
    expect(
      isCaterpillarCategory({ ...mockCaterpillarFeatureGeo[0], id: undefined })
    ).toBe(false)
  })

  it('should return false when species is not in properties', () => {
    expect(
      isCaterpillarCategory({
        ...mockCaterpillarFeatureGeo[0],
        properties: [{ type: 'tree' }],
      })
    ).toBe(false)
  })
})
