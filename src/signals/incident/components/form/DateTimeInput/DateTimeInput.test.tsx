// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'

import type { FC } from 'react'
import type { DateTimeProps } from './DateTime'

import DateTimeInput from './DateTimeInput'

const updateIncident = jest.fn()

const props = {
  hasError: () => false,
  meta: {
    isVisible: true,
  },
  parent: {
    meta: {
      updateIncident,
    },
  },
  getError: () => {},
  validatorsOrOpts: [],
  value: 239472934872,
}

const DateTimeMock: FC<DateTimeProps> = ({ onUpdate, value }) => (
  <>
    <span data-testid="dateTime">{value}</span>
    <button
      type="button"
      data-testid="callUpdate"
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

    expect(screen.queryByTestId('dateTime')).not.toBeInTheDocument()
  })

  it('renders', () => {
    render(withAppContext(<DateTimeInput {...props} />))

    expect(screen.getByTestId('dateTime')).toBeInTheDocument()
  })

  it('calls updateIncident', () => {
    const customValue = {
      ...props,
      value: 1234567890,
    }

    expect(updateIncident).not.toHaveBeenCalled()

    render(withAppContext(<DateTimeInput {...customValue} />))

    userEvent.click(screen.getByTestId('callUpdate'))

    expect(updateIncident).toHaveBeenCalledWith({ dateTime: customValue.value })
  })
})
