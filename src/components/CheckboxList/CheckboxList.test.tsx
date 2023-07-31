// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { act, render, screen, waitFor } from '@testing-library/react'
import 'jest-styled-components'
import userEvent from '@testing-library/user-event'

import statuses from 'signals/incident-management/definitions/statusList'
import { withAppContext } from 'test/utils'
import { StatusCode } from 'types/status-code'
import categories from 'utils/__tests__/fixtures/categories.json'

import CheckboxList from './index'
import priorityList from '../../signals/incident-management/definitions/priorityList'

describe('signals/incident-management/components/CheckboxList', () => {
  it('should render a title ', () => {
    const title = 'This is my title'
    const { rerender } = render(
      withAppContext(<CheckboxList name="status" options={statuses} />)
    )

    expect(screen.queryByText(title)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList name="status" options={statuses} title={title} />
      )
    )

    expect(screen.queryByText(title)).toBeInTheDocument()

    // should also cover nodes instead of just text
    const anotherTitle = 'Another title'
    rerender(
      withAppContext(
        <CheckboxList
          name="status"
          options={statuses}
          title={
            <p>
              <span>{anotherTitle}</span>
            </p>
          }
        />
      )
    )

    expect(screen.queryByText(anotherTitle)).toBeInTheDocument()
  })

  it('should render a toggle', () => {
    const toggleAllLabel = 'Toggle all'
    const { rerender } = render(
      withAppContext(
        <CheckboxList
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
        />
      )
    )

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList
          hasToggle
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
        />
      )
    )

    expect(screen.queryByText(toggleAllLabel)).toBeInTheDocument()
  })

  it('should render a toggle checkbox', () => {
    const groupName = 'fooBarBaz'
    const name = 'status'
    const { rerender } = render(
      withAppContext(
        <CheckboxList
          hasToggle
          name={name}
          options={statuses}
          toggleAllLabel="Toggle all"
        />
      )
    )

    expect(screen.queryByLabelText('Toggle all')).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList
          groupName={groupName}
          hasToggle
          name={name}
          options={statuses}
          toggleAllLabel="Toggle all"
        />
      )
    )

    expect(screen.queryByLabelText('Toggle all')).toBeInTheDocument()

    // giving the group checkbox a name that is different from its children
    const groupValue = 'groupValue'
    rerender(
      withAppContext(
        <CheckboxList
          groupName={groupName}
          groupValue={groupValue}
          hasToggle
          name={name}
          options={statuses}
          toggleAllLabel="Toggle all"
        />
      )
    )

    expect(screen.getByLabelText('Toggle all')).toHaveAttribute(
      'value',
      groupValue
    )
  })

  it('should render a list of checkboxes ', () => {
    const name = 'status'
    const numOptions = 5
    const truncated = statuses.slice(0, numOptions)

    render(withAppContext(<CheckboxList name={name} options={truncated} />))

    const allBoxes = screen.getAllByRole('checkbox')

    expect(allBoxes).toHaveLength(numOptions)

    allBoxes.forEach((el) => {
      // eslint-disable-next-line
      // @ts-ignore
      expect(el.name).toEqual(name)
    })
  })

  it('should render topics if there are any', function () {
    const statusesWithTopic = statuses.map((item, index) => {
      if (index < priorityList.length - 1) {
        return { ...item, topic: 'topic1' }
      }
      return { ...item, topic: 'topic2' }
    })

    render(
      withAppContext(
        <CheckboxList name="topic checkboxes" options={statusesWithTopic} />
      )
    )
    const selector1 = screen.getAllByText('topic1')
    const selector2 = screen.getAllByText('topic2')

    expect(selector1).toHaveLength(1)
    expect(selector2).toHaveLength(1)
  })

  it('should check all boxes when group is checked', () => {
    const groupId = StatusCode.Afgehandeld
    const toggleAllLabel = 'Zork'
    const toggleNothingLabel = 'Dungeon'
    const { rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={[
            {
              key: groupId,
              value: 'barfoofoo',
              email_sent_when_set: true,
              shows_remaining_sla_days: true,
            },
          ]}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList
          defaultValue={statuses}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
  })

  it('should set toggled when all boxes are checked', async () => {
    const onToggleMock = jest.fn()
    const groupId = 'barbazbaz'
    const toggleAllLabel = 'Select all'
    const toggleNothingLabel = 'Select none'
    render(
      withAppContext(
        <CheckboxList
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          onToggle={onToggleMock}
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(onToggleMock).not.toHaveBeenCalled()

    const checkboxes = screen.getAllByRole('checkbox')

    // loop over all checkboxes but one and check them manually
    checkboxes.slice(1).forEach((checkbox) => {
      userEvent.click(checkbox)
    })

    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()

    userEvent.click(checkboxes[0])

    expect(onToggleMock).toHaveBeenCalledTimes(1)

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
  })

  it('should update correctly when defaultValue prop value changes', () => {
    const groupId = 'barbazbaz'
    const toggleAllLabel = 'Select everything!!!!'
    const toggleNothingLabel = 'Deselect all'

    const { rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={statuses}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList
          defaultValue={[]}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
  })

  it('should handle toggle', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    render(
      withAppContext(
        <CheckboxList
          hasToggle
          name="status"
          onToggle={() => {}}
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)

    userEvent.click(screen.getByText(toggleAllLabel))

    // verify that the toggle has the correct label
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(
      statuses.length
    )
    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()

    userEvent.click(screen.getByText(toggleNothingLabel))

    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)
    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
  })

  describe('toggle all from keyboard', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    const onSubmitMock = jest.fn()

    beforeEach(() => {
      render(
        withAppContext(
          <CheckboxList
            hasToggle
            name="status"
            onToggle={() => {}}
            onSubmit={onSubmitMock}
            options={statuses}
            toggleAllLabel={toggleAllLabel}
            toggleNothingLabel={toggleNothingLabel}
          />
        )
      )

      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(
        0
      )
    })

    afterEach(() => {
      onSubmitMock.mockReset()
    })

    it('should ignore unknown keys', () => {
      // The state of the checkboxes should not change
      userEvent.tab()
      userEvent.keyboard('[ArrowDown]')

      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(
        0
      )
    })

    it('should select all checkboxes on space', () => {
      userEvent.tab()
      userEvent.keyboard('[Space]')

      expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(
        statuses.length
      )
      expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
      expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
    })

    it('should deselect all checkboxes on space', () => {
      // Space selects all checkboxes
      userEvent.tab()
      userEvent.keyboard('[Space]')

      expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(
        statuses.length
      )
      expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
      expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()

      // Space unselects all checkboxes
      userEvent.keyboard('[Space]')
      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(
        0
      )
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    })

    it('should submit on Enter', () => {
      expect(onSubmitMock).not.toHaveBeenCalled()

      userEvent.tab()
      userEvent.keyboard('[Enter]')
      expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(
        0
      )
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(onSubmitMock).toHaveBeenCalled()
    })
  })

  it('should handle change', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    render(
      withAppContext(
        <CheckboxList
          hasToggle
          name="status"
          onToggle={() => {}}
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    userEvent.click(screen.getByText(toggleAllLabel))

    const randomOption = Math.floor(Math.random() * statuses.length)
    const randomCheckbox = screen.getAllByRole('checkbox', { checked: true })[
      randomOption
    ]

    expect(randomCheckbox).toBeChecked()

    // uncheck one of the checkboxes
    userEvent.click(randomCheckbox)

    expect(randomCheckbox).not.toBeChecked()

    expect(document.activeElement).toBe(randomCheckbox)

    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()

    // check the unchecked box; all boxes should be checked and the correct toggle labels
    // should be applied
    userEvent.click(randomCheckbox)

    expect(randomCheckbox).toBeChecked()

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
  })

  it('should give preference to slugs over keys for checkbox values from the incoming data', () => {
    const options = categories.mainToSub.afval
    const slugs = options.map(({ slug }) => slug)
    const { rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={options.slice(0, 2)}
          name="afval"
          options={options}
        />
      )
    )

    screen.getAllByRole('checkbox').forEach((element) => {
      // eslint-disable-next-line
      // @ts-ignore
      expect(slugs.includes(element.value)).toEqual(true)
    })

    const keys = statuses.map(({ key }) => key)

    rerender(
      withAppContext(
        <CheckboxList
          defaultValue={statuses.slice(0, 2)}
          name="status"
          options={statuses}
        />
      )
    )

    screen.getAllByRole('checkbox').forEach((element) => {
      // eslint-disable-next-line
      // @ts-ignore
      expect(keys.includes(element.value)).toEqual(true)
    })
  })

  it('should apply boxWrapperKeyPrefix prop value', () => {
    const boxWrapperKeyPrefix = 'FooBar'
    const options = categories.mainToSub.afval
    const { container } = render(
      withAppContext(
        <CheckboxList
          boxWrapperKeyPrefix={boxWrapperKeyPrefix}
          defaultValue={options.slice(0, 2)}
          name="afval"
          options={options}
        />
      )
    )

    const prefixedElements = container.querySelectorAll(
      `[id^="${boxWrapperKeyPrefix}"]`
    )

    expect(prefixedElements.length).toBeGreaterThan(1)
  })

  it('should render checkboxes as disabled elements', () => {
    const groupId = 'zoek'

    const { container, rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={statuses}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
        />
      )
    )

    expect(
      container.querySelectorAll('input[type=checkbox][disabled]')
    ).toHaveLength(0)

    const disabledValues = statuses.map((status) => ({
      ...status,
      disabled: true,
    }))

    rerender(
      withAppContext(
        <CheckboxList
          defaultValue={disabledValues}
          groupId={groupId}
          groupName="statuses"
          hasToggle
          name="status"
          options={statuses}
        />
      )
    )

    expect(
      container.querySelectorAll('input[type=checkbox][disabled]')
    ).toHaveLength(statuses.length)
  })

  it('should fire the right amount of events with onToggle set and unset', () => {
    jest.useFakeTimers()
    const onChangeMock = jest.fn()
    const onToggleMock = jest.fn()

    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'

    const { container, rerender } = render(
      withAppContext(
        <CheckboxList
          name="status"
          onChange={onChangeMock}
          onToggle={onToggleMock}
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    jest.runOnlyPendingTimers()

    expect(onChangeMock).not.toHaveBeenCalled()
    expect(onToggleMock).not.toHaveBeenCalled()

    for (const checkbox of container
      .querySelectorAll('input[type="checkbox"]')
      .values()) {
      act(() => {
        userEvent.click(checkbox)
      })
    }

    jest.runOnlyPendingTimers()

    // since the onToggle prop has been defined it should call it
    // when all the checkboxes have been selected
    expect(onChangeMock).toHaveBeenCalledTimes(statuses.length - 1)
    expect(onToggleMock).toHaveBeenCalledTimes(1)

    onToggleMock.mockClear()
    onChangeMock.mockClear()

    rerender(
      withAppContext(
        <CheckboxList
          hasToggle
          name="status"
          onChange={onChangeMock}
          options={statuses}
          toggleAllLabel={toggleAllLabel}
          toggleNothingLabel={toggleNothingLabel}
        />
      )
    )

    expect(onToggleMock).not.toHaveBeenCalled()

    for (const checkbox of container
      .querySelectorAll('input[type="checkbox"]')
      .values()) {
      act(() => {
        userEvent.click(checkbox)
      })
    }

    jest.runAllTimers()

    // since the onToggle prop has not been defined it should call the onChange event
    // on every checkbox selection
    expect(onToggleMock).not.toHaveBeenCalled()
    expect(onChangeMock).toHaveBeenCalledTimes(statuses.length)
  })

  it('should render a textArea when the checkbox has an open_answer', async () => {
    const ktoQuestions = [
      {
        is_satisfied: true,
        key: 'key-2',
        open_answer: false,
        topic: null,
        value: 'Het probleem is helemaal opgelost.',
      },
      {
        is_satisfied: true,
        key: 'key-3',
        open_answer: true,
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

    const formValidation = {
      errors: {},
      trigger: jest.fn(),
      setValue: jest.fn(),
      register: jest.fn(),
    }

    render(
      withAppContext(
        <CheckboxList<any>
          name="ktoQuestions"
          options={ktoQuestions}
          formValidation={formValidation}
        />
      )
    )

    const checkbox = screen.getByRole('checkbox', {
      name: 'Het probleem is snel opgelost.',
    })
    userEvent.click(checkbox)

    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })

    expect(screen.getAllByRole('textbox')).toHaveLength(1)

    const checkboxTwo = screen.getByRole('checkbox', {
      name: 'Het probleem is niet opgelost maar ik heb daar begrip voor.',
    })

    userEvent.click(checkboxTwo)

    await waitFor(() => {
      expect(checkboxTwo).toBeChecked()
    })

    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })
})
