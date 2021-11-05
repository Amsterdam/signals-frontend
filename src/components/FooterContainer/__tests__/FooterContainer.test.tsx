// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
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

    const { container, getByTestId } = render(withAppContext(<Footer />))

    expect(container.querySelector('div.no-print')).toBeInTheDocument()
    expect(getByTestId('disclaimer')).toBeInTheDocument()
    expect(
      container.querySelector('a[href="https://www.amsterdam.nl/privacy/"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        'a[href="https://www.amsterdam.nl/overdezesite/"]'
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector('a[href="/toegankelijkheid/"]')
    ).toBeInTheDocument()
  })
})
