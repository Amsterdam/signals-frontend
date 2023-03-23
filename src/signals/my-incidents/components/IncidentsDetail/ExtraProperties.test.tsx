/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2023 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'

import { ExtraProperties } from './ExtraProperties'

const mockExtraProperties = [
  {
    id: 'extra_drugs_verkoop',
    label: 'Verkoop drugs',
    answer: {
      id: 'nee',
      info: '',
      label: 'Nee, ik denk dat er geen drugs worden verkocht',
    },
    category_url:
      '/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
  },
  {
    id: 'extra_personen_overig',
    label: 'Aantal personen',
    answer: {
      id: '7_of_meer',
      info: '',
      label: '7 of meer',
    },
    category_url:
      '/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
  },
  {
    id: 'extra_personen_overig_vaker',
    label: 'Vaker',
    answer: {
      id: 'ja',
      info: '',
      label: 'Ja, het gebeurt vaker',
    },
    category_url:
      '/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
  },
  {
    id: 'extra_personen_overig_vaker_momenten',
    label: 'Momenten',
    answer: 'Het gebeurd elke dag om 10.00u',
    category_url:
      '/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen',
  },
]

describe('ExtraProperties', () => {
  it('should render an array of additional answers correctly', () => {
    render(<ExtraProperties items={mockExtraProperties} />)

    expect(screen.getByText('Verkoop drugs')).toBeInTheDocument()
    expect(
      screen.getByText('Nee, ik denk dat er geen drugs worden verkocht')
    ).toBeInTheDocument()
    expect(screen.getByText('Vaker')).toBeInTheDocument()
    expect(screen.getByText('Ja, het gebeurt vaker')).toBeInTheDocument()
  })

  it('should render an object of additional answers correctly', () => {
    const mockExtraPropertiesWithObject = {
      'Gebeurt het vaker?': 'nee',
    }
    render(<ExtraProperties items={mockExtraPropertiesWithObject} />)
  })

  it('should render null when no extra properties exist', () => {
    const { container } = render(<ExtraProperties />)

    expect(container.firstChild).toEqual(null)
  })
})
