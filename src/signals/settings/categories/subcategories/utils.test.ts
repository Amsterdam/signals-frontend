// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getTransformedData } from './utils'

const mockFormData = {
  description: 'Afval van een bedrijf en andere gebouwen en dingen',
  handling_message:
    'We laten u binnen 5 dagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
  is_active: 'true',
  is_public_accessible: false,
  name: 'Bedrijfsafval',
  public_name: 'Bedrijfsafval',
  note: 'Test notitie',
  n_days: 5,
  use_calendar_days: 1,
}

const mockTransformedData = {
  name: 'Bedrijfsafval',
  is_active: 'true',
  description: 'Afval van een bedrijf en andere gebouwen en dingen',
  handling_message:
    'We laten u binnen 5 dagen weten wat we hebben gedaan. En anders hoort u wanneer wij uw melding kunnen oppakken.\nWe houden u op de hoogte via e-mail.',
  new_sla: {
    n_days: 5,
    use_calendar_days: true,
  },
  note: 'Test notitie',
  is_public_accessible: false,
  public_name: 'Bedrijfsafval',
}

describe('utils', () => {
  describe('getTransformedData', () => {
    it('should map to correct model', () => {
      const result = getTransformedData(mockFormData)

      expect(result).toEqual(mockTransformedData)
    })
  })

  describe('isEqual', () => {
    it('should return true when equal', () => {})
    it('should return false when not equal', () => {})
  })
})
