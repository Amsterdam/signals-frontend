// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import { mockSubcategory } from './mock-subcategories'
import type { Props } from './SelectedSubcategories'
import { SelectedSubcategories } from './SelectedSubcategories'
import { withAppContext } from '../../../../../../test/utils'

const defaultProps: Props = {
  name: 'selectedSubcategories',
  onChange: jest.fn(),
  value: ['4', '79'],
}

describe('SelectedSubcategories', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(mockSubcategory)
  })
  it('should render the SelectedSubcategories', () => {
    render(withAppContext(<SelectedSubcategories {...defaultProps} />))

    expect(
      screen.getByRole('button', { name: 'Selecteer subcategorie(ën)' })
    ).toBeInTheDocument()
    expect(screen.getByText('Afval, Overlast')).toBeInTheDocument()
  })

  it('should show the error message when there is an error', () => {
    const errorProps: Props = {
      name: 'selectedSubcategories',
      error: { type: 'something', message: 'Vul de subcategorie(ën) in.' },
      onChange: jest.fn(),
      value: ['4', '79'],
    }

    render(withAppContext(<SelectedSubcategories {...errorProps} />))

    expect(screen.getByText('Vul de subcategorie(ën) in.')).toBeInTheDocument()
  })
})
