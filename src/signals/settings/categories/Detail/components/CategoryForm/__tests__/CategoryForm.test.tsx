// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'

import CategoryForm from '..'
import type { CategoryFormProps } from '../CategoryForm'

const mockDepartment = {
  can_view: true,
  id: 1,
  is_intern: true,
  name: 'Foo',
}

describe('signals/settings/categories/Detail/components/CategoryForm', () => {
  const defaultProps = {
    data: {
      id: 123,
      slug: 'Mock slug',
      departments: [
        {
          ...mockDepartment,
          code: 'foo',
          is_responsible: true,
        },
      ],
      description: 'Mock description',
      handling_message: 'Mock handling message',
      is_active: true,
      name: 'Mock name',
      sla: {
        n_days: 5,
        use_calendar_days: false,
      },
    },
    history: [],
    onCancel: jest.fn(),
    onSubmitForm: jest.fn((event: React.MouseEvent) => {
      event.preventDefault()
    }),
    readOnly: false,
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the correct fields', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
      'Mock name'
    )
    expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(
      'Mock description'
    )
    expect(screen.getByRole('spinbutton')).toHaveValue(5)
    expect(screen.getByRole('combobox')).toHaveValue('0')
    expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Niet actief' })).not.toBeChecked()
  })

  it('should render category history', () => {
    const { rerender } = render(
      withAppContext(<CategoryForm {...defaultProps} />)
    )

    expect(screen.queryByTestId('history')).not.toBeInTheDocument()

    const history = [
      {
        identifier: 'UPDATE_STATUS_6686',
        when: '2019-07-31T15:10:28.696413+02:00',
        what: 'UPDATE_STATUS',
        action: 'Update status naar: Gesplitst',
        description: 'Deze melding is opgesplitst.',
        who: 'steve@apple.com',
        _category: 1,
      },
    ]
    rerender(
      withAppContext(<CategoryForm {...defaultProps} history={history} />)
    )

    expect(screen.getByTestId('history')).toBeInTheDocument()
  })

  it('should make fields disabled', () => {
    const { rerender } = render(
      withAppContext(<CategoryForm {...defaultProps} />)
    )

    screen.getAllByRole('textbox').forEach((element) => {
      expect(element).not.toBeDisabled()
    })
    screen.getAllByRole('spinbutton').forEach((element) => {
      expect(element).not.toBeDisabled()
    })
    screen.getAllByRole('combobox').forEach((element) => {
      expect(element).not.toBeDisabled()
    })
    screen.getAllByRole('radio').forEach((element) => {
      expect(element).not.toBeDisabled()
    })

    expect(screen.getByRole('button', { name: 'Opslaan' })).toBeInTheDocument()

    rerender(withAppContext(<CategoryForm {...defaultProps} readOnly />))

    screen.getAllByRole('textbox').forEach((element) => {
      expect(element).toBeDisabled()
    })
    screen.getAllByRole('spinbutton').forEach((element) => {
      expect(element).toBeDisabled()
    })
    screen.getAllByRole('combobox').forEach((element) => {
      expect(element).toBeDisabled()
    })
    screen.getAllByRole('radio').forEach((element) => {
      expect(element).toBeDisabled()
    })
    expect(
      screen.queryByRole('button', { name: 'Opslaan' })
    ).not.toBeInTheDocument()
  })

  it('should set field values', () => {
    const props: CategoryFormProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        name: 'Foo',
        description: 'Bar',
        handling_message: 'foo@bar',
        is_active: true,
        sla: {
          n_days: 10,
          use_calendar_days: false,
        },
        departments: [
          {
            ...mockDepartment,
            is_responsible: true,
            code: 'foo',
          },
          {
            ...mockDepartment,
            is_responsible: false,
            code: 'bar',
          },
          {
            ...mockDepartment,
            is_responsible: true,
            code: 'baz',
          },
        ],
      },
    }

    const { rerender, unmount } = render(
      withAppContext(<CategoryForm {...props} />)
    )

    expect(screen.getByTestId('responsible_departments')).toHaveTextContent(
      'foo, baz'
    )
    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue('Foo')
    expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(
      'Bar'
    )
    expect(screen.getByRole('textbox', { name: 'Servicebelofte' })).toHaveValue(
      'foo@bar'
    )
    expect(screen.getByRole('spinbutton')).toHaveValue(props.data?.sla.n_days)
    expect(screen.getByRole('combobox')).toHaveValue('0')
    expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Niet actief' })).not.toBeChecked()

    unmount()

    rerender(
      withAppContext(
        <CategoryForm
          {...defaultProps}
          data={
            {
              ...props.data,
              sla: { n_days: 10, use_calendar_days: true },
              departments: [],
            } as CategoryFormProps['data']
          }
        />
      )
    )

    expect(
      screen.queryByTestId('responsible_departments')
    ).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('1')
  })

  it('should call onCancel callback', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(defaultProps.onCancel).not.toHaveBeenCalled()
    userEvent.click(screen.getByRole('button', { name: 'Annuleren' }))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('should call onSubmit callback', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(defaultProps.onSubmitForm).not.toHaveBeenCalled()
    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
    expect(defaultProps.onSubmitForm).toHaveBeenCalled()
  })
})
