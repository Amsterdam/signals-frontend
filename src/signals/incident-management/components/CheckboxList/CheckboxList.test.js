// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { act, fireEvent, render, screen } from '@testing-library/react'
import 'jest-styled-components'
import cloneDeep from 'lodash.clonedeep'

import { withAppContext } from 'test/utils'
import statuses from 'signals/incident-management/definitions/statusList'
import categories from 'utils/__tests__/fixtures/categories.json'

import CheckboxList from '.'

describe('signals/incident-management/components/CheckboxList', () => {
  it('should render a title ', () => {
    const title = 'This is my title'
    const { queryByText, rerender } = render(
      withAppContext(<CheckboxList name="status" options={statuses} />)
    )

    expect(queryByText(title)).not.toBeInTheDocument()

    rerender(
      withAppContext(
        <CheckboxList name="status" options={statuses} title={title} />
      )
    )

    expect(queryByText(title)).toBeInTheDocument()

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

    expect(queryByText(anotherTitle)).toBeInTheDocument()
  })

  it('should render a toggle', () => {
    const toggleAllLabel = 'Toggle all'
    const { queryByText, rerender } = render(
      withAppContext(
        <CheckboxList
          name="status"
          options={statuses}
          toggleAllLabel={toggleAllLabel}
        />
      )
    )

    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()

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

    expect(queryByText(toggleAllLabel)).toBeInTheDocument()
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

    const { rerender } = render(
      withAppContext(<CheckboxList name={name} options={truncated} />)
    )

    const allBoxes = document.querySelectorAll('input[type="checkbox"]')

    expect(allBoxes).toHaveLength(numOptions)

    allBoxes.forEach((el) => {
      expect(el.name).toEqual(name)
    })

    // options without required props should not be rendered
    const invalidOptionsCount = 5
    const cloned = cloneDeep(statuses)
    const optionsWithoutRequiredProps = cloned.map((status, index) => {
      if (index >= invalidOptionsCount) {
        return status
      }

      return { ...status, id: undefined, key: undefined }
    })

    global.console.error = jest.fn()

    expect(global.console.error).not.toHaveBeenCalled()

    rerender(
      withAppContext(
        <CheckboxList name={name} options={optionsWithoutRequiredProps} />
      )
    )

    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      statuses.length - invalidOptionsCount
    )

    expect(global.console.error).toHaveBeenCalled()

    global.console.error.mockRestore()
  })

  it('should check all boxes when group is checked', () => {
    const groupId = 'qux'
    const toggleAllLabel = 'Zork'
    const toggleNothingLabel = 'Dungeon'
    const { rerender, getByText, queryByText } = render(
      withAppContext(
        <CheckboxList
          defaultValue={[
            {
              key: groupId,
              value: 'barfoofoo',
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

    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(getByText(toggleNothingLabel)).toBeInTheDocument()

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

    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(getByText(toggleNothingLabel)).toBeInTheDocument()
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
      act(() => {
        fireEvent.click(checkbox)
      })
    })

    expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
    expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(checkboxes[0])
    })

    expect(onToggleMock).toHaveBeenCalledTimes(1)

    expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
  })

  it('should update correctly when defaultValue prop value changes', () => {
    const groupId = 'barbazbaz'
    const toggleAllLabel = 'Select everything!!!!'
    const toggleNothingLabel = 'Deselect all'

    const { rerender, getByText, queryByText } = render(
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

    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(getByText(toggleNothingLabel)).toBeInTheDocument()

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

    expect(queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    expect(getByText(toggleAllLabel)).toBeInTheDocument()
  })

  it('should handle toggle', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    const { container, getByText, queryByText } = render(
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

    expect(getByText(toggleAllLabel)).toBeInTheDocument()
    expect(queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    expect(
      container.querySelectorAll('input[type="checkbox"]:checked')
    ).toHaveLength(0)

    act(() => {
      fireEvent.click(getByText(toggleAllLabel))
    })

    // verify that the toggle has the correct label
    expect(
      container.querySelectorAll('input[type="checkbox"]:checked')
    ).toHaveLength(statuses.length)
    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(getByText(toggleNothingLabel)).toBeInTheDocument()

    act(() => {
      fireEvent.click(getByText(toggleNothingLabel))
    })

    expect(
      container.querySelectorAll('input[type="checkbox"]:checked')
    ).toHaveLength(0)
    expect(getByText(toggleAllLabel)).toBeInTheDocument()
    expect(queryByText(toggleNothingLabel)).not.toBeInTheDocument()
  })

  describe('toggle all from keyboard', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    const onSubmitMock = jest.fn()
    let container

    beforeEach(() => {
      const checkboxList = render(
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

      container = checkboxList.container
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(0)
    })

    afterEach(() => {
      onSubmitMock.mockReset()
    })

    it('should ignore unknown keys', () => {
      const element = screen.getByText(toggleAllLabel)
      // The state of the checkboxes should not change
      fireEvent.keyDown(element, { key: 'ArrowDown' })
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(0)
    })

    it('should select all checkboxes on space', () => {
      const element = screen.getByText(toggleAllLabel)

      // Space selects all checkboxes
      fireEvent.keyDown(element, { key: ' ' })
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(statuses.length)
      expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
      expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()
    })

    it('should deselect all checkboxes on space', () => {
      const element = screen.getByText(toggleAllLabel)

      // Space selects all checkboxes
      fireEvent.keyDown(element, { key: ' ' })
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(statuses.length)
      expect(screen.queryByText(toggleAllLabel)).not.toBeInTheDocument()
      expect(screen.getByText(toggleNothingLabel)).toBeInTheDocument()

      // Space unselects all checkboxes
      fireEvent.keyDown(element, { key: ' ' })
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(0)
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
    })

    it('should submit on Enter', () => {
      const element = screen.getByText(toggleAllLabel)

      expect(onSubmitMock).not.toHaveBeenCalled()
      fireEvent.keyDown(element, { key: 'Enter' })
      expect(
        container.querySelectorAll('input[type="checkbox"]:checked')
      ).toHaveLength(0)
      expect(screen.getByText(toggleAllLabel)).toBeInTheDocument()
      expect(screen.queryByText(toggleNothingLabel)).not.toBeInTheDocument()
      expect(onSubmitMock).toHaveBeenCalled()
    })
  })

  it('should handle change', () => {
    const toggleAllLabel = 'Click here to select all'
    const toggleNothingLabel = 'Click here to undo selection'
    const { container, getByText, queryByText } = render(
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

    act(() => {
      fireEvent.click(getByText(toggleAllLabel))
    })

    const randomOption = Math.floor(Math.random() * statuses.length)
    const randomCheckbox = container.querySelectorAll(
      'input[type="checkbox"]:checked'
    )[randomOption]

    expect(randomCheckbox.checked).toEqual(true)

    // uncheck one of the checkboxes
    act(() => {
      fireEvent.click(randomCheckbox)
    })

    expect(randomCheckbox.checked).toEqual(false)

    expect(document.activeElement).toBe(randomCheckbox)

    expect(getByText(toggleAllLabel)).toBeInTheDocument()
    expect(queryByText(toggleNothingLabel)).not.toBeInTheDocument()

    // check the unchecked box; all boxes should be checked and the correct toggle labels
    // should be applied
    act(() => {
      fireEvent.click(randomCheckbox)
    })

    expect(randomCheckbox.checked).toEqual(true)

    expect(queryByText(toggleAllLabel)).not.toBeInTheDocument()
    expect(getByText(toggleNothingLabel)).toBeInTheDocument()
  })

  it('should give preference to slugs over keys for checkbox values from the incoming data', () => {
    const options = categories.mainToSub.afval
    const slugs = options.map(({ slug }) => slug)
    const { container, rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={options.slice(0, 2)}
          name="afval"
          options={options}
        />
      )
    )

    container.querySelectorAll('input[type="checkbox"]').forEach((element) => {
      return expect(slugs.includes(element.value))
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

    container.querySelectorAll('input[type="checkbox"]').forEach((element) => {
      return expect(keys.includes(element.value))
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
        fireEvent.click(checkbox)
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
        fireEvent.click(checkbox)
      })
    }

    jest.runAllTimers()

    // since the onToggle prop has not been defined it should call the onChange event
    // on every checkbox selection
    expect(onToggleMock).not.toHaveBeenCalled()
    expect(onChangeMock).toHaveBeenCalledTimes(statuses.length)
  })
})
