/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2021 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import MapCloseButton from '..'

describe('<MapCloseButton />', () => {
  it('Renders a clickable button', () => {
    const clickSpy = jest.fn()

    render(<MapCloseButton onClick={clickSpy} />)

    userEvent.click(screen.getByRole('button'))

    expect(clickSpy).toHaveBeenCalled()
  })
})
