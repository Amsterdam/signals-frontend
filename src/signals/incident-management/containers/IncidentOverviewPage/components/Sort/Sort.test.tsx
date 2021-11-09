import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import Sort, { SortOptions } from '.'

const onChangeOrdering = jest.fn()

describe('Sort', () => {
  afterEach(() => {
    onChangeOrdering.mockReset()
  })

  it('renders sort options', () => {
    render(withAppContext(<Sort onChangeOrdering={onChangeOrdering} />))

    expect(screen.getByTestId('incidentSortSelect')).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
  })

  it('pre-selects active sort option', () => {
    const activeSort = SortOptions.BUROUGH_DESC

    render(
      withAppContext(
        <Sort onChangeOrdering={onChangeOrdering} activeSort={activeSort} />
      )
    )

    expect(screen.getByTestId('incidentSortSelect')).toHaveValue(
      SortOptions.BUROUGH_DESC
    )
  })

  it('calls onChange callback', () => {
    render(withAppContext(<Sort onChangeOrdering={onChangeOrdering} />))

    expect(onChangeOrdering).not.toHaveBeenCalled()

    userEvent.selectOptions(screen.getByTestId('incidentSortSelect'), [
      SortOptions.STATUS_ASC,
    ])

    expect(onChangeOrdering).toHaveBeenCalledWith(SortOptions.STATUS_ASC)

    userEvent.selectOptions(screen.getByTestId('incidentSortSelect'), [
      SortOptions.STATUS_ASC,
    ])

    expect(onChangeOrdering).toHaveBeenCalledTimes(1)
  })
})
