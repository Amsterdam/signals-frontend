import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import Sort, { SortOptions } from '.'

const onChangeOrdering = jest.fn()

jest.mock('shared/services/configuration/configuration')

describe('Sort', () => {
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
    onChangeOrdering.mockReset()
  })

  it('renders sort options', () => {
    render(withAppContext(<Sort onChangeOrdering={onChangeOrdering} />))

    expect(screen.getByTestId('incidentSortSelect')).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('option')).not.toContain(
      document.querySelector(
        `option[value="${SortOptions.ASSIGNED_USER_EMAIL_ASC}"]`
      )
    )
    expect(screen.getAllByRole('option')).not.toContain(
      document.querySelector(
        `option[value="${SortOptions.ASSIGNED_USER_EMAIL_DESC}"]`
      )
    )
    expect(screen.getAllByText(/Stadsdeel/)).toHaveLength(2)
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

  it('renders options when feature assignSignalToEmployee is set', () => {
    configuration.featureFlags.assignSignalToEmployee = true

    render(withAppContext(<Sort onChangeOrdering={onChangeOrdering} />))

    expect(screen.getAllByRole('option')).toContain(
      document.querySelector(
        `option[value="${SortOptions.ASSIGNED_USER_EMAIL_ASC}"]`
      )
    )
    expect(screen.getAllByRole('option')).toContain(
      document.querySelector(
        `option[value="${SortOptions.ASSIGNED_USER_EMAIL_DESC}"]`
      )
    )
  })

  it('renders the correct option label when feature fetchDistrictsFromBackend is set', () => {
    const DISTRICT = 'District'

    configuration.featureFlags.fetchDistrictsFromBackend = true
    configuration.language.district = DISTRICT

    render(withAppContext(<Sort onChangeOrdering={onChangeOrdering} />))

    expect(screen.queryAllByText(/Stadsdeel/)).toHaveLength(0)
    expect(screen.queryAllByText(new RegExp(`${DISTRICT}`))).toHaveLength(2)
  })
})
