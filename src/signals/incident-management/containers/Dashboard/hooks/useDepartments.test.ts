// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'

import useFetchAll from 'hooks/useFetchAll'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'

import { useDepartments } from './useDepartments'

const departments = departmentsFixture.results

jest.mock('shared/services/configuration/configuration')

jest.mock('hooks/useFetchAll')

const fetchResponseMock = [
  {
    code: 'CCA',
    name: 'CCA',
    categories: [
      {
        is_responsible: true,
        category: {
          name: 'A',
          slug: 'c',
        },
      },
      {
        is_responsible: true,
        category: {
          name: 'A',
          slug: 'b',
        },
      },
      {
        is_responsible: false,
        category: {
          name: 'B',
          slug: 'a',
        },
      },
    ],
  },
]

describe('useDepartments', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({ list: departments })
    jest.spyOn(React, 'useContext').mockReturnValue({
      departmentsWithResponsibleCategories: {
        departments,
      },
    })
  })

  it('should not fetch departments when useDashboard is false', () => {
    jest.mock('shared/services/configuration/configuration', () => ({
      featureFlags: {
        showDashboard: false,
      },
    }))

    const mockGet = jest.fn()

    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: fetchResponseMock,
      isLoading: false,
      get: mockGet,
    }))

    renderHook(useDepartments)

    expect(mockGet).not.toBeCalled()
  })

  it('should return departments and sort categories', () => {
    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: fetchResponseMock,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: [
        {
          code: 'CCA',
          name: 'CCA',
          categories: [
            {
              category: {
                name: 'A',
                slug: 'b',
              },
              is_responsible: true,
            },
            {
              category: {
                name: 'A',
                slug: 'c',
              },
              is_responsible: true,
            },
          ],
        },
      ],
      isLoading: false,
    })
  })

  it('should return undefined departments when data from useFetchAll is undefined', () => {
    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: undefined,
      isLoading: false,
    })
  })

  it('should return undefined departments when departments from redux are empty', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(undefined)

    jest.mocked(useFetchAll as any).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      get: jest.fn(),
    }))

    const { result } = renderHook(useDepartments)

    expect(result.current).toEqual({
      departments: undefined,
      isLoading: false,
    })
  })
})
