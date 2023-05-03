/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 - 2023 Gemeente Amsterdam */
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
      incidentsCount: 1,
    },
    {
      name: 'mockSubCategoryname2',
      _display: '',
      filterActive: true,
      slug: 'mockSubCategoryslug2',
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      incidentsCount: 1,
    },
  ],
  incidentsCount: 2,
}

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

  it('returns nothing if there are no subCategories', () => {
    const mockNoSubCategoryFilter = {
      name: 'Afval',
      _display: 'mock_display',
      filterActive: true,
      slug: 'mockSlug',
      icon: '',
      incidentsCount: 3,
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
    expect(screen.getByText('mockSubCategoryname2')).toBeInTheDocument()

    const updatedChevron = screen.queryByRole('button', {
      name: 'Toon meer filter opties',
    })

    expect(updatedChevron).not.toBeInTheDocument()
  })

  it('should hit the subcategory toggle', function () {
    renderFilterCategoryWithSub()

    const checkBox1 = screen.queryByRole('checkbox', {
      name: /mockSubCategory_display1/,
    })
    const chevron = screen.getByRole('button', {
      name: 'Toon meer filter opties',
    })

    expect(checkBox1).not.toBeInTheDocument()

    userEvent.click(chevron)

    const checkBox = screen.getByRole('checkbox', {
      name: /mockSubCategory_display1/,
    })

    expect(checkBox).toBeInTheDocument()

    userEvent.click(checkBox)

    expect(mockOnToggleCategory).toBeCalled()
  })

  it('returns nothing if there are no incidents of that category', () => {
    const mockNoSubCategoryFilter = {
      name: 'Afval',
      _display: 'mock_display',
      filterActive: true,
      slug: 'mockSlug',
      icon: '',
      incidentsCount: 0,
    }

    const { container } = renderFilterCategoryWithSub({
      filter: mockNoSubCategoryFilter,
    })
    expect(container).toBeEmptyDOMElement()
  })

  it('should render _display name when existing, else name', () => {
    renderFilterCategoryWithSub()

    expect(screen.getByText('mockSubCategory_display1')).toBeInTheDocument()
    expect(
      screen.queryByText('mockSubCategory_display2')
    ).not.toBeInTheDocument()
    expect(screen.getByText('mockSubCategoryname2')).toBeInTheDocument()
  })
})
