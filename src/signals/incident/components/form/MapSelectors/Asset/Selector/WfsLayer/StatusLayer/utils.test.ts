// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/openbaarGroenEnWater'
import type { Meta } from 'signals/incident/components/form/MapSelectors/types'
import { getFeatureStatusType } from './utils'

const typedMeta = controls.extra_eikenprocessierups.meta as unknown as Meta

describe('utils', () => {
  const featureStatusTypes = typedMeta.featureStatusTypes || []
  const reportedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === 'reported'
  )
  const checkedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === 'checked'
  )

  describe('getFeatureStatusType', () => {
    it('should return if the feature has been reported or not', () => {
      const reportedFeature = caterpillarsJson.features[1]
      const unreportedFeature = caterpillarsJson.features[0]
      const checkedFeature = caterpillarsJson.features[2]
      expect(
        getFeatureStatusType(reportedFeature as Feature, featureStatusTypes)
      ).toEqual(reportedFeatureType)
      expect(
        getFeatureStatusType(checkedFeature as Feature, featureStatusTypes)
      ).toEqual(checkedFeatureType)
      expect(
        getFeatureStatusType(unreportedFeature as Feature, featureStatusTypes)
      ).toBeUndefined()
    })
  })
})
