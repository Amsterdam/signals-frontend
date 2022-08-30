// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { MutableRefObject } from 'react'
import { render, screen } from '@testing-library/react'
import type { Props } from '../Notification'
import { Notification } from '../Notification'

const mockReference = {
  current: (
    <div className="styled__StyledNotification-sc-ec9twe-6 iAjqyD">
      <div
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className="sc-fxNMLY juYqYr"
      >
        <div className="sc-gYhhMS jzkyiQ">
          Helaas is de combinatie van deze filters te groot. Maak een kleinere
          selectie.
        </div>
      </div>
    </div>
  ),
} as unknown as MutableRefObject<HTMLDivElement>

const defaultProps: Props = {
  reference: mockReference,
}

describe('Notification', () => {
  it('should render a notification and scroll into view', () => {
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn()
    render(<Notification {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      global.window.HTMLElement.prototype.scrollIntoView
    ).toHaveBeenCalled()
  })
})
