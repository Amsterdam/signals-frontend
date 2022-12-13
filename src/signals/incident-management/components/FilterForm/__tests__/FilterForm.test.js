// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { fireEvent, render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { INPUT_DELAY } from 'components/AutoSuggest'
import * as appSelectors from 'containers/App/selectors'
import * as departmentsSelectors from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import dataLists from 'signals/incident-management/definitions'
import kindList from 'signals/incident-management/definitions/kindList'
import priorityList from 'signals/incident-management/definitions/priorityList'
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList'
import statusList from 'signals/incident-management/definitions/statusList'
import typesList from 'signals/incident-management/definitions/typesList'
import { store, withAppContext } from 'test/utils'
import autocompleteUsernames from 'utils/__tests__/fixtures/autocompleteUsernames.json'
import categories from 'utils/__tests__/fixtures/categories_structured.json'
import departmentOptions from 'utils/__tests__/fixtures/departmentOptions.json'
import directingDepartments from 'utils/__tests__/fixtures/directingDepartments.json'
import districts from 'utils/__tests__/fixtures/districts.json'
import sources from 'utils/__tests__/fixtures/sources.json'

import FilterForm from '..'
import AppContext from '../../../../../containers/App/context'
import IncidentManagementContext from '../../../context'
import {
  SAVE_SUBMIT_BUTTON_LABEL,
  DEFAULT_SUBMIT_BUTTON_LABEL,
} from '../constants'
import * as constants from '../utils/constants'

jest.mock('shared/services/configuration/configuration')

jest.mock('models/categories/selectors', () => {
  const structuredCategorie = require('utils/__tests__/fixtures/categories_structured.json')
  return {
    __esModule: true,
    ...jest.requireActual('models/categories/selectors'),
    makeSelectStructuredCategories: () => structuredCategorie,
  }
})

jest.mock('../utils/constants', () => ({
  __esModule: true,
  ...jest.requireActual('../utils/constants'),
  MAX_FILTER_LENGTH: 2700,
}))

global.window.HTMLElement.prototype.scrollIntoView = jest.fn()

const dispatchSpy = jest.spyOn(store, 'dispatch')
const makeSelectDirectingDepartmentsSpy = jest.spyOn(
  departmentsSelectors,
  'makeSelectDirectingDepartments'
)
const makeSelectRoutingDepartmentsSpy = jest.spyOn(
  departmentsSelectors,
  'makeSelectRoutingDepartments'
)
const makeSelectUserCanSpy = jest.spyOn(appSelectors, 'makeSelectUserCan')

const mockResponse = JSON.stringify(autocompleteUsernames)

const formProps = {
  onClearFilter: () => {},
  onSaveFilter: () => {},
  categories,
  onSubmit: () => {},
}

const withContext = (Component, actualDistricts = null, actualUsers = null) =>
  withAppContext(
    <AppContext.Provider value={{ sources }}>
      <IncidentManagementContext.Provider
        value={{ districts: actualDistricts, users: actualUsers }}
      >
        {Component}
      </IncidentManagementContext.Provider>
    </AppContext.Provider>
  )

