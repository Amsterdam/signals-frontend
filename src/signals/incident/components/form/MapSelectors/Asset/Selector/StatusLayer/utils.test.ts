// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/eikenprocessierups'
import type {
  FeatureStatusType,
  Meta,
} from 'signals/incident/components/form/MapSelectors/types'
import { FeatureStatus } from 'signals/incident/components/form/MapSelectors/types'
import { getFeatureStatusType } from './utils'

const typedMeta = controls.extra_eikenprocessierups.meta as unknown as Meta

describe('utils', () => {
  const featureStatusTypes = typedMeta.featureStatusTypes || []
  const reportedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === FeatureStatus.REPORTED
  )
  const checkedFeatureType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === FeatureStatus.CHECKED
  )

  describe('getFeatureStatusType', () => {
    it('should return if the feature has been reported or not', () => {
      const reportedFeature = caterpillarsJson.features[1]
      const unreportedFeature = caterpillarsJson.features[0]
      const checkedFeature = caterpillarsJson.features[2]
      expect(getFeatureStatusType(reportedFeature, featureStatusTypes)).toEqual(
        reportedFeatureType
      )
      expect(getFeatureStatusType(checkedFeature, featureStatusTypes)).toEqual(
        checkedFeatureType
      )
      expect(
        getFeatureStatusType(unreportedFeature, featureStatusTypes)
      ).toBeUndefined()
    })

    it('should return if feature or featureStatusTypes is undefined', () => {
      const feature = undefined
      const noFeatureStatusTypes: FeatureStatusType[] = []
      expect(getFeatureStatusType(feature, featureStatusTypes)).toEqual(
        undefined
      )
      expect(getFeatureStatusType(feature, noFeatureStatusTypes)).toEqual(
        undefined
      )
    })
  })
})
