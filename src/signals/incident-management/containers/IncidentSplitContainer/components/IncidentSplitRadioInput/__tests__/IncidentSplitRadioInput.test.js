// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import priorityList from 'signals/incident-management/definitions/priorityList'
import { withAppContext } from 'test/utils'

import IncidentSplitRadioInput from '..'

describe('IncidentSplitRadioInput', () => {
  const props = {
    className: 'foo bar',
    display: 'Urgentie',
    id: 'priority',
    initialValue: 'null',
    name: 'priority',
    onChange: jest.fn(),
    options: priorityList,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render a list of radio buttons', () => {
    render(withAppContext(<IncidentSplitRadioInput {...props} />))

    expect(screen.getAllByRole('radio')).toHaveLength(priorityList.length)
  })

  it('should render a label', () => {
    const { container } = render(
      withAppContext(<IncidentSplitRadioInput {...props} />)
    )

    expect(
      container.querySelectorAll(`label[for="${props.name}"]`)
    ).toHaveLength(1)
  })

  it('should select radio buttons and display info text when available', async () => {
    const { info, value } = priorityList[2]

    render(withAppContext(<IncidentSplitRadioInput {...props} />))

    const radio = screen.getByLabelText(value)
    const infoTextRegex = new RegExp(info)

    expect(radio.checked).toBe(false)
    expect(screen.queryByText(infoTextRegex)).not.toBeInTheDocument()

    userEvent.click(radio)

    expect(radio.checked).toBe(true)
    expect(screen.getByText(infoTextRegex)).toBeInTheDocument()
  })

  it('calls onChange', () => {
    render(withAppContext(<IncidentSplitRadioInput {...props} />))

    const radio = screen.getAllByRole('radio')[1]

    expect(props.onChange).not.toHaveBeenCalled()

    userEvent.click(radio)

    expect(props.onChange).toHaveBeenCalledTimes(1)
  })
})
