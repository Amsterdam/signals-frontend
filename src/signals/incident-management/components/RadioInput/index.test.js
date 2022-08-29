// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import priorityList from 'signals/incident-management/definitions/priorityList'

import RadioInput from '.'

describe('<RadioInput />', () => {
  const props = {
    name: 'priority',
    display: 'Urgentie',
    values: priorityList,
  }

  it('should render a list of radio buttons', () => {
    const { container } = render(withAppContext(<RadioInput {...props} />))

    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(
      priorityList.length
    )
  })

  it('should display info text', () => {
    const currentValue = priorityList[0]
    const { getByText } = render(
      withAppContext(<RadioInput {...props} value={currentValue.key} />)
    )

    expect(getByText(new RegExp(currentValue.info))).toBeInTheDocument()
  })

  it('should not display info text', () => {
    const currentValue = priorityList[0]
    const props = {
      name: 'priority',
      display: 'Urgentie',
    }

    const { queryByText } = render(
      withAppContext(<RadioInput {...props} value={currentValue.key} />)
    )

    expect(queryByText(new RegExp(currentValue.info))).not.toBeInTheDocument()
  })

  it('should display a label', () => {
    const { container, rerender } = render(
      withAppContext(<RadioInput {...props} />)
    )

    expect(
      container.querySelectorAll(`label[for="form${props.name}"]`)
    ).toHaveLength(1)

    const propsWithoutDisplay = { ...props, display: undefined }
    rerender(withAppContext(<RadioInput {...propsWithoutDisplay} />))

    expect(
      container.querySelectorAll(`label[for="form${props.name}"]`)
    ).toHaveLength(0)
  })
})
