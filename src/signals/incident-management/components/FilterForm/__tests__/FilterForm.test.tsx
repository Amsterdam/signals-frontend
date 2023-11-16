// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import type { ReactElement } from 'react'

import { fireEvent, render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import fetch from 'jest-fetch-mock'

import { INPUT_DELAY } from 'components/AutoSuggest'
import * as appSelectors from 'containers/App/selectors'
import type { KeyValuePair } from 'containers/App/types'
import * as departmentsSelectors from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import { filterSaved, filterUpdated } from 'signals/incident-management/actions'
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
import { IncidentManagementContext } from '../../../context'
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
  onClearFilter: jest.fn(),
  onSaveFilter: jest.fn(),
  categories,
  onSubmit: jest.fn(),
  filter: { id: 1234, name: 'FooBar', options: {} },
}

const defaultValue = {
  standardTexts: {
    page: 1,
    setPage: () => {},
    statusFilter: null,
    setStatusFilter: () => {},
    activeFilter: null,
    setActiveFilter: () => {},
    searchQuery: '',
    setSearchQuery: () => {},
  },
}

const withContext = (
  Component: ReactElement,
  actualDistricts?: KeyValuePair<string>[],
  actualUsers = null
) => {
  return withAppContext(
    <AppContext.Provider value={{ sources, loading: false }}>
      <IncidentManagementContext.Provider
        value={{
          ...defaultValue,
          districts: actualDistricts,
          users: actualUsers,
        }}
      >
        {Component}
      </IncidentManagementContext.Provider>
    </AppContext.Provider>
  )
}

