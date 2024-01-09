// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getFeatureType } from './get-feature-type'
import { mockContainerFeatureTypes } from './test/mock-feature-types'
import { mockGlasContainer } from './test/mock-objects'

describe('getFeatureType', () => {
  it('should return the correct feature type', () => {
    const result = getFeatureType(mockGlasContainer, mockContainerFeatureTypes)

    expect(result).toEqual(mockContainerFeatureTypes[2])
  })
})
