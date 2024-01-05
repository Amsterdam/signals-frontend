// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { formattedDate } from './utils'

describe('utils', () => {
  describe('formattedDate', () => {
    it('should format a date correctly', () => {
      const date = '2020-11-05T13:58:56.917372+00:00'
      expect(formattedDate(date)).toEqual('Gemeld op: 05 november')
    })
  })
})
