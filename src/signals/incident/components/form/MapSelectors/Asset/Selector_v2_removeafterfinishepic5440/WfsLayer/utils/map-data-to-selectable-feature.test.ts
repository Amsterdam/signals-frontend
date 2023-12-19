// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { mapDataToSelectableFeature } from './map-data-to-selectable-feature'
import { mockContainerFeatureTypes } from './test/mock-feature-types'
import { mockGlasContainer, mockPaperContainer } from './test/mock-objects'

describe('mapDataToSelectableFeature', () => {
  it('should map data to selectable features correctly', () => {
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
})
