// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { OVL_MAPPING, getOVLIcon, LEGEND_ITEMS } from './iconMapping'

const KLOK = 1

describe('getOVLIcon', () => {
  it('should get default icon', () => {
    expect(getOVLIcon(KLOK, false)).toBe(OVL_MAPPING[KLOK].default)
  })

  it('should get select icon', () => {
    expect(getOVLIcon(KLOK, true)).toBe(OVL_MAPPING[KLOK].selected)
  })

  it('should default to first icon if missing', () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {})
    expect(getOVLIcon('missing', false)).toBe(OVL_MAPPING[KLOK].default)
    expect(global.console.error).toHaveBeenCalledWith(
      'icon missing for type, using default. Type is: missing'
    )
  })

  it('should have matching keys', () => {
    const mappingKeys = Object.keys(OVL_MAPPING).map((key) => key.toLowerCase())
    const legendKeys = LEGEND_ITEMS.map(({ key }) => key)

    mappingKeys.forEach((mappingKey) => {
      return expect(legendKeys.includes(mappingKey))
    })
  })
})
