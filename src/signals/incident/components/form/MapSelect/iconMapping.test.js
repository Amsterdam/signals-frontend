// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { OVL_MAPPING, getOVLIcon, LEGEND_ITEMS } from './iconMapping';

describe('getOVLIcon', () => {
  it('should get default icon', () => {
    expect(getOVLIcon('Klok', false)).toBe(OVL_MAPPING.Klok.default);
  });

  it('should get select icon', () => {
    expect(getOVLIcon('Klok', true)).toBe(OVL_MAPPING.Klok.selected);
  });

  it('should default to first icon if missing', () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    expect(getOVLIcon('missing', false)).toBe(OVL_MAPPING.Klok.default);
    expect(global.console.error).toHaveBeenCalledWith('icon missing for type, using default. Type is: missing');
  });

  it('should have matching keys', () => {
    const mappingKeys = Object.keys(OVL_MAPPING).map(key => key.toLowerCase());
    const legendKeys = LEGEND_ITEMS.map(({ key }) => key);

    mappingKeys.forEach(mappingKey => {
      expect(legendKeys.includes(mappingKey));
    });
  });
});
