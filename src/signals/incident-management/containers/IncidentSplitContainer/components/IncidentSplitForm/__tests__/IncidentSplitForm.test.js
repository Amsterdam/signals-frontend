// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import {
  subcategoriesGroupedByCategories as subcategories,
  departments,
} from 'utils/__tests__/fixtures'

import IncidentSplitForm from '..'
import parentIncidentFixture from '../../../__tests__/parentIncidentFixture.json'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const directingDepartments = [
  { key: 'null', value: 'Verantwoordelijke afdeling' },
  { key: departments.list[0].code, value: departments.list[0].code },
]

describe('IncidentSplitForm', () => {
  const onSubmit = jest.fn()
  const props = {
    parentIncident: parentIncidentFixture,
    subcategories,
    directingDepartments,
    onSubmit,
    isSubmitting: false,
  }

  it('should render correctly', () => {
    const { container, queryAllByText } = render(
      withAppContext(<IncidentSplitForm {...props} />)
    )
    expect(queryAllByText(parentIncidentFixture.description)).toHaveLength(1)
    expect(container.querySelector('input[value="null"]').checked).toBe(true)
  })

  it('should render correctly with selected directing department', () => {
    const directingDepartment = departments.list[0].code
    const parentIncident = { ...props.parentIncident, directingDepartment }
    const { container } = render(
      withAppContext(
        <IncidentSplitForm {...props} parentIncident={parentIncident} />
      )
    )
    expect(
      container.querySelector(`input[value="${directingDepartment}"]`).checked
    ).toBe(true)
  })

  it('should handle submit', async () => {
    const { findByTestId, getByTestId } = render(
      withAppContext(<IncidentSplitForm {...props} />)
    )
    // scrollIntoView is called in <IncidentSplitFormIncident /> when split button is clicked.
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn()

    fireEvent.click(getByTestId('incident-split-form-incident-split-button'))
    fireEvent.submit(getByTestId('incident-split-form-submit-button'))

    await findByTestId('incident-split-form')

    expect(onSubmit).toHaveBeenCalledWith({
      department: parentIncidentFixture.directingDepartment,
      // eslint-disable-next-line no-sparse-arrays
      incidents: [
        ,
        ,
        ,
        ,
        ,
        {
          subcategory: parentIncidentFixture.subcategory,
          description:
            'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
        ,
        {
          subcategory: parentIncidentFixture.subcategory,
          description:
            'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
      ],
      noteText: '',
    })
  })

  it('should handle cancel', async () => {
    const { getByTestId } = render(
      withAppContext(<IncidentSplitForm {...props} />)
    )
    fireEvent.click(getByTestId('incident-split-form-cancel-button'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/manage/incident/6010')
    })
  })

  it('should disable buttons when saving', () => {
    const { rerender } = render(
      withAppContext(<IncidentSplitForm {...props} />)
    )

    expect(
      screen.getByTestId('incident-split-form-submit-button')
    ).not.toHaveAttribute('disabled')
    expect(
      screen.getByTestId('incident-split-form-cancel-button')
    ).not.toHaveAttribute('disabled')

    rerender(withAppContext(<IncidentSplitForm {...props} isSubmitting />))
    expect(
      screen.getByTestId('incident-split-form-submit-button')
    ).toHaveAttribute('disabled')
    expect(
      screen.getByTestId('incident-split-form-cancel-button')
    ).toHaveAttribute('disabled')
  })
})
