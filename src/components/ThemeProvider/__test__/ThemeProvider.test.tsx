// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react';
import { render } from '@testing-library/react';
import { isAuthenticated } from 'shared/services/auth/auth';
import ThemeProvider, { getConfig } from '..';

const mockIsAuthenticated = isAuthenticated as jest.Mock;

jest.mock('shared/services/auth/auth');

describe('<ThemeProvider />', () => {
  describe('rendering', () => {
    it('should render children', () => {
      const { queryByTestId } = render(
        <ThemeProvider><div data-testid="themeProviderChildren"></div></ThemeProvider>
      );

      expect(queryByTestId('themeProviderChildren')).not.toBeNull();
    });

    it('should use theme provider settings for authenticated', () => {
      mockIsAuthenticated.mockImplementation(() => true);
      expect(getConfig()).toEqual({});
    });

    it('should use theme provider settings for not authenticated', () => {
      mockIsAuthenticated.mockImplementation(() => false);
      expect(getConfig()).toEqual({
        maxGridWidth: 960,
        layouts: {
          small: {
            columns: 2,
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
      });
    });
  });
});
