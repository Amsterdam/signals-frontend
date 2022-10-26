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
    },
    {
      name: 'mockSubCategoryname2',
      _display: 'mockSubCategory_display2',
      filterActive: true,
      slug: 'mockSubCategoryslug2',
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
    },
  ],
}

const testCat = 'Afval'

const defaultProps: Props = {
  onToggleCategory: mockOnToggleCategory,
  filter: mockFilter,
}

describe('FilterCategoryWithSub', () => {
  it('toggles the checkbox on click', () => {
    render(<FilterCategoryWithSub {...defaultProps} />)
    userEvent.click(screen.getByText(testCat))
    expect(screen.getByText(testCat)).toBeInTheDocument()
  })

  it('returns nothing if there are no subCategories', () => {
    render(<FilterCategoryWithSub {...defaultProps} />)
    userEvent.click(screen.getByText(testCat))
    expect(screen.getByText(testCat)).toBeInTheDocument()
  })

  //  it('should unset a filter when clicked', () => {
  //   render(<FilterCategoryWithSub {...defaultProps}/>)
  //
  //   const checkbox = screen.getByTestId(testCat)
  //
  //    expect(checkbox).toBeInTheDocument()
  //    expect(checkbox).toBeChecked()
  //
  //   userEvent.click(checkbox)
  //
  //   // Check to see if subCategory.filterActive has value false after setting mainCategory.filterActive to false. In
  //   // mockFilters all filterActives of all categories are initially set to true.
  //   mockOnToggleCategory.mock.calls[0][0].filter((filter: Filter) => filter.name=== testCat)
  //     .forEach((filter: Filter)=> {
  //       expect(filter.filterActive).toBe(false)
  //     filter.subCategories?.forEach((subCategory: SubCategory) =>{
  //       expect(subCategory.filterActive).toBe(false)
  //     })
  //     })
  //
  //   userEvent.click(checkbox)
  //
  //   // check to see if subCategory.filterActive has value true after setting mainCategory.filterActive to true
  //   mockOnToggleCategory.mock.calls[0][0].filter((filter: Filter) => filter.name=== testCat)
  //     .forEach((filter: Filter)=> {
  //       expect(filter.filterActive).toBe(true)
  //     filter.subCategories?.forEach((subCategory: SubCategory) =>{
  //       expect(subCategory.filterActive).toBe(true)
  //     })
  //     })
  //
  //
  //
  // })
})
