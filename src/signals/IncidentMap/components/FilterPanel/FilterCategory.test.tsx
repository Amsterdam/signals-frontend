/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import type { Props } from './FilterCategory'
import { FilterCategory } from './FilterCategory'
import userEvent from '@testing-library/user-event'

const mockOnToggleCategory = jest.fn()

const defaultProps: Props = {
  selected: true,
  text: 'mockName',
  onToggleCategory: mockOnToggleCategory,
  icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
}

describe('FilterCategory', () => {
  it('toggles the checkbox on click', async () => {
    render(<FilterCategory {...defaultProps} />)
    screen.debug()
    userEvent.click(screen.getByRole('checkbox'))
  })
})
