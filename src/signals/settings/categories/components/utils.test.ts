// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { StandardText } from 'types/api/standard-texts'
import { StatusCode } from 'types/status-code'

import { getPatchPayload, orderStandardTexts } from './utils'
import type { CategoryFormValues, CategoryFormPayload } from '../types'
import { Direction } from '../types'

const mockFormData: CategoryFormValues = {
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

const mockDirtyFields = {
  name: true,
  note: true,
  n_days: true,
}

const mockMappedData: Partial<CategoryFormPayload> = {
  name: 'Bedrijfsafval',
  new_sla: {
    n_days: 5,
    use_calendar_days: false,
  },
  note: 'Test notitie',
}

describe('utils', () => {
  describe('getPatchPayload', () => {
    it('should map to correct model', () => {
      const result = getPatchPayload(mockFormData, mockDirtyFields)

      expect(result).toEqual(mockMappedData)
    })

    it('should map show_children_in_filter when input changed on main category', () => {
      const mockFormDataMainCategory = {
        ...mockFormData,
        show_children_in_filter: false,
      }
      const mockDirtyFieldsMainCategory = {
        show_children_in_filter: true,
      }

      const result = getPatchPayload(
        mockFormDataMainCategory,
        mockDirtyFieldsMainCategory
      )

      expect(result).toEqual({
        configuration: {
          show_children_in_filter: false,
        },
      })
    })
  })

  describe('orderStandardTexts', () => {
    it('should order standard texts', () => {
      const standardTexts: StandardText[] = [
        {
          active: true,
          id: 1,
          meta: {},
          state: StatusCode.AfgehandeldExtern,
          text: 'A',
          title: 'A',
        },
        {
          active: true,
          id: 2,
          meta: {},
          state: StatusCode.AfgehandeldExtern,
          text: 'B',
          title: 'B',
        },
        {
          active: true,
          id: 3,
          meta: {},
          state: StatusCode.AfgehandeldExtern,
          text: 'C',
          title: 'C',
        },
      ]
      const result = orderStandardTexts(Direction.Up, 1, standardTexts)
      expect(result).toEqual([
        standardTexts[1],
        standardTexts[0],
        standardTexts[2],
      ])

      const result2 = orderStandardTexts(Direction.Down, 1, standardTexts)
      expect(result2).toEqual([
        standardTexts[0],
        standardTexts[2],
        standardTexts[1],
      ])

      const result3 = orderStandardTexts(Direction.Up, 0, standardTexts)
      expect(result3).toEqual(undefined)

      const result4 = orderStandardTexts(Direction.Down, 2, standardTexts)
      expect(result4).toEqual(undefined)
    })
  })
})
