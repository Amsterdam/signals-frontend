import { UNREGISTERED_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

import { mapCaterpillarFeatures } from './map-caterpillar-features'
import { mockCaterpillarFeatureGeo } from './test/mock-objects'

describe('mapDataToSelectableFeature', () => {
  it('should return an array of SelectableFeature', () => {
    const result = mapCaterpillarFeatures({
      features: mockCaterpillarFeatureGeo,
    })

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
            species: 'Quercus robur',
            type: 'Eikenboom',
            id: 4108614,
          },
        },
      ],
    })
  })

  it('should not map when type property already exists', () => {
    const result = mapCaterpillarFeatures({
      features: [
        {
          id: 4108613,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [52.38632248, 4.87543579],
          },
          properties: {
            species: 'Quercus robur',
            id: 4108613,
            type: UNREGISTERED_TYPE,
          },
        },
      ],
    })

    expect(result).toEqual({
      features: [
        {
          geometry: { coordinates: [52.38632248, 4.87543579], type: 'Point' },
          id: 4108613,
          properties: {
            id: 4108613,
            species: 'Quercus robur',
            type: 'not-on-map',
          },
          type: 'Feature',
        },
      ],
    })
  })
})