describe('signals/incident-management/components/FilterForm', () => {
  beforeEach(() => {
    fetch.mockResponse(mockResponse)
  })

  afterEach(() => {
    fetch.resetMocks()
    configuration.__reset()
  })

  afterAll(() => {
    fetch.mockRestore()
    dispatchSpy.mockRestore()
    makeSelectDirectingDepartmentsSpy.mockRestore()
    makeSelectRoutingDepartmentsSpy.mockRestore()
    makeSelectUserCanSpy.mockRestore()
  })

  it('should render a name field', () => {
    const { getByTestId } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
        />
      )
    )

    expect(getByTestId('filterName')).toBeInTheDocument()
    expect(getByTestId('filterName').value).toEqual('FooBar')
  })

  it('should render filter fields', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="text"][name="name"]')
    ).toHaveLength(1)
    expect(
      container.querySelectorAll('input[type="text"][name="address_text"]')
    ).toHaveLength(1)
  })

  it('should render a refresh checkbox', async () => {
    const { findByTestId, unmount } = render(
      withContext(<FilterForm {...formProps} filter={{ options: {} }} />)
    )

    const refreshCheckbox = await findByTestId('filterRefresh')

    expect(refreshCheckbox).toBeInTheDocument()
    expect(refreshCheckbox.checked).toBe(false)

    unmount()

    const { findByTestId: findByTestIdReRender } = render(
      withContext(
        <FilterForm {...formProps} filter={{ options: {}, refresh: true }} />
      )
    )

    const refreshCb = await findByTestIdReRender('filterRefresh')

    expect(refreshCb.checked).toBe(true)
  })

  it('should handle checking the refresh box', () => {
    const { container } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
        />
      )
    )

    act(() => {
      fireEvent.click(
        container.querySelector('input[type="checkbox"][name="refresh"]')
      )
    })

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked
    ).toBeTruthy()

    act(() => {
      fireEvent.click(
        container.querySelector('input[type="checkbox"][name="refresh"]')
      )
    })

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked
    ).toBeFalsy()
  })

  it('should render a hidden id field', () => {
    const { container } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
        />
      )
    )

    expect(
      container.querySelectorAll('input[type="hidden"][name="id"]')
    ).toHaveLength(1)

    expect(
      container.querySelector('input[type="hidden"][name="id"]').value
    ).toEqual('1234')
  })

  it('should render groups of category checkboxes', () => {
    const { getAllByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    getAllByTestId('checkboxList').forEach((element) => {
      expect(element).toBeInTheDocument()
    })
  })

  it('should not rerender checkbox list group when state changes', () => {
    const { rerender, queryByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    const firstRenderId = queryByTestId('priorityCheckboxGroup').dataset
      .renderId

    rerender(withContext(<FilterForm {...formProps} />))

    const secondRenderId = queryByTestId('priorityCheckboxGroup').dataset
      .renderId

    rerender(withContext(<FilterForm {...formProps} />))

    const thirdRenderId = queryByTestId('priorityCheckboxGroup').dataset
      .renderId

    expect(firstRenderId).toEqual(secondRenderId)
    expect(secondRenderId).toEqual(thirdRenderId)
  })

  it('should render a list of priority options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="priority"]')
    ).toHaveLength(priorityList.length)
  })

  it('should render a list of type options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="type"]')
    ).toHaveLength(typesList.length)
  })

  it('should render a list of status options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="status"]')
    ).toHaveLength(statusList.length)
  })

  it('should render a list of stadsdeel options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="district"]')
    ).toHaveLength(0)
    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]')
    ).toHaveLength(stadsdeelList.length)
  })

  it('should render a list of kind options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="kind"]')
    ).toHaveLength(kindList.length)
  })

  it('should render a list of district options with feature flag enabled', async () => {
    configuration.featureFlags.fetchDistrictsFromBackend = true
    const { container } = render(
      withContext(<FilterForm {...formProps} />, districts)
    )

    await screen.findByTestId('filterName')

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]')
    ).toHaveLength(0)
    expect(
      container.querySelectorAll('input[type="checkbox"][name="area"]')
    ).toHaveLength(districts.length)
  })

  it('should not render districts without districts available', async () => {
    configuration.featureFlags.fetchDistrictsFromBackend = true
    const { container } = render(withContext(<FilterForm {...formProps} />))

    await screen.findByTestId('filterName')

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]')
    ).toHaveLength(0)
    expect(
      container.querySelectorAll('input[type="checkbox"][name="area"]')
    ).toHaveLength(0)
  })

  it('should render a list of contact options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll(
        'input[type="checkbox"][name="contact_details"]'
      )
    ).toHaveLength(dataLists.contact_details.length)
  })

  it('should render a list of feedback options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="radio"][name="feedback"]')
    ).toHaveLength(dataLists.feedback.length + 1) // by default, a radio button with an empty value is rendered
  })

  it('should render a list of punctuality options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="radio"][name="punctuality"]')
    ).toHaveLength(dataLists.punctuality.length + 1) // by default, a radio button with an empty value is rendered
  })

  it('should render a list of source options', () => {
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(
      container.querySelectorAll('input[type="checkbox"][name="source"]')
    ).toHaveLength(sources.length)
  })

  it('should render a list of directing_department options', () => {
    makeSelectDirectingDepartmentsSpy.mockImplementation(
      () => directingDepartments
    )
    const { container } = render(withContext(<FilterForm {...formProps} />))

    expect(screen.getByText('Regie hoofdmelding')).toBeInTheDocument()
    expect(
      container.querySelectorAll(
        'input[type="checkbox"][name="directing_department"]'
      )
    ).toHaveLength(directingDepartments.length)
  })

  it('should render a list of source options with feature flag enabled', async () => {
    const { container, findByTestId } = render(
      withContext(<FilterForm {...formProps} />, null)
    )
    await findByTestId('sourceCheckboxGroup')

    expect(
      container.querySelectorAll('input[type="checkbox"][name="source"]')
    ).toHaveLength(sources.length)
  })

  it('should render datepickers', () => {
    render(withContext(<FilterForm {...formProps} />))

    expect(document.getElementById('filter_created_before')).toBeInTheDocument()
    expect(document.getElementById('filter_created_after')).toBeInTheDocument()
  })

  describe('routing_department', () => {
    const label = 'Afdeling'
    const submitLabel = 'Filter'
    const notName = departmentOptions[0].value
    const ascName = departmentOptions[1].value
    const aegName = departmentOptions[2].value

    beforeEach(() => {
      makeSelectRoutingDepartmentsSpy.mockImplementation(
        () => departmentOptions
      )
    })

    it('should not render a list of departments with assignSignalToDepartment disabled', () => {
      render(withContext(<FilterForm {...formProps} />))
      expect(screen.queryByText(label)).not.toBeInTheDocument()
    })

    it('should allow selection of routing department with assignSignalToDepartment enabled', async () => {
      configuration.featureFlags.assignSignalToDepartment = true
      const onSubmit = jest.fn()
      const expected = {
        options: { routing_department: [departmentOptions[1].key] },
      }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))

      expect(screen.getByText(label)).toBeInTheDocument()
      const submitButton = screen.getByRole('button', { name: submitLabel })
      const checkbox = screen.getByText(ascName)

      expect(checkbox).toBeInTheDocument()
      await userEvent.click(checkbox)
      screen.getByRole('checkbox', { name: ascName, checked: true })

      await userEvent.click(submitButton)
      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should allow selection of not routed', async () => {
      configuration.featureFlags.assignSignalToDepartment = true
      const onSubmit = jest.fn()
      const expected = {
        options: { routing_department: [departmentOptions[0].key] },
      }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const checkbox = screen.getByText(notName)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      await userEvent.click(checkbox)

      screen.getByRole('checkbox', { name: notName, checked: true })

      await userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should allow deselection of not routed', async () => {
      configuration.featureFlags.assignSignalToDepartment = true
      const onSubmit = jest.fn()
      const filter = { options: { routing_department: [departmentOptions[0]] } }
      const expected = expect.not.objectContaining({
        options: { routing_department: [departmentOptions[0].key] },
      })

      render(
        withContext(
          <FilterForm {...{ ...formProps, onSubmit }} filter={filter} />
        )
      )
      const checkbox = screen.getByLabelText(notName)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      expect(checkbox).toBeChecked()

      await userEvent.click(checkbox)

      expect(checkbox).not.toBeChecked()

      await userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(expect.anything(), expected)
    })

    it('should clear other options when not routed checkbox checked', async () => {
      configuration.featureFlags.assignSignalToDepartment = true

      render(withContext(<FilterForm {...formProps} />))
      const not = screen.getByLabelText(notName)
      const asc = screen.getByLabelText(ascName)
      const aeg = screen.getByLabelText(aegName)

      await userEvent.click(asc)
      expect(asc).toBeChecked()
      expect(not).not.toBeChecked()
      expect(aeg).not.toBeChecked()

      await userEvent.click(not)
      expect(not).toBeChecked()
      expect(asc).not.toBeChecked()
      expect(aeg).not.toBeChecked()

      await userEvent.click(not)
      expect(not).not.toBeChecked()
      await waitFor(() => {
        expect(asc).toBeChecked()
      })
      expect(aeg).not.toBeChecked()
    })

    it('should clear correctly on form clear when assignSignalToDepartment flag has been set', async () => {
      configuration.featureFlags.assignSignalToDepartment = true

      render(withContext(<FilterForm {...formProps} />))
      const clearButton = screen.getByRole('button', { name: /nieuw filter/i })
      const not = screen.getByLabelText(notName)
      const asc = screen.getByLabelText(ascName)
      const aeg = screen.getByLabelText(aegName)

      await userEvent.click(asc)

      expect(asc).toBeChecked()

      await userEvent.click(aeg)

      expect(aeg).toBeChecked()

      await userEvent.click(clearButton)

      expect(asc).not.toBeChecked()
      expect(aeg).not.toBeChecked()
      expect(not).not.toBeChecked()

      await userEvent.click(not)

      expect(not).toBeChecked()

      await userEvent.click(clearButton)

      expect(not).not.toBeChecked()
      expect(asc).not.toBeChecked()
      expect(aeg).not.toBeChecked()
    })
  })

  describe('assigned_user_email', () => {
    const label = /toegewezen aan/i
    const notAssignedLabel = 'Niet toegewezen'
    const submitLabel = 'Filter'
    const username = autocompleteUsernames.results[0].username

    it('should not render a list of options with assignSignalToEmployee disabled', () => {
      render(withContext(<FilterForm {...formProps} />))
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument()
    })

    it('should fail silently when users request returns without results', async () => {
      jest.useFakeTimers()
      fetch.mockResponse(JSON.stringify({}))
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: {} }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const input = screen.getByLabelText(label)
      const submitButton = screen.getByRole('button', { name: submitLabel })
      expect(input).toBeInTheDocument()

      userEvent.type(input, 'aeg')

      act(() => {
        jest.advanceTimersByTime(INPUT_DELAY * 2)
      })

      await waitFor(() => {
        expect(screen.queryByText(username)).not.toBeInTheDocument()
      })
      userEvent.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining(expected)
        )
      })

      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    it('should allow selection of user with assignSignalToEmployee enabled', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: { assigned_user_email: username } }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))

      const submitButton = screen.getByRole('button', { name: submitLabel })
      const input = screen.getByLabelText(label)

      await userEvent.type(input, 'asc')

      const userNameListElement = await screen.findByText(username)

      await userEvent.click(userNameListElement)

      await userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should clear correctly on form clear', async () => {
      makeSelectUserCanSpy.mockImplementation(() => () => false)
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const input = screen.getByLabelText(label)
      const clearButton = screen.getByRole('button', { name: /nieuw filter/i })
      const submitButton = screen.getByRole('button', { name: submitLabel })
      const expected = { options: { assigned_user_email: expect.anything() } }

      await userEvent.type(input, 'asc')

      const userNameListElement = await screen.findByText(username)

      await userEvent.click(userNameListElement)

      userEvent.click(clearButton)
      userEvent.click(submitButton)

      expect(onSubmit).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should allow selection of not assigned', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: { assigned_user_email: 'null' } }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      await userEvent.click(checkbox)
      await userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should disable auto suggest when not assigned checkbox checked', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)

      expect(input).not.toBeDisabled()
      expect(checkbox).not.toBeChecked()

      await userEvent.click(checkbox)

      expect(input).toBeDisabled()
      expect(checkbox).toBeChecked()

      await userEvent.click(checkbox)

      expect(input).not.toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    it('should clear auto suggest value when not assigned checkbox checked', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)

      expect(input).not.toHaveValue()

      await userEvent.type(input, 'asc')

      const userNameListElement = await screen.findByText(username)

      await userEvent.click(userNameListElement)

      const inputAfterInput = screen.getByLabelText(label)
      expect(inputAfterInput).toHaveValue(username)

      await userEvent.click(checkbox)
      expect(input).not.toHaveValue()

      await userEvent.click(checkbox)
      expect(input).toHaveValue(username)
    })

    it('should clear correctly when form is reset', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)
      const clearButton = screen.getByRole('button', { name: /nieuw filter/i })

      await userEvent.type(input, 'asc')

      const userNameListElement = await screen.findByText(username)

      await userEvent.click(userNameListElement)

      expect(input).toHaveValue(username)
      expect(checkbox).not.toBeChecked()

      await userEvent.click(clearButton)

      await screen.findByTestId('filterName')

      expect(input).not.toHaveValue()
      expect(checkbox).not.toBeChecked()

      await userEvent.type(input, 'asc')

      const userNameListElementSecondRun = await screen.findByText(username)

      await userEvent.click(userNameListElementSecondRun)
      await userEvent.click(checkbox)

      expect(input).not.toHaveValue()
      expect(checkbox).toBeChecked()

      await userEvent.click(clearButton)

      await screen.findByTestId('filterName')

      expect(input).not.toHaveValue()
      expect(checkbox).not.toBeChecked()
    })

    it.skip('should clear correctly when removing input value', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: {} }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const input = screen.getByLabelText(label)

      await userEvent.type(input, 'asc')

      const userNameListElement = await screen.findByText(username)

      await userEvent.click(userNameListElement)

      await userEvent.clear(input)
      await userEvent.tab()

      await waitFor(() => {
        expect(screen.getByLabelText(notAssignedLabel)).toBeInTheDocument()
      })

      const submitButton = screen.getByRole('button', { name: submitLabel })
      await userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })
  })

  it('should update the state on created before date select', () => {
    render(withContext(<FilterForm {...formProps} />))

    const value = '18-12-2018'
    const inputElement = document.getElementById('filter_created_before')

    expect(document.querySelector('input[name=created_before]').value).toEqual(
      ''
    )

    act(() => {
      fireEvent.change(inputElement, { target: { value } })
    })

    expect(document.querySelector('input[name=created_before]').value).toEqual(
      value
    )
  })

  it('should update the state on created after date select', () => {
    render(withContext(<FilterForm {...formProps} />))

    const value = '23-12-2018'
    const inputElement = document.getElementById('filter_created_after')

    expect(document.querySelector('input[name=created_after]').value).toEqual(
      ''
    )

    act(() => {
      fireEvent.change(inputElement, { target: { value } })
    })

    expect(document.querySelector('input[name=created_after]').value).toEqual(
      value
    )
  })

  // Note that jsdom has a bug where `submit` and `reset` handlers are not called when those handlers
  // are defined as callback attributes on the form element. Instead, handlers are invoked when the
  // corresponding buttons are clicked.
  describe('reset', () => {
    it('should clear initial values', async () => {
      const onClearFilter = jest.fn()
      const filter = {
        name: 'Initial name',
        options: {
          address_text: 'Initial address',
          note_keyword: 'Initial note',
        },
      }
      render(
        withContext(
          <FilterForm
            {...formProps}
            filter={filter}
            onClearFilter={onClearFilter}
          />
        )
      )

      const nameField = screen.getByRole('textbox', { name: 'Filternaam' })
      const addressField = screen.getByRole('textbox', { name: 'Adres' })
      const noteField = screen.getByRole('textbox', { name: 'Zoek in notitie' })

      expect(addressField.value).toEqual('Initial address')
      expect(nameField.value).toEqual('Initial name')
      expect(noteField.value).toEqual('Initial note')

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Nieuw filter' }))
      })

      expect(onClearFilter).toHaveBeenCalled()
      expect(addressField.value).toEqual('')
      expect(nameField.value).toEqual('')
      expect(noteField.value).toEqual('')
    })

    it('should clear previous user input', async () => {
      const onClearFilter = jest.fn()
      const { container } = render(
        withContext(<FilterForm {...formProps} onClearFilter={onClearFilter} />)
      )

      const nameField = screen.getByRole('textbox', { name: 'Filternaam' })
      const addressField = screen.getByRole('textbox', { name: 'Adres' })
      const noteField = screen.getByRole('textbox', { name: 'Zoek in notitie' })
      const dateField = screen.getByRole('textbox', { name: 'Tot en met' })
      const afvalToggle = container.querySelector(
        'input[type="checkbox"][value="afval"]'
      )

      act(() => {
        fireEvent.change(nameField, { target: { value: 'My filter' } })
      })
      act(() => {
        fireEvent.change(dateField, { target: { value: '1970-01-01' } })
      })
      act(() => {
        fireEvent.change(addressField, {
          target: { value: 'Weesperstraat 113' },
        })
      })
      act(() => {
        fireEvent.change(noteField, { target: { value: 'test123' } })
      })
      act(() => {
        fireEvent.click(afvalToggle, new MouseEvent({ bubbles: true }))
      })

      await screen.findByTestId('filterName')

      expect(nameField.value).toEqual('My filter')
      expect(dateField.value).toEqual('01-01-1970')
      expect(addressField.value).not.toBeFalsy()
      expect(afvalToggle.checked).toEqual(true)
      expect(noteField.value).toEqual('test123')
      expect(
        screen.getAllByRole('checkbox').filter(({ checked }) => checked).length
      ).toBeGreaterThan(1)

      await act(async () => {
        fireEvent.click(container.querySelector('button[type="reset"]'))
      })

      expect(onClearFilter).toHaveBeenCalled()

      // skip testing dateField; handled by react-datepicker and not possible to verify until package has been updated
      // expect(dateField.value).toEqual('');
      expect(addressField.value).toEqual('')
      expect(nameField.value).toEqual('')
      expect(noteField.value).toEqual('')
      expect(afvalToggle.checked).toEqual(false)
      expect(
        screen.getAllByRole('checkbox').filter(({ checked }) => checked).length
      ).toEqual(0)
    })
  })

  it('should handle cancel', () => {
    const onCancel = jest.fn()
    const { getByTestId } = render(
      withContext(<FilterForm {...formProps} onCancel={onCancel} />)
    )

    fireEvent.click(getByTestId('cancelBtn'), new MouseEvent({ bubbles: true }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('should watch for changes in name field value', () => {
    const { container } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ name: 'My saved filter', options: {} }}
        />
      )
    )

    const submitButton = container.querySelector('button[type="submit"]')
    const nameField = container.querySelector('input[type="text"][name="name"]')

    expect(submitButton.textContent).toEqual(DEFAULT_SUBMIT_BUTTON_LABEL)

    act(() => {
      fireEvent.blur(nameField, { target: { value: 'My filter' } })
    })

    expect(submitButton.textContent).toEqual(SAVE_SUBMIT_BUTTON_LABEL)

    act(() => {
      fireEvent.change(nameField, { target: { value: '' } })
    })

    expect(submitButton.textContent).toEqual(SAVE_SUBMIT_BUTTON_LABEL)
  })

  it('should watch for changes in address_text field value', async () => {
    const { container, findByTestId } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{
            name: 'My saved filter',
            options: { address_text: 'Weesperstraat 113' },
          }}
        />
      )
    )

    const addressField = container.querySelector(
      'input[type="text"][name="address_text"]'
    )

    await act(async () => {
      fireEvent.change(addressField, {
        target: { value: 'Weesperstraat 113/117' },
      })
    })

    await act(async () => {
      fireEvent.blur(addressField)
    })

    await findByTestId('filterAddress')

    expect(
      container.querySelector('input[type="text"][name="address_text"]').value
    ).toEqual('Weesperstraat 113/117')
  })

  it('should watch for changes in note_keyword field value', () => {
    const { container } = render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{
            name: 'My saved filter',
            options: { note_keyword: 'test123' },
          }}
        />
      )
    )

    const noteField = container.querySelector(
      'input[type="text"][name="note_keyword"]'
    )

    act(() => {
      fireEvent.blur(noteField, { target: { value: 'test123' } })
    })

    expect(
      container.querySelector('input[type="text"][name="note_keyword"]').value
    ).toEqual('test123')
  })

  it('should watch for changes in radio button lists', async () => {
    const { container, findByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    const priorityRadioButtons = container.querySelectorAll(
      'input[type="radio"][name="feedback"]'
    )
    const buttonInList = priorityRadioButtons[1]

    act(() => {
      fireEvent.click(buttonInList)
    })

    await findByTestId('feedbackRadioGroup')

    expect(buttonInList.checked).toEqual(true)
  })

  it('should watch for changes in checkbox lists', async () => {
    const { container, findByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    const sourceCheckboxes = container.querySelectorAll(
      'input[type="checkbox"][name="source"]'
    )
    const boxInList = sourceCheckboxes[1]

    await act(async () => {
      fireEvent.click(boxInList)
    })

    await findByTestId('sourceCheckboxGroup')

    expect(boxInList.checked).toEqual(true)
  })

  describe('checkbox list toggle', () => {
    it('should watch for changes', async () => {
      const { container, findByTestId } = render(
        withContext(<FilterForm {...formProps} />)
      )

      const sourceCheckboxGroup = await findByTestId('sourceCheckboxGroup')
      const toggle = sourceCheckboxGroup.querySelector('label').firstChild

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(false)
        })

      act(() => {
        fireEvent.click(toggle)
      })

      await findByTestId('sourceCheckboxGroup')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(true)
        })

      act(() => {
        fireEvent.click(toggle)
      })

      await findByTestId('sourceCheckboxGroup')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(false)
        })
    })

    it('should watch for changes ', async () => {
      const { container, findByTestId } = render(
        withContext(<FilterForm {...formProps} />, null)
      )
      const sourceCheckboxGroup = await findByTestId('sourceCheckboxGroup')
      const toggle = sourceCheckboxGroup.querySelector('label').firstChild

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(false)
        })

      act(() => {
        fireEvent.click(toggle)
      })

      await findByTestId('sourceCheckboxGroup')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(true)
        })

      act(() => {
        fireEvent.click(toggle)
      })

      await findByTestId('sourceCheckboxGroup')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element.checked).toEqual(false)
        })
    })
  })

  it('should watch for changes in category checkbox lists', async () => {
    const { container, findByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    const mainCategorySlug = 'afval'
    const checkboxes = container.querySelectorAll(
      `input[name="${mainCategorySlug}_category_slug"]`
    )

    expect([...checkboxes].every((element) => !element.checked)).toEqual(true)

    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    await findByTestId('sourceCheckboxGroup')

    expect([...checkboxes].every((element) => !element.checked)).toEqual(false)
    expect(checkboxes[1].checked).toEqual(true)
  })

  describe('submit', () => {
    let emit

    beforeAll(() => {
      ;({ emit } = window._virtualConsole)
    })

    beforeEach(() => {
      window._virtualConsole.emit = jest.fn()
    })

    afterAll(() => {
      window._virtualConsole.emit = emit
    })

    it('should handle submit for new filter', () => {
      const handlers = {
        onSubmit: jest.fn(),
        onSaveFilter: jest.fn(),
      }

      const { container } = render(
        withContext(
          <FilterForm
            {...{ ...formProps, ...handlers }}
            filter={{
              name: '',
              options: { incident_date: '1970-01-01' },
            }}
          />
        )
      )

      expect(handlers.onSaveFilter).not.toHaveBeenCalled()
      expect(handlers.onSubmit).not.toHaveBeenCalled()

      const nameField = container.querySelector(
        'input[type="text"][name="name"]'
      )

      act(() => {
        fireEvent.click(container.querySelector('button[type="submit"]'))
      })

      expect(handlers.onSubmit).toHaveBeenCalled()
      expect(handlers.onSaveFilter).not.toHaveBeenCalled() // name field is empty

      act(() => {
        fireEvent.blur(nameField, { target: { value: 'New name' } })
      })

      act(() => {
        fireEvent.click(container.querySelector('button[type="submit"]'))
      })

      expect(handlers.onSaveFilter).toHaveBeenCalledTimes(1)
    })

    it('should handle submit for existing filter', async () => {
      const handlers = {
        onUpdateFilter: jest.fn(),
        onSubmit: jest.fn(),
      }

      render(
        withContext(
          <FilterForm
            {...{ ...formProps, ...handlers }}
            filter={{
              name: 'My filter',
              options: {
                incident_date_start: '1970-01-01',
              },
            }}
          />
        )
      )

      await userEvent.click(screen.getByRole('button', { name: 'Filter' }))

      // values haven't changed, update should not be called
      expect(handlers.onUpdateFilter).not.toHaveBeenCalled()

      const nameField = screen.getByLabelText('Filternaam')

      await userEvent.type(nameField, ' ')

      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
      })

      // trimmed field value is empty, update should not be called
      expect(handlers.onUpdateFilter).not.toHaveBeenCalled()

      await userEvent.type(nameField, 'My changed filter')

      await userEvent.click(
        screen.getByRole('button', { name: 'Opslaan en filter' })
      )

      expect(handlers.onUpdateFilter).toHaveBeenCalled()
      expect(handlers.onSubmit).toHaveBeenCalledTimes(3)
    })
  })
})

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set threshold low so it fails with a single filter.
    constants.MAX_FILTER_LENGTH = 104
  })

  const notificationMessage =
    'Helaas is de combinatie van deze filters te groot. Maak een kleinere selectie.'

  it('should show a notification when too many filters are selected and removed when deselected', async () => {
    jest.setTimeout(15000)
    const onSubmit = jest.fn()

    render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
    const checkbox = screen.getByText('Container glas kapot')

    expect(checkbox).toBeInTheDocument()

    await userEvent.click(checkbox)

    screen.getByRole('checkbox', {
      name: /Container glas kapot/i,
      checked: true,
    })

    // Wait for timeout in src/signals/incident-management/components/CheckboxList/CheckboxList.js@211
    // eslint-disable-next-line testing-library/no-wait-for-empty-callback
    await waitFor(() => {
      expect(screen.getByText(notificationMessage)).toBeInTheDocument()
    })

    await userEvent.click(checkbox)

    screen.getByRole('checkbox', {
      name: /Container glas kapot/i,
      checked: false,
    })

    await waitFor(() => {
      expect(screen.queryByText(notificationMessage)).not.toBeInTheDocument()
    })
  })

  it('should disable onSubmit', async () => {
    const onSubmit = jest.fn()

    render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
    const checkbox = screen.getByText('Container glas kapot')

    expect(checkbox).toBeInTheDocument()

    await userEvent.click(checkbox)
    screen.getByRole('checkbox', {
      name: /Container glas kapot/i,
      checked: true,
    })

    await waitFor(() => {
      expect(screen.getByText(notificationMessage)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId('submitBtn'))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