describe('signals/incident-management/components/FilterForm', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetch.mockResponse(mockResponse)
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetch.resetMocks()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

    expect(getByTestId('filter-name')).toBeInTheDocument()
    expect(getByTestId('filter-name')).toHaveValue('FooBar')
  })

  it('should render filter fields', async () => {
    const { container, findAllByPlaceholderText } = render(
      withContext(<FilterForm {...formProps} />)
    )

    expect(
      container.querySelectorAll('input[type="text"][name="name"]')
    ).toHaveLength(1)
    expect(await findAllByPlaceholderText('Zoek op straatnaam')).toHaveLength(1)
  })

  it('should render a refresh checkbox', async () => {
    const { findByTestId, unmount, rerender } = render(
      withContext(<FilterForm {...formProps} filter={{ options: {} }} />)
    )

    const refreshCheckbox = await findByTestId('filter-refresh')

    expect(refreshCheckbox).toBeInTheDocument()
    expect(refreshCheckbox).not.toBeChecked()

    unmount()

    rerender(
      withContext(
        <FilterForm {...formProps} filter={{ options: {}, refresh: true }} />
      )
    )

    const refreshCb = await findByTestId('filter-refresh')

    expect(refreshCb).toBeChecked()
  })

  it('should handle checking the refresh box', () => {
    render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
        />
      )
    )

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Automatisch verversen Automatisch verversen',
      })
    )

    expect(
      screen.getByRole('checkbox', {
        name: 'Automatisch verversen Automatisch verversen',
      })
    ).toBeChecked()

    userEvent.click(
      screen.getByRole('checkbox', {
        name: 'Automatisch verversen Automatisch verversen',
      })
    )

    expect(
      screen.getByRole('checkbox', {
        name: 'Automatisch verversen Automatisch verversen',
      })
    ).not.toBeChecked()
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
      container.querySelector('input[type="hidden"][name="id"]')
    ).toHaveValue('1234')
  })

  it('should render groups of category checkboxes', () => {
    const { getAllByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    getAllByTestId('checkbox-list').forEach((element) => {
      expect(element).toBeInTheDocument()
    })
  })

  it('should not rerender checkbox list group when state changes', () => {
    const { rerender, queryByTestId } = render(
      withContext(<FilterForm {...formProps} />)
    )

    const firstRenderId = queryByTestId('priority-checkbox-group')?.dataset
      .renderId

    rerender(withContext(<FilterForm {...formProps} />))

    const secondRenderId = queryByTestId('priority-checkbox-group')?.dataset
      .renderId

    rerender(withContext(<FilterForm {...formProps} />))

    const thirdRenderId = queryByTestId('priority-checkbox-group')?.dataset
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

    await screen.findByTestId('filter-name')

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

    await screen.findByTestId('filter-name')

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
      withContext(<FilterForm {...formProps} />)
    )
    await findByTestId('source-checkbox-group')

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
      userEvent.click(checkbox)
      await screen.findByRole('checkbox', { name: ascName, checked: true })
      // Wait for timeout in src/signals/incident-management/components/CheckboxList/CheckboxList.js@211
      // eslint-disable-next-line testing-library/no-wait-for-empty-callback
      await waitFor(() => {})
      userEvent.click(submitButton)
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

      userEvent.click(checkbox)
      await screen.findByRole('checkbox', { name: notName, checked: true })
      userEvent.click(submitButton)
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

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })
      userEvent.click(checkbox)
      await waitFor(() => {
        expect(checkbox).not.toBeChecked()
      })
      userEvent.click(submitButton)
      expect(onSubmit).toHaveBeenCalledWith(expect.anything(), expected)
    })

    it('should clear other options when not routed checkbox checked', async () => {
      configuration.featureFlags.assignSignalToDepartment = true

      render(withContext(<FilterForm {...formProps} />))
      const not = screen.getByLabelText(notName)
      const asc = screen.getByLabelText(ascName)
      const aeg = screen.getByLabelText(aegName)

      userEvent.click(asc)
      expect(asc).toBeChecked()
      expect(not).not.toBeChecked()
      expect(aeg).not.toBeChecked()

      userEvent.click(not)
      expect(not).toBeChecked()
      expect(asc).not.toBeChecked()
      expect(aeg).not.toBeChecked()

      userEvent.click(not)
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

      userEvent.click(asc)
      await waitFor(() => {
        expect(asc).toBeChecked()
      })
      userEvent.click(aeg)
      await waitFor(() => {
        expect(aeg).toBeChecked()
      })

      userEvent.click(clearButton)
      await waitFor(() => {
        expect(asc).not.toBeChecked()
      })
      expect(aeg).not.toBeChecked()
      expect(not).not.toBeChecked()

      userEvent.click(not)
      await waitFor(() => {
        expect(not).toBeChecked()
      })

      userEvent.click(clearButton)
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

    const selectUser = async (input: any) => {
      return act(async () => {
        userEvent.type(input, 'asc')
        const userNameListElement = await screen.findByText(username)
        userEvent.click(userNameListElement)
      })
    }

    it('should not render a list of options with assignSignalToEmployee disabled', () => {
      render(withContext(<FilterForm {...formProps} />))
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument()
    })

    it('should fail silently when users request returns without results', async () => {
      jest.useFakeTimers()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )

      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })

    it('should allow selection of user with assignSignalToEmployee enabled', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: { assigned_user_email: username } }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))

      const input = screen.getByLabelText(label)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      await selectUser(input)

      userEvent.click(submitButton)

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

      await selectUser(input)

      userEvent.click(clearButton)
      userEvent.click(submitButton)

      expect(onSubmit).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should allow selection of not assigned', () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: { assigned_user_email: 'null' } }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      userEvent.click(checkbox)
      userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })

    it('should disable auto suggest when not assigned checkbox checked', () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)

      expect(input).not.toBeDisabled()
      expect(checkbox).not.toBeChecked()

      userEvent.click(checkbox)

      expect(input).toBeDisabled()
      expect(checkbox).toBeChecked()

      userEvent.click(checkbox)

      expect(input).not.toBeDisabled()
      expect(checkbox).not.toBeChecked()
    })

    it('should clear auto suggest value when not assigned checkbox checked', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)

      expect(input).not.toHaveValue()

      await selectUser(input)

      expect(input).toHaveValue(username)

      userEvent.click(checkbox)
      expect(input).not.toHaveValue()

      userEvent.click(checkbox)
      expect(input).toHaveValue(username)
    })

    it('should clear correctly when form is reset', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(withContext(<FilterForm {...formProps} />))
      const checkbox = screen.getByLabelText(notAssignedLabel)
      const input = screen.getByLabelText(label)
      const clearButton = screen.getByRole('button', { name: /nieuw filter/i })

      await selectUser(input)

      expect(input).toHaveValue(username)
      expect(checkbox).not.toBeChecked()

      userEvent.click(clearButton)

      await screen.findByTestId('filter-name')

      expect(input).not.toHaveValue()
      expect(checkbox).not.toBeChecked()

      await selectUser(input)
      userEvent.click(checkbox)

      expect(input).not.toHaveValue()
      expect(checkbox).toBeChecked()

      userEvent.click(clearButton)

      await screen.findByTestId('filter-name')

      expect(input).not.toHaveValue()
      expect(checkbox).not.toBeChecked()
    })

    it('should clear correctly when removing input value', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      const onSubmit = jest.fn()
      const expected = { options: {} }

      render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
      const input = screen.getByLabelText(label)
      const submitButton = screen.getByRole('button', { name: submitLabel })

      await selectUser(input)

      act(() => {
        userEvent.clear(input)
        userEvent.tab()
      })

      await waitFor(() => {
        expect(screen.getByLabelText(notAssignedLabel)).toBeInTheDocument()
      })

      userEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expected)
      )
    })
  })

  it('should update the state on created before date select', () => {
    render(withContext(<FilterForm {...formProps} />))

    const value = '18-12-2018'

    const inputElement = screen.getByRole('textbox', { name: 'Tot en met' })

    expect(document.querySelector('input[name=created_before]')).toHaveValue('')

    act(() => {
      fireEvent.change(inputElement, { target: { value } })
    })

    expect(document.querySelector('input[name=created_before]')).toHaveValue(
      value
    )
  })

  it('should update the state on created after date select', () => {
    render(withContext(<FilterForm {...formProps} />))

    const value = '23-12-2018'
    const inputElement = screen.getByRole('textbox', { name: 'Vanaf' })

    expect(document.querySelector('input[name=created_after]')).toHaveValue('')

    act(() => {
      fireEvent.change(inputElement, { target: { value } })
    })

    expect(document.querySelector('input[name=created_after]')).toHaveValue(
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
      const noteField = screen.getByRole('textbox', { name: 'Zoek in notitie' })

      expect(nameField).toHaveValue('Initial name')
      expect(noteField).toHaveValue('Initial note')

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Nieuw filter' }))
      })

      expect(onClearFilter).toHaveBeenCalled()
      expect(nameField).toHaveValue('')
      expect(noteField).toHaveValue('')
    })

    it('should clear previous user input', async () => {
      const onClearFilter = jest.fn()
      const { container } = render(
        withContext(<FilterForm {...formProps} onClearFilter={onClearFilter} />)
      )

      const nameField = screen.getByRole('textbox', { name: 'Filternaam' })
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
        fireEvent.change(noteField, { target: { value: 'test123' } })
      })
      act(() => {
        afvalToggle && fireEvent.click(afvalToggle)
      })

      await screen.findByTestId('filter-name')

      expect(nameField).toHaveValue('My filter')
      expect(dateField).toHaveValue('01-01-1970')
      expect(afvalToggle).toBeChecked()
      expect(noteField).toHaveValue('test123')

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Nieuw filter' }))
      })

      expect(onClearFilter).toHaveBeenCalled()

      expect(nameField).toHaveValue('')
      expect(noteField).toHaveValue('')
      expect(afvalToggle).not.toBeChecked()
    })
  })

  it('should handle cancel', () => {
    const onCancel = jest.fn()
    const { getByTestId } = render(
      withContext(<FilterForm {...formProps} onCancel={onCancel} />)
    )

    fireEvent.click(getByTestId('cancel-btn'))

    expect(onCancel).toHaveBeenCalled()
  })

  it('should watch for changes in name field value', () => {
    render(
      withContext(
        <FilterForm
          {...formProps}
          filter={{ name: 'My saved filter', options: {} }}
        />
      )
    )

    const submitButton = screen.getByRole('button', { name: 'Filter' })
    const nameField = screen.getByTestId('filter-name')

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

  it('should watch for changes in note_keyword field value', () => {
    render(
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

    const noteField = screen.getByRole('textbox', { name: 'Zoek in notitie' })

    act(() => {
      fireEvent.blur(noteField, { target: { value: 'test123' } })
    })

    expect(
      screen.getByRole('textbox', { name: 'Zoek in notitie' })
    ).toHaveValue('test123')
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

    await findByTestId('feedback-radio-group')

    expect(buttonInList).toBeChecked()
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

    await findByTestId('source-checkbox-group')

    expect(boxInList).toBeChecked()
  })

  describe('checkbox list toggle', () => {
    it('should watch for changes', async () => {
      const { container, findByTestId } = render(
        withContext(<FilterForm {...formProps} />)
      )

      const sourceCheckboxGroup = await findByTestId('source-checkbox-group')
      const toggle = sourceCheckboxGroup.querySelector('label')?.firstChild

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).not.toBeChecked()
        })

      act(() => {
        toggle && fireEvent.click(toggle)
      })

      await findByTestId('source-checkbox-group')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).toBeChecked()
        })

      act(() => {
        toggle && fireEvent.click(toggle)
      })

      await findByTestId('source-checkbox-group')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).not.toBeChecked()
        })
    })

    it('should watch for changes ', async () => {
      const { container, findByTestId } = render(
        withContext(<FilterForm {...formProps} />)
      )
      const sourceCheckboxGroup = await findByTestId('source-checkbox-group')
      const toggle = sourceCheckboxGroup.querySelector('label')?.firstChild

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).not.toBeChecked()
        })

      act(() => {
        toggle && fireEvent.click(toggle)
      })

      await findByTestId('source-checkbox-group')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).toBeChecked()
        })

      act(() => {
        toggle && fireEvent.click(toggle)
      })

      await findByTestId('source-checkbox-group')

      container
        .querySelectorAll('input[type="checkbox"][name="source"]')
        .forEach((element) => {
          expect(element).not.toBeChecked()
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect([...checkboxes].every((element) => !element.checked)).toEqual(true)

    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    await findByTestId('source-checkbox-group')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect([...checkboxes].every((element) => !element.checked)).toEqual(false)
    expect(checkboxes[1]).toBeChecked()
  })

  describe('submit', () => {
    let emit: any

    beforeAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ;({ emit } = window._virtualConsole)
    })

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window._virtualConsole.emit = jest.fn()
    })

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window._virtualConsole.emit = emit
    })

    it('should handle submit for new filter', () => {
      const handlers = {
        onSubmit: jest.fn(),
        onSaveFilter: jest.fn(() => filterSaved),
      }

      const { container } = render(
        withContext(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

      const submitButton = screen.getByRole('button', { name: 'Filter' })

      userEvent.click(submitButton)

      expect(handlers.onSubmit).toHaveBeenCalled()
      expect(handlers.onSaveFilter).not.toHaveBeenCalled() // name field is empty

      act(() => {
        nameField &&
          fireEvent.blur(nameField, { target: { value: 'New name' } })
      })

      const submitButtonSave = screen.getByRole('button', {
        name: 'Opslaan en filter',
      })
      userEvent.click(submitButtonSave)

      expect(handlers.onSaveFilter).toHaveBeenCalledTimes(1)
    })

    it('should handle submit for existing filter', () => {
      const handlers = {
        onUpdateFilter: jest.fn(() => filterUpdated),
        onSubmit: jest.fn(),
      }

      render(
        withContext(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Filter' }))
      })

      // values haven't changed, update should not be called
      expect(handlers.onUpdateFilter).not.toHaveBeenCalled()

      const nameField = screen.getByLabelText('Filternaam')

      act(() => {
        userEvent.type(nameField, ' ')
      })

      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Filter' }))
      })

      // trimmed field value is empty, update should not be called
      expect(handlers.onUpdateFilter).not.toHaveBeenCalled()

      act(() => {
        userEvent.type(nameField, 'My changed filter')
      })

      act(() => {
        userEvent.click(
          screen.getByRole('button', { name: 'Opslaan en filter' })
        )
      })

      expect(handlers.onUpdateFilter).toHaveBeenCalled()
      expect(handlers.onSubmit).toHaveBeenCalledTimes(3)
    })
  })
})

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set threshold low so it fails with a single filter.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.MAX_FILTER_LENGTH = 108
  })

  const notificationMessage =
    'Helaas is de combinatie van deze filters te groot. Maak een kleinere selectie.'

  it('should show a notification when too many filters are selected and removed when deselected', async () => {
    const onSubmit = jest.fn()

    render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
    expect(screen.queryByText(notificationMessage)).not.toBeInTheDocument()

    const afvalButton = screen.getByRole('button', { name: 'Afval' })

    userEvent.click(afvalButton)

    const checkbox = screen.getByRole('checkbox', {
      name: 'Container glas kapot',
    })

    expect(checkbox).toBeInTheDocument()

    userEvent.click(checkbox)

    expect(checkbox).toBeChecked()

    const checkbox2 = screen.getByRole('checkbox', {
      name: 'Container glas vol',
    })
    userEvent.click(checkbox2)

    expect(screen.getByText(notificationMessage)).toBeInTheDocument()

    userEvent.click(checkbox)
    userEvent.click(checkbox2)
    userEvent.click(afvalButton)
  })

  it('should disable onSubmit', async () => {
    const onSubmit = jest.fn()

    render(withContext(<FilterForm {...{ ...formProps, onSubmit }} />))
    const afvalButton = screen.getByRole('button', { name: 'Afval' })
    userEvent.click(afvalButton)

    const checkbox = screen.getByText('Container glas kapot')

    expect(checkbox).toBeInTheDocument()

    userEvent.click(checkbox)
    await screen.findByRole('checkbox', {
      name: /Container glas kapot/i,
      checked: true,
    })

    // Wait for timeout in src/signals/incident-management/components/CheckboxList/CheckboxList.js@211
    // eslint-disable-next-line testing-library/no-wait-for-empty-callback
    await waitFor(() => {})

    expect(screen.getByText(notificationMessage)).toBeInTheDocument()

    userEvent.click(screen.getByTestId('submit-btn'))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
