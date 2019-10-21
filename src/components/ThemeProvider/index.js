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
