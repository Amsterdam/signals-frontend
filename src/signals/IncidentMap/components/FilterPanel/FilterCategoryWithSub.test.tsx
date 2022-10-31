/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FilterCategoryWithSub } from './FilterCategoryWithSub'
import type { Props } from './FilterCategoryWithSub'

const mockOnToggleCategory = jest.fn()
const mockFilter = {
  name: 'Afval',
  _display: 'mock_display',
  filterActive: true,
  slug: 'mockSlug',
  icon: '',
  subCategories: [
    {
      name: 'mockSubCategoryname1',
      _display: 'mockSubCategory_display1',
      filterActive: true,
      slug: 'mockSubCategoryslug1',
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      nrOfIncidents: 1,
    },
    {
      name: 'mockSubCategoryname2',
      _display: 'mockSubCategory_display2',
      filterActive: true,
      slug: 'mockSubCategoryslug2',
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      nrOfIncidents: 1,
    },
  ],
  nrOfIncidents: 2,
}

const testCategory = 'Afval'
const testSubCategroy = 'mockSubCategory_display2'

const defaultProps: Props = {
  onToggleCategory: mockOnToggleCategory,
  filter: mockFilter,
}

const renderFilterCategoryWithSub = (props: Partial<Props> = {}) =>
  render(<FilterCategoryWithSub {...defaultProps} {...props} />)

describe('FilterCategoryWithSub', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('toggles the category checkbox on click', () => {
    renderFilterCategoryWithSub()
    const checkbox = screen.getByText(testCategory)
    userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked() // not, because filters are automatically checked at the start
  })

  it('toggles the sub category checkbox on click', () => {
    renderFilterCategoryWithSub()
    const checkbox = screen.getByText(testSubCategroy)
    userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked() // not, because filters are automatically checked at the start
  })

  it('returns nothing if there are no subCategories', () => {
    const mockNoSubCategoryFilter = {
      name: 'Afval',
      _display: 'mock_display',
      filterActive: true,
      slug: 'mockSlug',
      icon: '',
      nrOfIncidents: 3,
    }

    const { container } = renderFilterCategoryWithSub({
      filter: mockNoSubCategoryFilter,
    })
    expect(container).toBeEmptyDOMElement()
  })
  it('shows the subCategories when the chevron is clicked', () => {
    renderFilterCategoryWithSub()
    const chevron = screen.getByRole('button', {
      name: 'Toon meer filter opties',
    })
    userEvent.click(chevron)
    expect(screen.getByText('mockSubCategory_display1')).toBeInTheDocument()
  })

  it('returns nothing if there are no incidents of that category', () => {
    const mockNoSubCategoryFilter = {
      name: 'Afval',
      _display: 'mock_display',
      filterActive: true,
      slug: 'mockSlug',
      icon: '',
      nrOfIncidents: 0,
    }

    const { container } = renderFilterCategoryWithSub({
      filter: mockNoSubCategoryFilter,
    })
    expect(container).toBeEmptyDOMElement()
  })
})
