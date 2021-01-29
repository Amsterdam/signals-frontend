import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as ASCThemeProvider } from '@amsterdam/asc-ui';

import { isAuthenticated } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';

export const getConfig = (defaultConfig = {}) => {
  const config = { ...defaultConfig };
  if (!isAuthenticated()) {
    config.maxGridWidth = 960;
    config.layouts = {
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
    };
  }

  return config;
};

const ThemeProvider = ({ children }) => {
  const { theme } = configuration;
  return (
    <ASCThemeProvider overrides={getConfig(theme)}>
      <Fragment>
        <span data-testid="signalsThemeProvider" />
        {children}
      </Fragment>
    </ASCThemeProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
