// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

    expect(
      screen.queryByTestId('radio-buttonlist-title')
    ).not.toBeInTheDocument()

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

    expect(screen.queryByTestId('radio-buttonlist-title')).toBeInTheDocument()
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
    const priorityListWithTopics = priorityList.map((item, index) => {
      if (index < priorityList.length - 1) {
        return { ...item, topic: 'topic1' }
      }
      return { ...item, topic: 'topic2' }
    })

    render(
      withAppContext(
        <RadioButtonList
          options={priorityListWithTopics}
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

  it('should render a textArea when the radiobutton has an open_answer', async () => {
    const ktoQuestions = [
      {
        is_satisfied: true,
        key: 'key-2',
        open_answer: true,
        topic: null,
        value: 'Het probleem is helemaal opgelost.',
      },
      {
        is_satisfied: true,
        key: 'key-3',
        open_answer: false,
        topic: null,
        value: 'Het probleem is snel opgelost.',
      },
      {
        is_satisfied: true,
        key: 'key-4',
        open_answer: true,
        topic: null,
        value: 'Het probleem is niet opgelost maar ik heb daar begrip voor.',
      },
    ]

    const onChange = jest.fn()

    const groupName = 'priority'

    const formValidation = {
      errors: {},
      trigger: jest.fn(),
      setValue: jest.fn(),
      register: jest.fn(),
      selectedRadioButton: ktoQuestions[0].value,
    }

    render(
      withAppContext(
        <RadioButtonList
          options={ktoQuestions}
          groupName={groupName}
          onChange={onChange}
          formValidation={formValidation}
        />
      )
    )

    const radioButton = screen.getByRole('radio', {
      name: 'Het probleem is snel opgelost.',
    })
    userEvent.click(radioButton)

    await waitFor(() => {
      expect(radioButton).toBeChecked()
    })

    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })
})
