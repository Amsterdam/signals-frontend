// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { Filter } from './Filter'

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
    render(<Filter fetchGraphData={mockFetchGraphData} />)

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

  it('should select a department and thus change selectable categories', () => {
    render(<Filter fetchGraphData={mockFetchGraphData} />)

    expect(
      screen.getByRole<HTMLOptionElement>('option', {
        name: 'Actie Service Centrum',
      }).selected
    ).toBe(true)

    expect(screen.queryByRole('option', { name: 'Ondermijning' })).toBe(null)

    expect(
      screen.queryByRole<HTMLOptionElement>('option', { name: 'Bedrijfsafval' })
    ).toBeTruthy()

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
      screen.queryByRole<HTMLOptionElement>('option', { name: 'Bedrijfsafval' })
    ).toBeFalsy()
  })

  it('should fetch graph data when the component is mounted and when clicking on an option.', async () => {
    render(<Filter fetchGraphData={mockFetchGraphData} />)

    expect(mockFetchGraphData).toBeCalledWith('department=ASC')

    mockFetchGraphData.mockReset()

    await waitFor(() => {
      userEvent.selectOptions(
        screen.getAllByRole('combobox')[0],
        screen.getByRole<HTMLOptionElement>('option', {
          name: 'Openbare Orde & Veiligheid',
        })
      )

      userEvent.selectOptions(
        screen.getAllByRole('combobox')[1],
        screen.getByRole<HTMLOptionElement>('option', {
          name: 'Ondermijning',
        })
      )
    })

    expect(mockFetchGraphData).toBeCalledWith(
      'department=OOV&category=Ondermijning'
    )
  })
})
