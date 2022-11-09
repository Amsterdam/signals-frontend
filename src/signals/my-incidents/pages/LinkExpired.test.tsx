// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { LinkExpired } from './LinkExpired'

describe('LinkExpired', () => {
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
})
