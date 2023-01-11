// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { FilterComponent } from './FilterComponent'

const mockFetchGraphData = jest.fn()

const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
  results: undefined,
}

describe('FilterComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)
  })

  it('should render properly and select the first option', () => {
    render(<FilterComponent fetchGraphData={mockFetchGraphData} />)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Actie Service Centrum',
      }).selected
    ).toBe(true)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Afval en Grondstoffen',
      }).selected
    ).toBe(false)
  })

  it('should select a department and thus change selectable categories', async () => {
    render(<FilterComponent fetchGraphData={mockFetchGraphData} />)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Actie Service Centrum',
      }).selected
    ).toBe(true)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Openbare Orde & Veiligheid',
      }).selected
    ).toBe(false)

    expect(screen.queryByRole('option', { name: 'Ondermijning' })).toBe(null)

    userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Openbare Orde & Veiligheid',
      })
    )

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Actie Service Centrum',
      }).selected
    ).toBe(false)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Openbare Orde & Veiligheid',
      }).selected
    ).toBe(true)

    expect(
      screen.getByRole<HTMLOptionElement>('option', { name: 'Ondermijning' })
        .selected
    ).toBe(true)
  })

  it('should fetch graph data when the component is mounted', () => {
    render(<FilterComponent fetchGraphData={mockFetchGraphData} />)

    expect(mockFetchGraphData).toBeCalledWith(
      'department=ASC&category=Asbest%20%2F%20accu&priority=high&punctuality=on_time&district=A'
    )

    mockFetchGraphData.mockReset()

    userEvent.selectOptions(
      screen.getAllByRole('combobox')[0],
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Openbare Orde & Veiligheid',
      })
    )

    expect(mockFetchGraphData).toBeCalledWith(
      'department=OOV&category=Asbest%20%2F%20accu&priority=high&punctuality=on_time&district=A'
    )
  })
})
