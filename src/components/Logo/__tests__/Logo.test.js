// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render } from '@testing-library/react'
import { ascDefaultTheme } from '@amsterdam/asc-ui'

import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import 'jest-styled-components'

import Logo from '..'

jest.mock('shared/services/configuration/configuration')

describe('components/Logo', () => {
  beforeEach(() => {
    configuration.logo = {
      width: '80px',
      height: '80px',
      smallWidth: '20%',
      smallHeight: '40%',
    }
  })

  afterEach(() => {
    configuration.__reset()
  })

  it('should render correctly', () => {
    const { container, getByTestId } = render(withAppContext(<Logo />))
    const media = `screen and ${ascDefaultTheme.breakpoints.tabletS(
      'max-width'
    )}`

    expect(
      container.querySelector(`a[href="${configuration.links.home}"]`)
    ).toBeInTheDocument()

    expect(getByTestId('logo-link')).toHaveStyleRule(
      'height',
      configuration.logo.height
    )
    expect(getByTestId('logo-link')).toHaveStyleRule(
      'width',
      configuration.logo.width
    )
    expect(getByTestId('logo-link')).toHaveStyleRule(
      'width',
      configuration.logo.smallWidth,
      {
        media,
      }
    )
    expect(getByTestId('logo-link')).toHaveStyleRule(
      'height',
      configuration.logo.smallHeight,
      {
        media,
      }
    )

    expect(getByTestId('logo')).toHaveStyleRule(
      'height',
      configuration.logo.height
    )
    expect(getByTestId('logo')).toHaveStyleRule(
      'width',
      configuration.logo.width
    )
    expect(getByTestId('logo')).toHaveStyleRule(
      'width',
      configuration.logo.smallWidth,
      {
        media,
      }
    )
    expect(getByTestId('logo')).toHaveStyleRule(
      'height',
      configuration.logo.smallHeight,
      {
        media,
      }
    )
  })

  it('should render differently when not tall', () => {
    const { container, getByTestId } = render(
      withAppContext(<Logo tall={false} />)
    )
    const media = `screen and ${ascDefaultTheme.breakpoints.tabletS(
      'max-width'
    )}`

    expect(container.querySelector('a[href="/"]')).toBeInTheDocument()

    expect(getByTestId('logo-link')).toHaveStyleRule(
      'height',
      configuration.logo.smallHeight
    )
    expect(getByTestId('logo-link')).toHaveStyleRule(
      'width',
      configuration.logo.smallWidth
    )
    expect(getByTestId('logo-link')).not.toHaveStyleRule(
      'width',
      configuration.logo.smallWidth,
      {
        media,
      }
    )
    expect(getByTestId('logo-link')).not.toHaveStyleRule(
      'height',
      configuration.logo.smallHeight,
      {
        media,
      }
    )

    expect(getByTestId('logo')).toHaveStyleRule(
      'height',
      configuration.logo.smallHeight
    )
    expect(getByTestId('logo')).toHaveStyleRule(
      'width',
      configuration.logo.smallWidth
    )
    expect(getByTestId('logo')).not.toHaveStyleRule(
      'width',
      configuration.logo.smallWidth,
      {
        media,
      }
    )
    expect(getByTestId('logo')).not.toHaveStyleRule(
      'height',
      configuration.logo.smallHeight,
      {
        media,
      }
    )
  })

  it('should render extra props', () => {
    const customTitle = 'Custom title'
    const { getByTitle } = render(withAppContext(<Logo title={customTitle} />))
    expect(getByTitle(customTitle)).toBeInTheDocument()
  })
})
