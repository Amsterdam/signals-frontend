// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { mapDataToSelectableFeature } from './map-data-to-selectable-feature'
import {
  mockContainerFeatureTypes,
  mockPublicLightsFeatureTypes,
  mockCaterpillarFeatureTypes,
} from './test/mock-feature-types'
import {
  mockGlasContainer,
  mockPaperContainer,
  mockPublicLight,
  mockCaterpillar,
} from './test/mock-objects'

describe('mapDataToSelectableFeature', () => {
  it('should map container features to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      [mockGlasContainer, mockPaperContainer],
      mockContainerFeatureTypes
    )

    expect(selectableFeatures).toEqual([
      {
        coordinates: { lat: 52.37209240253326, lng: 4.900003434199737 },
        description: 'Glas container',
        id: 'GLA00144',
        label: 'Glas container - GLA00144',
        type: 'Glas',
      },
      {
        coordinates: { lat: 52.37210126045667, lng: 4.900010236862614 },
        description: 'Papier container',
        id: 'PAA00092',
        label: 'Papier container - PAA00092',
        type: 'Papier',
      },
    ])
  })

  it('should map public lights features to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      [mockPublicLight],
      mockPublicLightsFeatureTypes
    )

    expect(selectableFeatures).toEqual([
      {
        coordinates: { lat: 52.372935004142086, lng: 4.901763001239158 },
        description: 'Overig lichtpunt',
        id: '000067',
        label: 'Overig lichtpunt - 000067',
        type: '4',
      },
    ])
  })

  it('should map caterpillar features to selectable features correctly', () => {
    const selectableFeatures = mapDataToSelectableFeature(
      [mockCaterpillar],
      mockCaterpillarFeatureTypes
    )

    expect(selectableFeatures).toEqual([
      {
        id: 4108613,
        type: 'Eikenboom',
        description: 'Eikenboom',
        coordinates: { lat: 52.38632248, lng: 4.87543579 },
        label: 'Eikenboom - 4108613',
      },
    ])
  })
})
