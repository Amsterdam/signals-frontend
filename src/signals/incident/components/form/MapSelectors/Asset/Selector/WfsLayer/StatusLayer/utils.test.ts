// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import type {
  CheckedFeatureType,
  Feature,
  ReportedFeatureType,
} from 'signals/incident/components/form/MapSelectors/types'
import { meta } from 'utils/__tests__/fixtures/caterpillarsSelection'
import {
  getCheckedFeatureType,
  getIsChecked,
  getIsReported,
  getReportedFeatureType,
} from './utils'

describe('utils', () => {
  const reportedFeatureType = meta.featureTypes[1] as ReportedFeatureType
  const checkedFeatureType = meta.featureTypes[2] as CheckedFeatureType

  describe('getIsReported', () => {
    it('should return if the feature has been reported or not', () => {
      const reportedFeature = caterpillarsJson.features[1]
      const unreportedFeature = caterpillarsJson.features[0]
      expect(
        getIsReported(
          reportedFeature as unknown as Feature,
          reportedFeatureType
        )
      ).toBeTruthy()
      expect(
        getIsReported(
          unreportedFeature as unknown as Feature,
          reportedFeatureType
        )
      ).toBeFalsy()
      expect(
        getIsReported(reportedFeature as unknown as Feature, undefined)
      ).toBeFalsy()
      expect(getIsReported(undefined, reportedFeatureType)).toBeFalsy()
    })
  })

  describe('getIsChecked', () => {
    it('should return if the feature has been checked or not', () => {
      const checkedFeature = caterpillarsJson.features[2]
      const uncheckedFeature = caterpillarsJson.features[0]

      expect(
        getIsChecked(checkedFeature as unknown as Feature, checkedFeatureType)
      ).toBeTruthy()
      expect(
        getIsChecked(uncheckedFeature as unknown as Feature, checkedFeatureType)
      ).toBeFalsy()
      expect(getIsChecked(undefined, checkedFeatureType)).toBeFalsy()
      expect(
        getIsChecked(checkedFeature as unknown as Feature, undefined)
      ).toBeFalsy()
    })
  })

  describe('getReportedFeatureType', () => {
    it('should return the reportedFeatureType when there is one', () => {
      const otherFeatureTypes = [meta.featureTypes[0]]

      expect(getReportedFeatureType(meta.featureTypes)).toEqual(
        reportedFeatureType
      )
      expect(getReportedFeatureType(otherFeatureTypes)).toEqual(undefined)
    })
  })

  describe('getCheckedFeatureType', () => {
    it('should return the checkedFeatureType when there is one', () => {
      const otherFeatureTypes = [meta.featureTypes[0]]

      expect(getCheckedFeatureType(meta.featureTypes)).toEqual(
        checkedFeatureType
      )
      expect(getCheckedFeatureType(otherFeatureTypes)).toEqual(undefined)
    })
  })
})
