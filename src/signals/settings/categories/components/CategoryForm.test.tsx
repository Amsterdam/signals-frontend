// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { MouseEvent } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import type { CategoryFormProps } from './CategoryForm'
import CategoryForm from './CategoryForm'

const mockDepartment = {
  can_view: true,
  id: 1,
  is_intern: true,
  name: 'Foo',
}

describe('signals/settings/categories/Detail/components/CategoryForm', () => {
  const defaultProps = {
    data: {
      _links: {
        self: {
          href: '//',
          public: '//',
        },
      },
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
      note: 'Mock note',
      is_active: true,
      is_public_accessible: false,
      name: 'Mock name',
      sla: {
        n_days: 5,
        use_calendar_days: false,
      },
    },
    history: [],
    onCancel: jest.fn(),
    onSubmitForm: jest.fn((event: MouseEvent) => {
      event.preventDefault()
    }),
    readOnly: false,
  }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('Renders the correct fields', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
      'Mock name'
    )
    expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(
      'Mock description'
    )
    expect(screen.getByRole('textbox', { name: 'Notitie' })).toHaveValue(
      'Mock note'
    )
    expect(
      screen.getByRole('checkbox', {
        name: 'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier',
      })
    ).not.toBeChecked()
    expect(screen.getByRole('spinbutton')).toHaveValue(5)
    expect(screen.getByRole('combobox')).toHaveValue('0')
    expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Niet actief' })).not.toBeChecked()
  })

  it('Renders category history', () => {
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

  it('Renders the public name field when the is_public_accessible checkbox is checked', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(
      screen.queryByRole('textbox', { name: 'Naam openbaar' })
    ).not.toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox', {
      name: 'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier',
    })
    expect(checkbox).not.toBeChecked()

    userEvent.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(
      screen.getByRole('textbox', { name: 'Naam openbaar' })
    ).toBeInTheDocument()
  })

  it('Disables fields', () => {
    const { rerender } = render(
      withAppContext(<CategoryForm {...defaultProps} />)
    )

    screen.getAllByRole('textbox').forEach((element) => {
      expect(element).not.toBeDisabled()
    })
    screen.getAllByRole('spinbutton').forEach((element) => {
      expect(element).not.toBeDisabled()
    })
    screen.getAllByRole('checkbox').forEach((element) => {
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
    screen.getAllByRole('checkbox').forEach((element) => {
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

  it('Sets field values', () => {
    const props: CategoryFormProps = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        name: 'Foo',
        description: 'Bar',
        handling_message: 'foo@bar',
        is_active: true,
        is_public_accessible: true,
        public_name: 'Foo Bar',
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
    expect(
      screen.getByRole('checkbox', {
        name: 'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier',
      })
    ).toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Naam openbaar' })).toHaveValue(
      'Foo Bar'
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

  it('Calls onCancel callback', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(defaultProps.onCancel).not.toHaveBeenCalled()
    userEvent.click(screen.getByRole('button', { name: 'Annuleer' }))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('Calls onSubmit callback', () => {
    render(withAppContext(<CategoryForm {...defaultProps} />))

    expect(defaultProps.onSubmitForm).not.toHaveBeenCalled()
    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
    expect(defaultProps.onSubmitForm).toHaveBeenCalled()
  })
})
