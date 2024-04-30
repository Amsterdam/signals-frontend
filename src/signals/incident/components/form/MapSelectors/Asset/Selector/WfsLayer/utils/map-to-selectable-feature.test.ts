import { mapToSelectableFeature } from './map-to-selectable-feature'
import {
  mockContainerFeatureTypes,
  mockPublicLightsFeatureTypes,
  mockCaterpillarFeatureTypes,
} from './test/mock-feature-types'
import {
  mockContainers,
  mockCaterpillarFeature,
  mockPublicLights,
} from './test/mock-objects'

describe('mapToSelectableFeature', () => {
  it('should map container to a selectable feature', () => {
    const result = mapToSelectableFeature(
      mockContainers[0],
      mockContainerFeatureTypes[1],
      { lat: 52.37585547675836, lng: 4.89321686975306 }
    )

    expect(result).toEqual({
      id: 'PAA00210',
      type: 'Papier',
      description: 'Papier container',
      status: undefined,
      label: 'Papier container - PAA00210',
      coordinates: { lat: 52.37585547675836, lng: 4.89321686975306 },
    })
  })

  it('should map public light to a selectable feature', () => {
    const result = mapToSelectableFeature(
      mockPublicLights[0],
      mockPublicLightsFeatureTypes[0],
      { lat: 52.372935004142086, lng: 4.901763001239158 }
    )

    expect(result).toEqual({
      id: '000067',
      type: '5',
      description: 'Grachtmast',
      status: undefined,
      label: 'Grachtmast - 000067',
      coordinates: { lat: 52.372935004142086, lng: 4.901763001239158 },
    })
  })

  it('should map caterpillar tree to a selectable feature', () => {
    const result = mapToSelectableFeature(
      mockCaterpillarFeature[0],
      mockCaterpillarFeatureTypes[0],
      { lat: 52.38632248, lng: 4.87543579 }
    )

    expect(result).toEqual({
      id: '4108613',
      type: 'Eikenboom',
      description: 'Eikenboom',
      status: undefined,
      label: 'Eikenboom - 4108613',
      coordinates: { lat: 52.38632248, lng: 4.87543579 },
    })
  })
})
