// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import Footer from '..'

jest.mock('shared/services/configuration/configuration')

describe('<FooterContainer />', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  it('should render correctly', () => {
    configuration.links.privacy = 'https://www.amsterdam.nl/privacy/'
    configuration.links.about = 'https://www.amsterdam.nl/overdezesite/'
    configuration.links.accessibility = '/toegankelijkheid/'

    render(withAppContext(<Footer />))
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      configuration.links.privacy
    )
    expect(
      screen.getByRole('link', { name: 'Over deze site' })
    ).toHaveAttribute('href', configuration.links.about)
    expect(
      screen.getByRole('link', { name: 'Toegankelijkheid' })
    ).toHaveAttribute('href', configuration.links.accessibility)
  })
})
