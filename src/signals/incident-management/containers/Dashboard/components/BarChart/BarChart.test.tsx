// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import type { GetHookResponse } from 'hooks/api/types'
import { withAppContext } from 'test/utils'

import { BarChart } from './BarChart'
import type { RawData } from './types'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

jest.mock('../../hooks/useGetBarChart', () => ({
  __esModule: true,
  useGetBarChart: jest.fn(() => mockResult),
}))

const mockData: RawData[] = [
  {
    total: 81,
    results: [],
  },
  {
    total: 131,
    results: [],
  },
  {
    total: 132,
    results: [],
  },
  {
    total: 78,
    results: [],
  },
  {
    total: 57,
    results: [],
  },
  {
    total: 559,
    results: [],
  },
  {
    total: 387,
    results: [],
  },
  {
    total: 0,
    results: [],
  },
  {
    total: 6513,
    results: [],
  },
  {
    total: 1948,
    results: [],
  },
  {
    total: 75,
    results: [],
  },
]

let mockResult: GetHookResponse<RawData[], any[]> = {
  data: undefined,
  error: false,
  isLoading: false,
  get: jest.fn(),
}

describe('BarChart', () => {
  it('should render correctly', () => {
    mockResult = {
      ...mockResult,
      data: mockData,
    }

    render(
      withAppContext(
        <BarChart queryString="category_slug=rolcontainer-is-vol" />
      )
    )

    const title = screen.getByRole('heading', {
      name: 'Openstaande meldingen tot en met vandaag 9961',
    })

    expect(title).toBeInTheDocument()
  })

  it('should return loading indicator when loading', () => {
    mockResult = {
      ...mockResult,
      data: undefined,
      isLoading: true,
    }
    render(
      withAppContext(
        <BarChart queryString="category_slug=rolcontainer-is-vol" />
      )
    )

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should show one error', () => {
    mockResult = {
      ...mockResult,
      data: undefined,
      error: true,
    }
    render(
      withAppContext(
        <BarChart queryString="category_slug=rolcontainer-is-vol" />
      )
    )

    expect(dispatch).toBeCalledWith({
      payload: {
        title: 'De data kon niet worden opgehaald',
        type: 'local',
        variant: 'error',
      },
      type: 'sia/App/SHOW_GLOBAL_NOTIFICATION',
    })
  })
})
