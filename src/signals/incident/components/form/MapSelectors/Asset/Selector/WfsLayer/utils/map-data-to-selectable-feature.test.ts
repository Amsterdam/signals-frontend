import type {
  FeatureStatusType,
  FeatureType,
} from 'signals/incident/components/form/MapSelectors/types'

import { mapDataToSelectableFeature } from './map-data-to-selectable-feature'
import {
  mockContainerFeatureTypes,
  mockPublicLightsFeatureTypes,
  mockCaterpillarFeatureTypes,
  mockPublicLightsFeatureTypesDenHaag,
} from './test/mock-feature-types'
import {
  mockContainers,
  mockCaterpillarFeature,
  mockFeaturesDenHaag,
  mockPublicLights,
} from './test/mock-objects'

const mockFeatureStatusTypes = undefined
describe('mapDataToSelectableFeature', () => {
  it('should map containers to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      mockContainers,
      mockContainerFeatureTypes,
      mockFeatureStatusTypes
    )

    expect(selectableFeatures).toEqual([
      {
        id: 'PAA00210',
        type: 'Papier',
        description: 'Papier container',
        status: undefined,
        label: 'Papier container - PAA00210',
        coordinates: { lat: 52.37585547675836, lng: 4.89321686975306 },
      },
    ])
  })

  it('should map public lights to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      mockPublicLights,
      mockPublicLightsFeatureTypes,
      mockFeatureStatusTypes
    )

    expect(selectableFeatures).toEqual([
      {
        id: '000067',
        type: '4',
        description: 'Overig lichtpunt',
        status: undefined,
        label: 'Overig lichtpunt - 000067',
        coordinates: { lat: 52.372935004142086, lng: 4.901763001239158 },
      },
    ])
  })

  it('should map caterpillar objects to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      mockCaterpillarFeature,
      mockCaterpillarFeatureTypes,
      mockFeatureStatusTypes
    )

    expect(selectableFeatures).toEqual([
      {
        id: '4108613',
        type: 'Eikenboom',
        description: 'Eikenboom',
        status: undefined,
        label: 'Eikenboom - 4108613',
        coordinates: { lat: 52.38632248, lng: 4.87543579 },
      },
      {
        id: '4108614',
        type: 'Eikenboom',
        description: 'Eikenboom',
        status: undefined,
        label: 'Eikenboom - 4108614',
        coordinates: { lat: 52.3863225, lng: 4.8754357 },
      },
    ])
  })

  it('should map features to selectable features correctly with Den Haag light objects', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      mockFeaturesDenHaag,
      mockPublicLightsFeatureTypesDenHaag as FeatureType[],
      []
    )

    expect(selectableFeatures).toEqual([
      {
        id: '230281',
        type: undefined,
        description: 'Lichtpunt Koningskade-0542 ',
        status: undefined,
        label: 'Lichtpunt Koningskade-0542 ',
        coordinates: { lat: 52.08410811, lng: 4.31817273 },
      },
    ])
  })

  it('should create label correctly when description is a template string', () => {
    const mockFeatureTypesWithTemplateString = [
      {
        label: 'Papier',
        description: 'Papier container - {{ id_nummer }}',
        icon: {
          options: {
            className: 'object-marker',
            iconSize: [40, 40],
          },
          iconUrl: '/assets/images/afval/paper.svg',
        },
        idField: 'id_nummer',
        typeField: 'fractie_omschrijving',
        typeValue: 'Papier',
      },
    ] as FeatureStatusType[]

    const selectableFeatures = mapDataToSelectableFeature(
      mockContainers,
      mockFeatureTypesWithTemplateString,
      mockFeatureStatusTypes
    )

    expect(selectableFeatures[0].label).toEqual('Papier container - PAA00210')
  })
})
