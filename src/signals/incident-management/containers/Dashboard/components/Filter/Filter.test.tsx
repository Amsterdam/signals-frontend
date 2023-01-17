// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { Filter } from './Filter'

const mockCallback = jest.fn()

const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
}

describe('FilterComponent', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)
  })

  it('should render properly and select the first option', () => {
    render(<Filter callback={mockCallback} />)

    userEvent.click(screen.getAllByRole('listbox')[0])
    expect(
      screen.getByRole('listbox', { name: 'Actie Service Centr...' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('listbox', {
        name: 'Amsterdamse Bos',
      })
    ).not.toBeInTheDocument()
  })

  it('should select a department and thus change selectable categories', () => {
    render(<Filter callback={mockCallback} />)

    expect(
      screen.getByRole('listbox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('listbox', {
        name: 'Categorie',
      })
    )

    expect(
      screen.queryByRole('option', { name: 'Bedrijfsafval' })
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('listbox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Politie',
      })
    )

    expect(
      screen.queryByRole('listbox', { name: 'Bedrijfsafval' })
    ).not.toBeInTheDocument()
  })

  it('should select a department, a custom category and reset back and call callback each time', async () => {
    render(<Filter callback={mockCallback} />)

    userEvent.click(
      screen.getByRole('listbox', {
        name: 'Actie Service Centr...',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Afval en Grondstoffen',
      })
    )

    expect(mockCallback).toBeCalledWith('department=AEG')

    mockCallback.mockReset()

    userEvent.click(
      screen.getByRole('listbox', {
        name: 'Categorie',
      })
    )

    userEvent.click(
      screen.getByRole('option', {
        name: 'Huisafval',
      })
    )

    expect(mockCallback).toBeCalledWith('department=AEG&category=Huisafval')

    mockCallback.mockReset()

    userEvent.click(screen.getByText('Wis filters'))

    expect(mockCallback).toBeCalledWith('department=ASC')
  })

  it('should hide department button when there is only one', () => {
    const oneDepartment = {
      ...departmentsFixture,
      list: [departmentsFixture.results[0]],
    }

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(oneDepartment)

    const { rerender } = render(<Filter callback={mockCallback} />)

    expect(
      screen.queryByRole('listbox', {
        name: 'Actie Service Centr...',
      })
    ).not.toBeInTheDocument()

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)

    rerender(<Filter callback={mockCallback} />)

    expect(
      screen.queryByRole('listbox', {
        name: 'Actie Service Centr...',
      })
    ).toBeInTheDocument()
  })
})
