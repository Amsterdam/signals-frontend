// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import Description, { RECEIVE_FEEDBACK } from '../Description'

describe('Description', () => {
  it('should render when feedback is provided', () => {
    const description =
      'Ja, de melder is tevreden\nWaarom: omdat... \nToestemming contact opnemen: Ja'

    render(
      withAppContext(
        <Description what={RECEIVE_FEEDBACK} description={description} />
      )
    )
    expect(screen.getByText('Tevreden')).toBeInTheDocument()
    expect(
      screen.queryByText('Ja, de melder is tevreden', { exact: false })
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('Waarom: omdat... ', { exact: false })
    ).toBeInTheDocument()
  })

  it('should render when an update status is provided', () => {
    const description = 'Incident afgehandeld\nWaarom: omdat... \n'

    render(withAppContext(<Description description={description} />))
    expect(
      screen.getByText('Waarom: omdat...', { exact: false })
    ).toBeInTheDocument()
  })
})
