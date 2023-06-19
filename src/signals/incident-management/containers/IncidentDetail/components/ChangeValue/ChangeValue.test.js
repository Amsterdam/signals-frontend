// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import ChangeValue from '.'
import SelectInputSearch from '../../../../components/SelectInputSearch'
import IncidentDetailContext from '../../context'

const expectInitialState = async () => {
  const editButton = await screen.findByTestId('editMockTypeButton')

  expect(editButton).toBeInTheDocument()
  expect(screen.queryByTestId('change-value-form')).not.toBeInTheDocument()
}

const expectEditState = async () => {
  const editButton = screen.queryByTestId('editMockTypeButton')

  const changeValueForm = await screen.findByTestId('change-value-form')

  expect(editButton).not.toBeInTheDocument()
  expect(changeValueForm).toBeInTheDocument()
}

const rawKey = 'rawKey'
const rawKeyValue = 'rawKeyValue'
const description = 'description'
const derivedKey = 'derivedKey'
const derivedKeyValue = 'derivedKeyValue'
const otherKey = 'otherKey'
const otherKeyValue = 'otherKeyValue'
const otherDescription = 'otherDescription'

const props = {
  component: SelectInputSearch,
  options: [
    {
      key: rawKey,
      value: rawKeyValue,
      description,
      icon: 'PriorityHigh',
      group: 'group1',
    },
    { key: derivedKey, value: derivedKeyValue, group: 'group2' },
    {
      key: otherKey,
      value: otherKeyValue,
      description: otherDescription,
      group: 'group2',
    },
  ],
  groups: [
    {
      value: 'group1',
      name: 'group1',
    },
    {
      value: 'group2',
      name: 'group2',
    },
  ],
  display: 'De letter',
  path: 'value.path',
  sort: false,
  type: 'mockType',
}

const update = jest.fn()
const incidentData = {
  ...incidentFixture,
  someValue: otherKey,
  value: { path: rawKey },
}

const renderWithContext = (componentProps = props, incident = incidentData) =>
  withAppContext(
    <IncidentDetailContext.Provider
      value={{
        incident,
        update,
        nonExistingValue: 'nonExistingValue',
      }}
    >
      <ChangeValue {...componentProps} />
    </IncidentDetailContext.Provider>
  )

