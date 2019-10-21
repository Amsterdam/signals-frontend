const colors = {
  primary: {
    main: '#004699',
    dark: '#00387a',
  },
  secondary: {
    main: '#ec0000',
    dark: '#bc0000',
  },
  tint: {
    level1: '#ffffff',
    level2: '#f5f5f5',
    level3: '#e6e6e6',
    level4: '#b4b4b4',
    level5: '#767676',
    level6: '#323232',
    level7: '#000000',
  },
  support: {
    valid: '#00a03c',
    invalid: '#ec0000',
    focus: '#fec813',
  },
  bright: {
    main: '#ffffff',
  },
  error: {
    main: '#ec0000',
  },
};

const themeColor = (primay, secondary) => {
  if (colors && colors[primay] && colors[primay][secondary]) {
    return colors[primay][secondary];
  }

  return null;
};

export default themeColor;
