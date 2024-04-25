import { mapCaterpillarFeatures } from './map-caterpillar-features'
import { mockCaterpillar } from './test/mock-objects'

describe('mapDataToSelectableFeature', () => {
  it('should return an array of SelectableFeature', () => {
    const result = mapCaterpillarFeatures({ features: mockCaterpillar })

    expect(result).toEqual({
      features: [
        {
          id: 4108613,
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [52.38632248, 4.87543579] },
          properties: {
            species: 'Quercus robur',
            type: 'Eikenboom',
            id: 4108613,
          },
        },
        {
          id: 4108614,
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [52.3863225, 4.8754357] },
          properties: {
            '0': {
              species: 'Quercus robur',
              type: 'Eikenboom',
              id: 4108614,
            },
            id: 4108614,
            type: 'Eikenboom',
          },
        },
      ],
    })
  })
})
