// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { ThemeProvider as ASCThemeProvider } from '@amsterdam/asc-ui'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import type { Theme } from 'types/theme'
import type { RecursivePartial } from 'types/helpers'

export const getConfig: (theme?: RecursivePartial<Theme>) => Theme = (
  defaultConfig = {}
) => {
  const config = { ...defaultConfig }

  if (!getIsAuthenticated()) {
    config.maxGridWidth = 960
    config.layouts = {
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
    }
  }

  return config as Theme
}

const ThemeProvider: FunctionComponent = ({ children }) => (
  <ASCThemeProvider
    overrides={getConfig(
      (configuration as Partial<{ theme?: RecursivePartial<Theme> }>).theme
    )}
  >
    {children}
  </ASCThemeProvider>
)

export default ThemeProvider
