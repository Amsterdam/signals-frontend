// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { formatDate } from '../utils'

describe('utils', () => {
  describe('formatDate', () => {
    it('should format a date correctly', () => {
      expect(formatDate(new Date(1627639862532))).toEqual(
        '30 juli 2021, 12.11 uur'
      )
    })
  })
})
