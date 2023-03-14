// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { act, render, screen } from '@testing-library/react'

import { FrontPageAlert } from './FrontPageAlert'
import configuration from '../../shared/services/configuration/configuration'
import { history, withAppContext } from '../../test/utils'

jest.mock('shared/services/configuration/configuration')

describe('src/components/FrontPageAlert', () => {
  it('should render correctly, when on wizard-step-1 page and with alertText', () => {
    const alertText = 'Als dit wordt gerenderd, dan is de test geslaagd'
    configuration.frontPageAlert = { text: alertText }

    const { rerender } = render(withAppContext(<FrontPageAlert />))

    act(() => {
      history.push('/incident/beschrijf')
    })

    rerender(withAppContext(<FrontPageAlert />))

    expect(screen.getByText(alertText)).toBeInTheDocument()
  })

  it('should not render, when not on wizard-step-1 page and no alertText', () => {
    const alertText = ''
    configuration.frontPageAlert = { text: alertText }

    const { rerender } = render(withAppContext(<FrontPageAlert />))

    act(() => {
      history.push('/incident/vulaan')
    })

    rerender(withAppContext(<FrontPageAlert />))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should not render when not on wizard-step-1 page', () => {
    const alertText = 'testing testing'
    configuration.frontPageAlert = {
      text: alertText,
    }
    const { rerender } = render(withAppContext(<FrontPageAlert />))
    act(() => {
      history.push('/incident/vulaan')
    })
    rerender(withAppContext(<FrontPageAlert />))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should not render when there is no alertText', () => {
    const alertText = ''
    configuration.frontPageAlert = {
      text: alertText,
    }
    const { rerender } = render(withAppContext(<FrontPageAlert />))
    act(() => {
      history.push('/incident/beschrijf')
    })
    rerender(withAppContext(<FrontPageAlert />))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
