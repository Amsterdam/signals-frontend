// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'

import { FrontPageAlert } from './FrontPageAlert'
import configuration from '../../shared/services/configuration/configuration'
import { withAppContext } from '../../test/utils'

jest.mock('shared/services/configuration/configuration')
describe('src/components/FrontPageAlert', () => {
  it('should render correctly', () => {
    const alertText = 'Als dit wordt gerenderd, dan is de test geslaagd'
    configuration.frontPageAlert = {
      text: alertText,
    }
    render(withAppContext(<FrontPageAlert />))
    expect(screen.getByText(alertText)).toBeInTheDocument()
  })
  it('should not render', () => {
    const alertText = ''
    configuration.frontPageAlert = {
      text: alertText,
    }
    render(withAppContext(<FrontPageAlert />))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
