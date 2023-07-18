// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import { withAppContext } from 'test/utils'

import type { Props } from './SelectedSubcategories'
import { SelectedSubcategories } from './SelectedSubcategories'
import { mockSubcategory } from '../../_test_/mock-subcategories'

const defaultProps: Props = {
  name: 'selectedSubcategories',
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
      value: ['4', '79'],
    }

    render(withAppContext(<SelectedSubcategories {...errorProps} />))

    expect(screen.getByText('Vul de subcategorie(ën) in.')).toBeInTheDocument()
  })

  it('should not render the SelectedSubcategories', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue([])

    render(withAppContext(<SelectedSubcategories {...defaultProps} />))

    expect(screen.queryByText('Afval, Overlast')).not.toBeInTheDocument()
  })
})
