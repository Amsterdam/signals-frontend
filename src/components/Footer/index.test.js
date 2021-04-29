// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import Footer from '.'

jest.mock('shared/services/configuration/configuration')

describe('<Footer />', () => {
  afterEach(() => {
    configuration.__reset()
  })

  it('should render correctly', () => {
    configuration.links.privacy = 'https://www.amsterdam.nl/privacy/'
    const { container, getByTestId } = render(withAppContext(<Footer />))

    expect(container.querySelector('div.no-print')).toBeInTheDocument()
    expect(getByTestId('disclaimer')).toBeInTheDocument()
    expect(
      container.querySelector('a[href="https://www.amsterdam.nl/privacy/"]')
    ).toBeInTheDocument()
  })
})
