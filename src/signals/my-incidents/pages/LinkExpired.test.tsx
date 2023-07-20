// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { withAppContext } from 'test/utils'

import { LinkExpired } from './LinkExpired'

const navigateSpy = jest.fn()

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

describe('LinkExpired', () => {
  beforeEach(() => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => navigateSpy)
  })

  it('should render correctly', () => {
    render(withAppContext(<LinkExpired />))

    expect(screen.getByText('Link verlopen')).toBeInTheDocument()
    expect(
      screen.getByText(
        'De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een nieuwe bevestigingslink te ontvangen.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Begin opnieuw' })
    ).toBeInTheDocument()
  })

  it('should navigate to request access page when button is clicked', async () => {
    render(withAppContext(<LinkExpired />))

    const button = screen.getByRole('button', { name: 'Begin opnieuw' })
    button.click()
    expect(navigateSpy).toHaveBeenCalledTimes(1)
  })
})
