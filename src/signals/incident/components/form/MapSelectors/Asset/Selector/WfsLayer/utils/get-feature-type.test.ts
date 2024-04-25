// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getFeatureType } from './get-feature-type'
import {
  mockContainerFeatureTypes,
  mockCaterpillarFeatureTypes,
} from './test/mock-feature-types'
import { mockContainers, mockCaterpillar } from './test/mock-objects'

describe('getFeatureType', () => {
  it('should return the container feature type', () => {
    const result = getFeatureType(mockContainers[0], mockContainerFeatureTypes)

    expect(result).toEqual(mockContainerFeatureTypes[1])
  })

  it('should return the caterpillar feature type', () => {
    const result = getFeatureType(
      mockCaterpillar[0],
      mockCaterpillarFeatureTypes
    )

    expect(result).toEqual(mockCaterpillarFeatureTypes[0])
  })
})
