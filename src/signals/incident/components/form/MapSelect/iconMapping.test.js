import { OVL_MAPPING, getOVLIcon } from './iconMapping';

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
});
