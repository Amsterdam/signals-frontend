// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Filter } from '../../types'
import { mockIncidents, mockFilters } from '../__test__'
import { getFilteredIncidents } from './get-filtered-incidents'

const mockSelectedFilters: Filter[] = [
  {
    name: 'Afval',
    _display: 'Afval',
    filterActive: true,
    slug: 'afval',
    subCategories: [
      {
        name: 'Afvalsub1',
        _display: 'Afvalsub1',
        filterActive: true,
        slug: 'afvalsub1',
      },
      {
        name: 'Afvalsub2',
        _display: 'Afvalsub2',
        filterActive: true,
        slug: 'afvalsub2',
      },
    ],
  },
  {
    name: 'Overig',
    _display: 'Overig',
    filterActive: false,
    slug: 'overig',
    subCategories: [
      {
        name: 'Overigsub1',
        _display: 'Overigsub1',
        filterActive: false,
        slug: 'overigsub1',
      },
    ],
  },
  {
    name: 'Schoon',
    _display: 'Schoon',
    filterActive: false,
    slug: 'schoon',
    subCategories: [],
  },
]

describe('getFilteredIncidents', () => {
  it('should return only active filters', () => {
    const result = getFilteredIncidents(mockFilters, mockIncidents)

    expect(result).toEqual(mockIncidents)

    const resultTwo = getFilteredIncidents(mockSelectedFilters, mockIncidents)

    expect(resultTwo.length).toEqual(1)
  })
})
