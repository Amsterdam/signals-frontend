// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { constants } from '../charts'
import { getMaxDomain } from './utils'

describe('utils', () =>
  describe('getMaxDomain', () =>
    it('should return a number 20% higher then the highest amount to create white space on top of graph', () => {
      const result = getMaxDomain(constants.mockValues)

      const maxDomain = constants.mockValues[6].amount * 1.2

      expect(result).toEqual(maxDomain)
    })))
