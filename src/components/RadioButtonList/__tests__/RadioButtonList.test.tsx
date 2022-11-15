// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import priorityList from 'signals/incident-management/definitions/priorityList'
import { withAppContext } from 'test/utils'

import RadioButtonList from '..'

describe('signals/incident-management/components/RadioButtonList', () => {
  it('should render a title', () => {
    const { rerender } = render(
      withAppContext(
        <RadioButtonList options={priorityList} groupName="priority" />
      )
    )

    expect(screen.queryByTestId('radioButtonListTitle')).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <RadioButtonList
          options={priorityList}
          groupName="priority"
          title="Here be dragons"
          onChange={() => {}}
        />
      )
    )

    expect(screen.queryByTestId('radioButtonListTitle')).toBeInTheDocument()
  })

  it('should render empty selection button', () => {
    const { rerender } = render(
      withAppContext(
        <RadioButtonList
          options={priorityList}
          groupName="priority"
          onChange={() => {}}
        />
      )
    )

    expect(screen.getAllByRole('radio')).toHaveLength(priorityList.length + 1)

    rerender(
      withAppContext(
        <RadioButtonList
          options={priorityList}
          groupName="priority"
          hasEmptySelectionButton={false}
          onChange={() => {}}
        />
      )
    )

    expect(screen.getAllByRole('radio')).toHaveLength(priorityList.length)
  })

  it('should render topics if there are any', function () {
    render(
      withAppContext(
        <RadioButtonList
          options={priorityList}
          groupName="priority"
          hasEmptySelectionButton={false}
          onChange={() => {}}
        />
      )
    )
    const selector1 = screen.getAllByText('topic1')
    const selector2 = screen.getAllByText('topic2')

    expect(selector1).toHaveLength(1)
    expect(selector2).toHaveLength(1)
  })

  it('should call onChange', () => {
    const onChange = jest.fn()

    const groupName = 'priority'

    render(
      withAppContext(
        <RadioButtonList
          options={priorityList}
          groupName={groupName}
          onChange={onChange}
        />
      )
    )

    expect(onChange).not.toHaveBeenCalled()

    const firstOption = priorityList[0]
    const radio = screen.getByTestId(`${groupName}-${firstOption.key}`)

    act(() => {
      fireEvent.click(radio)
    })

    expect(onChange).toHaveBeenCalledWith(groupName, firstOption)
  })
})
