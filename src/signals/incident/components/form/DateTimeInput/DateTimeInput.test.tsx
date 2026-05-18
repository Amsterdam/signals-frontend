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
    name: 'dateTime',
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
        ...props.meta,
        isVisible: false,
      },
    }

    render(withAppContext(<DateTimeInput {...notVisible} />))

    expect(screen.queryByTestId('date-time')).not.toBeInTheDocument()
  })

  it('does not render without a name', () => {
    const noName = {
      ...props,
      meta: {
        isVisible: true,
      },
    }

    render(withAppContext(<DateTimeInput {...noName} />))

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

  it('updates incident under the field name from meta', () => {
    updateIncident.mockClear()

    const customName = {
      ...props,
      meta: {
        ...props.meta,
        name: 'leegstand_dateTime',
      },
      value: 1234567890,
    }

    render(withAppContext(<DateTimeInput {...customName} />))

    userEvent.click(screen.getByTestId('call-update'))

    expect(updateIncident).toHaveBeenCalledWith({
      leegstand_dateTime: customName.value,
    })
  })
})
