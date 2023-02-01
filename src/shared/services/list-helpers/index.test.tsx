// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { Icon } from 'signals/incident-management/definitions/listIcons'
import listIcons from 'signals/incident-management/definitions/listIcons'

import { getListValueByKey, getListIconByKey } from './list-helpers'

describe('The list helper service', () => {
  const list = [
    {
      key: '',
      value: 'null',
    },
    {
      key: 'A',
      value: 'Centrum',
    },
    {
      key: 'B',
      value: 'Westpoort',
    },
    {
      key: 'E',
      value: 'West',
    },
    {
      key: 'M',
      value: 'Oost',
    },
    {
      key: 'N',
      value: 'Noord',
    },
    {
      key: 'T',
      value: 'Zuidoost',
    },
    {
      key: 'K',
      value: 'Zuid',
    },
    {
      key: 'F',
      value: 'Nieuw-West',
      icon: 'PriorityHigh' as Icon,
    },
  ]

  describe('getListValueByKey', () => {
    it('by default should return false', () => {
      expect(getListValueByKey()).toEqual(false)
    })

    it('should return the correct value when it exists', () => {
      expect(getListValueByKey(list, 'M')).toEqual('Oost')
      expect(getListValueByKey(list, 'F')).toEqual('Nieuw-West')
    })

    it('should return not found value when it does not exist', () => {
      expect(getListValueByKey(list, 'NOT_FOUND')).toEqual('Niet gevonden')
    })

    it('should be able to handle null keys with a falsy key parameter', () => {
      expect(getListValueByKey(list)).toEqual('null')
      expect(getListValueByKey(list, '')).toEqual('null')
    })
  })

  describe('getListIconByKey', () => {
    it('returns undefined when list has no icon for given key', () => {
      expect(getListIconByKey(list, 'foo')).toBeNull()
      expect(getListIconByKey(list, '')).toBeNull()
    })

    it('returns the correct icon when it exists', () => {
      expect(getListIconByKey(list, 'F')).toBe(listIcons.PriorityHigh)
    })
  })
})
