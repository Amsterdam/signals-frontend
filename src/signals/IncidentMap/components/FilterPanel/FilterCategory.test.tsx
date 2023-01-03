/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './FilterCategory'
import { FilterCategory } from './FilterCategory'

const mockOnToggleCategory = jest.fn()

const defaultProps: Props = {
  selected: true,
  text: 'mockName',
  onToggleCategory: mockOnToggleCategory,
  icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
}

describe('FilterCategory', () => {
  beforeEach(() => {
    mockOnToggleCategory.mockReset()
  })

  it('checkbox is checked by default and toggle on click', () => {
    render(<FilterCategory {...defaultProps} />)

    expect(screen.getByRole('checkbox', { name: /mockName/ })).toBeChecked()

    const checkBox = screen.getByRole('checkbox', { name: /mockName/ })

    checkBox.click()

    expect(mockOnToggleCategory).toBeCalledTimes(1)
  })

  it('should toggle when pressing enter on focus', function () {
    render(<FilterCategory {...defaultProps} />)

    const checkBox = screen.getByRole('checkbox', { name: /mockName/ })

    checkBox.focus()

    userEvent.keyboard('{enter}')

    expect(mockOnToggleCategory).toBeCalledTimes(1)
  })

  it('should toggle when pressing space on focus', function () {
    render(<FilterCategory {...defaultProps} />)

    const checkBox = screen.getByRole('checkbox', { name: /mockName/ })

    checkBox.focus()

    userEvent.keyboard('{space}')

    expect(mockOnToggleCategory).toBeCalledTimes(1)
  })
})
