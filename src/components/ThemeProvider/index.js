import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as ASCThemeProvider } from '@datapunt/asc-ui';

export const amsterdamThemeCfg = {
  maxGridWidth: 960,
  layouts: {
    small: {
      columns: 2,
      gutter: 20,
      margin: 10,
      max: 540,
    },
    medium: {
      columns: 2,
      gutter: 20,
      margin: 10,
      min: 540,
      max: 1024,
    },
    big: {
      columns: 12,
      gutter: 20,
      margin: 10,
      min: 1024,
      max: 1200,
    },
    large: {
      columns: 12,
      gutter: 20,
      margin: 10,
      min: 1200,
      max: 1430,
    },
    xLarge: {
      columns: 12,
      gutter: 20,
      margin: 10,
      min: 1430,
    },
  },
  colors: {
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
    }
  }
};

const ThemeProvider = ({ children }) => (
  <ASCThemeProvider overrides={amsterdamThemeCfg}>
    <Fragment>
      <span data-testid="signalsThemeProvider" />
      {children}
    </Fragment>
  </ASCThemeProvider>
);

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
