// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getObjectType } from './get-object-type'
import {
  mockGlasContainer,
  mockPublicLight,
  mockCaterpillar,
} from './test/mock-objects'
import { FeatureTypes } from '../../../../../../form/MapSelectors/types'

describe('getObjectType', () => {
  it('should return container type', () => {
    const result = getObjectType([mockGlasContainer])

    expect(result).toEqual(FeatureTypes.CONTAINER)
  })

  it('should return public lights type', () => {
    const result = getObjectType([mockPublicLight])

    expect(result).toEqual(FeatureTypes.PUBLIC_LIGHTS)
  })

  it('should return caterpillar type', () => {
    const result = getObjectType([mockCaterpillar])

    expect(result).toEqual(FeatureTypes.CATERPILLAR)
  })

  it('should return caterpillar type when properties is an array with species', () => {
    const caterpillarWithArrayProperties = {
      ...mockCaterpillar,
      properties: [mockCaterpillar.properties],
    }

    const result = getObjectType([caterpillarWithArrayProperties])

    expect(result).toEqual(FeatureTypes.CATERPILLAR)
  })
})
