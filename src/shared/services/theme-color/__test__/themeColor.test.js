import themeColor from '../';

describe('The theme color service', () => {
  it('should get all colors', () => {
    expect(themeColor('primary', 'main')).toBe('#004699');
    expect(themeColor('primary', 'dark')).toBe('#00387a');

    expect(themeColor('secondary', 'main')).toBe('#ec0000');
    expect(themeColor('secondary', 'dark')).toBe('#bc0000');

    expect(themeColor('tint', 'level1')).toBe('#ffffff');
    expect(themeColor('tint', 'level2')).toBe('#f5f5f5');
    expect(themeColor('tint', 'level3')).toBe('#e6e6e6');
    expect(themeColor('tint', 'level4')).toBe('#b4b4b4');
    expect(themeColor('tint', 'level5')).toBe('#767676');
    expect(themeColor('tint', 'level6')).toBe('#323232');
    expect(themeColor('tint', 'level7')).toBe('#000000');

    expect(themeColor('support', 'valid')).toBe('#00a03c');
    expect(themeColor('support', 'invalid')).toBe('#ec0000');
    expect(themeColor('support', 'focus')).toBe('#fec813');

    expect(themeColor('bright', 'main')).toBe('#ffffff');

    expect(themeColor('error', 'main')).toBe('#ec0000');

    expect(themeColor('non', 'existing')).toBeNull();
    expect(themeColor('non-existing')).toBeNull();
  });
});
