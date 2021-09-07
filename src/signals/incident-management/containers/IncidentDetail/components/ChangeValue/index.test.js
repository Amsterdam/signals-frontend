// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SelectInput from 'signals/incident-management/components/SelectInput'
import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import IncidentDetailContext from '../../context'
import ChangeValue from '.'

const expectInitialState = async () => {
  const editButton = await screen.findByTestId('editMockTypeButton')

  expect(editButton).toBeInTheDocument()
  expect(screen.queryByTestId('changeValueForm')).not.toBeInTheDocument()
}

const expectEditState = async () => {
  const editButton = screen.queryByTestId('editMockTypeButton')

  const changeValueForm = await screen.findByTestId('changeValueForm')

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
  component: SelectInput,
  options: [
    { key: rawKey, value: rawKeyValue, description, icon: 'PriorityHigh' },
    { key: derivedKey, value: derivedKeyValue },
    { key: otherKey, value: otherKeyValue, description: otherDescription },
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
    expect(screen.getByTestId('displayValueIcon')).toBeInTheDocument()
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
    fireEvent.change(document.querySelector('select'), {
      target: { value: otherKey },
    })
    userEvent.click(submitButton)

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

    expect(screen.getByTestId('changeValueForm')).toBeInTheDocument()

    userEvent.click(screen.getByTestId(cancelTestId))

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()
  })

  it('should hide form on ESC', () => {
    render(renderWithContext())
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('changeValueForm')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'ArrowUp', code: 38, keyCode: 38 })

    expect(screen.getByTestId('changeValueForm')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'Escape', code: 13, keyCode: 13 })

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()

    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('changeValueForm')).toBeInTheDocument()

    fireEvent.keyUp(document, { key: 'Esc', code: 13, keyCode: 13 })

    expect(screen.getByTestId(editTestId)).toBeInTheDocument()
  })

  it('should render info text', () => {
    render(renderWithContext({ ...props, infoKey: 'description' }))
    userEvent.click(screen.getByTestId(editTestId))

    expect(screen.getByTestId('infoText')).toBeInTheDocument()
    expect(screen.getByTestId('infoText').textContent).toEqual(description)

    fireEvent.change(document.querySelector('select'), {
      target: { value: derivedKey },
    })

    expect(screen.queryByTestId('infoText')).not.toBeInTheDocument()

    fireEvent.change(document.querySelector('select'), {
      target: { value: otherKey },
    })

    expect(screen.getByTestId('infoText')).toBeInTheDocument()
    expect(screen.getByTestId('infoText').textContent).toEqual(otherDescription)
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
