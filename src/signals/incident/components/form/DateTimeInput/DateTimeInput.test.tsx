// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'
import type { FormOptions } from 'types/reactive-form'

import type { DateTimeProps } from './DateTime'
import DateTimeInput from './DateTimeInput'

const updateIncident = jest.fn()

const props = {
  hasError: () => false,
  meta: {
    isVisible: true,
    timeSelectorDisabled: false,
  },
  parent: {
    meta: {
      updateIncident,
    },
  },
  getError: () => {},
  validatorsOrOpts: [] as FormOptions,
  value: 239472934872,
}

const DateTimeMock: FC<DateTimeProps> = ({ onUpdate, value }) => (
  <>
    <span data-testid="date-time">{value}</span>
    <button
      type="button"
      data-testid="call-update"
      onClick={() => onUpdate(value)}
    />
  </>
)

jest.mock('./DateTime', () => DateTimeMock)

describe('DateTimeInput', () => {
  it('does not render when isVisible is falsy', () => {
    const notVisible = {
      ...props,
      meta: {
        isVisible: false,
      },
    }

    render(withAppContext(<DateTimeInput {...notVisible} />))

    expect(screen.queryByTestId('date-time')).not.toBeInTheDocument()
  })

  it('renders', () => {
    render(withAppContext(<DateTimeInput {...props} />))

    expect(screen.getByTestId('date-time')).toBeInTheDocument()
  })

  it('calls updateIncident', () => {
    const customValue = {
      ...props,
      value: 1234567890,
    }

    expect(updateIncident).not.toHaveBeenCalled()

    render(withAppContext(<DateTimeInput {...customValue} />))

    userEvent.click(screen.getByTestId('call-update'))

    expect(updateIncident).toHaveBeenCalledWith({ dateTime: customValue.value })
  })
})
