// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'

import departmentFixture from 'utils/__tests__/fixtures/department.json'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { useFilters } from './useFilter'

const departments = departmentsFixture.results
const department = departmentFixture

describe('useFilter', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(departments)
    jest.spyOn(React, 'useContext').mockReturnValue({
      departmentsWithResponsibleCategories: {
        departments: [department],
      },
    })
  })

  it('should select the first department by default and its associated categories', () => {
    const { result } = renderHook(useFilters)
    expect(result.current[0].name).toBe('department')
    expect(result.current[1].name).toBe('category_slug')
    expect(result.current[1].options[0].value).toBe('boom-boomstob')
  })

  it('should return filter data, including categories based on the first department name', () => {
    const { result } = renderHook(useFilters, {
      initialProps: {
        value: 'ASC',
        display: 'Actie Service Centrum',
      },
    })
    expect(result.current[0].name).toBe('department')
    expect(result.current[1].name).toBe('category_slug')
    expect(result.current[1].options[0].value).toBe('boom-boomstob')
  })
})
