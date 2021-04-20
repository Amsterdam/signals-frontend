// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import priorityList from 'signals/incident-management/definitions/priorityList'

import IncidentSplitRadioInput from '..'

describe('IncidentSplitRadioInput', () => {
  const props = {
    name: 'priority',
    display: 'Urgentie',
    id: 'priority',
    initialValue: 'null',
    options: priorityList,
    register: jest.fn(),
  }

  it('should render a list of radio buttons', () => {
    const { container } = render(
      withAppContext(<IncidentSplitRadioInput {...props} />)
    )

    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(
      priorityList.length
    )
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
    const { getByLabelText, getByText, queryByText } = render(
      withAppContext(<IncidentSplitRadioInput {...props} />)
    )
    const radio = getByLabelText(value)
    const infoTextRegex = new RegExp(info)

    expect(radio.checked).toBe(false)
    expect(queryByText(infoTextRegex)).not.toBeInTheDocument()

    fireEvent.click(radio)

    expect(radio.checked).toBe(true)
    expect(getByText(infoTextRegex)).toBeInTheDocument()
  })
})
