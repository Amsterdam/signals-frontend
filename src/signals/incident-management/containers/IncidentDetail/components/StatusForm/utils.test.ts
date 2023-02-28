// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import { StatusCode } from 'signals/incident-management/definitions/types'

import { emailSentWhenStatusChangedTo } from './utils'

jest.mock('shared/services/configuration/configuration')

describe('utils', () => {
  // This utils tests were never written and therefore are incomplete. Out of scope to write them all now.

  describe('emailSentWhenStatusChangedTo', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return true when status change form Verzoek tot Heropenen naar Afgehandeld in new kto process', () => {
      configuration.featureFlags.reporterMailHandledNegativeContactEnabled =
        true
      const params = {
        toStatus: StatusCode.Afgehandeld,
        fromStatus: StatusCode.VerzoekTotHeropenen,
        isSplitIncident: false,
      }

      const result = emailSentWhenStatusChangedTo(params)

      expect(result).toEqual(true)
    })

    it('should return false when status change form Verzoek tot Heropenen naar Afgehandeld in old kto process', () => {
      configuration.featureFlags.reporterMailHandledNegativeContactEnabled =
        false
      const params = {
        toStatus: StatusCode.Afgehandeld,
        fromStatus: StatusCode.VerzoekTotHeropenen,
        isSplitIncident: false,
      }

      const result = emailSentWhenStatusChangedTo(params)

      expect(result).toEqual(false)
    })
  })
})
