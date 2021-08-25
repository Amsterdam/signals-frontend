import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Filter } from 'shared/types/filter'

import QuickFilter from '../QuickFilter'

describe('QuickFilter', () => {
  const filters: Filter[] = [
    {
      created_at: '123',
      id: 123,
      name: 'Foo',
      options: {},
      refresh: false,
      show_on_overview: true,
    },
    {
      created_at: '456',
      id: 456,
      name: 'Bar',
      options: {},
      refresh: false,
      show_on_overview: true,
    },
  ]
  const setFilterSpy = jest.fn()

  it('does not render without predefined filters', () => {
    render(<QuickFilter setFilter={setFilterSpy} filters={[]} />)

    expect(screen.queryByText('Mijn filters:')).not.toBeInTheDocument()
  })

  it('renders list of filters', () => {
    render(<QuickFilter setFilter={setFilterSpy} filters={filters} />)

    expect(screen.getByText('Mijn filters:')).toBeInTheDocument()
    filters.map((filter) => {
      expect(screen.getByText(filter.name)).toBeInTheDocument()
    })
  })

  it('calls setFilter when filter is selected', () => {
    const filter = filters[0]
    render(<QuickFilter setFilter={setFilterSpy} filters={filters} />)

    expect(setFilterSpy).not.toHaveBeenCalledWith(filter)

    const filterLink = screen.getByText(filter.name)
    userEvent.click(filterLink)

    expect(setFilterSpy).toHaveBeenCalledWith(filter)
  })
})