describe('ChangeValue', () => {
  // data-testid attributes are generated dynamically
  const editTestId = `edit${props.type
    .charAt(0)
    .toUpperCase()}${props.type.slice(1)}Button`
  const submitTestId = `submit${props.type
    .charAt(0)
    .toUpperCase()}${props.type.slice(1)}Button`
  const cancelTestId = `cancel${props.type
    .charAt(0)
    .toUpperCase()}${props.type.slice(1)}Button`

  beforeEach(() => {
    update.mockReset()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render initial state and edit state', async () => {
    const renderProps = render(renderWithContext())

    await expectInitialState()

    userEvent.click(renderProps.getByTestId(editTestId))

    await expectEditState()
  })

  it('should render the selected value', () => {
    render(renderWithContext())
    expect(screen.getByText(rawKeyValue)).toBeInTheDocument()
    expect(screen.getByTestId('display-value-icon')).toBeInTheDocument()
  })

  it('should work with a valuePath', () => {
    render(
      renderWithContext({
        ...props,
        infoKey: 'description',
        valuePath: 'someValue',
      })
    )
    expect(screen.getByText(otherKeyValue)).toBeInTheDocument()
  })

  it('should indicate when the selected option does not exist', () => {
    const [, ...options] = props.options
    render(
      renderWithContext({
        ...props,
        options,
      })
    )

    expect(screen.getByText('Niet gevonden')).toBeInTheDocument()
  })

  it('should not show any value when no option selected', () => {
    render(
      renderWithContext({
        ...props,
        path: 'otherPath',
      })
    )

    expect(screen.queryByText(rawKeyValue)).not.toBeInTheDocument()
    expect(screen.queryByText(derivedKeyValue)).not.toBeInTheDocument()
    expect(screen.queryByText(otherKeyValue)).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))
    userEvent.click(screen.getByTestId(submitTestId))

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {},
    })
  })

  it('should render all options', () => {
    render(renderWithContext())

    expect(
      screen.queryByRole('option', { name: rawKeyValue })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: derivedKeyValue })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: otherKeyValue })
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))

    userEvent.click(screen.getByRole('combobox'))

    expect(
      screen.getByRole('option', { name: rawKeyValue })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: derivedKeyValue })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: otherKeyValue })
    ).toBeInTheDocument()
  })

  it('should call update', () => {
    render(renderWithContext())
    const editButton = screen.getByTestId(editTestId)
    userEvent.click(editButton)

    expect(update).not.toHaveBeenCalled()

    const submitButton = screen.getByTestId(submitTestId)

    userEvent.click(screen.getByRole('combobox'))

    userEvent.click(screen.getByText('otherKeyValue'))

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: otherKey },
    })

    act(() => {
      userEvent.click(submitButton)
    })

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        value: {
          path: otherKey,
        },
      },
    })
  })

  it('should call update with extra props', () => {
    render(renderWithContext({ ...props, patch: { extraProp: true } }))
    const editButton = screen.getByTestId(editTestId)
    userEvent.click(editButton)

    const submitButton = screen.getByTestId(submitTestId)

    userEvent.click(submitButton)

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        value: {
          path: rawKey,
        },
        extraProp: true,
      },
    })
  })

  it('should hide form on cancel', () => {
    render(renderWithContext())
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('change-value-form')).toBeInTheDocument()

    userEvent.click(screen.getByTestId(cancelTestId))

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()
  })

  it('should hide form on ESC', () => {
    render(renderWithContext())

    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('change-value-form')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'ArrowUp', code: 38, keyCode: 38 })

    expect(screen.getByTestId('change-value-form')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 })

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('change-value-form')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 })

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()
  })

  it('should render info text', () => {
    render(renderWithContext({ ...props, infoKey: 'description' }))
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('info-text')).toBeInTheDocument()
    expect(screen.getByTestId('info-text').textContent).toEqual(description)

    userEvent.click(screen.getByRole('combobox'))

    userEvent.click(screen.getByText(derivedKeyValue))

    expect(screen.queryByTestId('info-text')).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('combobox'))

    userEvent.click(screen.getByText(otherKeyValue))

    expect(screen.getByTestId('info-text')).toBeInTheDocument()
    expect(screen.getByTestId('info-text').textContent).toEqual(
      otherDescription
    )
  })

  it('should not render info text when no option for selected value', () => {
    render(
      renderWithContext({
        ...props,
        path: 'nonExistingValue',
        infoKey: 'description',
      })
    )
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.queryByTestId('infoText')).not.toBeInTheDocument()
  })

  it('should render disabled edit button', () => {
    render(renderWithContext({ ...props, disabled: true }))
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()
  })

  it('should work with a falsy key', () => {
    const nullValue = 'nullValue'
    render(
      renderWithContext({
        ...props,
        options: [
          {
            key: null,
            value: nullValue,
          },
          ...props.options,
        ],
        path: 'otherPath',
      })
    )

    expect(screen.getByText(nullValue)).toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))
    userEvent.click(screen.getByTestId(submitTestId))

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        otherPath: null,
      },
    })
  })

  it('should allow custom logic to convert raw data to a key', () => {
    const rawDataToKey = jest.fn().mockReturnValue(derivedKey)
    render(renderWithContext({ ...props, rawDataToKey }))

    expect(screen.getByText(derivedKeyValue)).toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))
    userEvent.click(screen.getByTestId(submitTestId))

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        value: {
          path: derivedKey,
        },
      },
    })
  })

  it('should allow custom logic to convert a key to raw data', () => {
    const keyToRawData = jest.fn().mockReturnValue(derivedKey)
    render(renderWithContext({ ...props, keyToRawData }))

    expect(screen.getByText(rawKeyValue)).toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))
    userEvent.click(screen.getByTestId(submitTestId))

    expect(update).toHaveBeenCalledWith({
      type: props.type,
      patch: {
        value: {
          path: derivedKey,
        },
      },
    })
  })

  it('should set value class', () => {
    const valueClass = 'valueClass'
    render(renderWithContext({ ...props, valueClass }))

    expect(screen.getByTestId('meta-list-mockType-value').className).toBe(
      valueClass
    )
  })

  it('should reset the edit state when the incident is changed', async () => {
    const renderProps = render(renderWithContext())

    await expectInitialState()

    userEvent.click(renderProps.getByTestId(editTestId))

    await expectEditState()

    renderProps.rerender(
      renderWithContext(props, { ...incidentData, id: incidentData.id + 1 })
    )
    await expectInitialState()
  })
})
