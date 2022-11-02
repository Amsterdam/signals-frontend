// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { RequestAccess } from './RequestAccess'

describe('RequestAccess', () => {
  it('should render correctly', () => {
    render(withAppContext(<RequestAccess />))

    expect(screen.getByText('Mijn meldingen')).toBeInTheDocument()
    expect(
      screen.getByText(
        'De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een nieuwe bevestigingslink te ontvangen.'
      )
    ).toBeInTheDocument()
  })
})
