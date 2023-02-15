// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import type { GetHookResponse } from 'hooks/api/types'
import { withAppContext } from 'test/utils'

import { AreaChart } from './AreaChart'
import type { AreaChartValue } from '../../charts/types'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

jest.mock('../../hooks/useGetAreaChart', () => ({
  __esModule: true,
  useGetAreaChart: jest.fn(() => mockResult),
}))

const mockData: AreaChartValue[] = [
  { date: '01 Jan 2012 12:00', amount: 48, amount_week_earlier: 30 },
  { date: '02 Jan 2012 12:00', amount: 34, amount_week_earlier: 33 },
  { date: '03 Jan 2012 12:00', amount: 44, amount_week_earlier: 32 },
  { date: '04 Jan 2012 12:00', amount: 40, amount_week_earlier: 10 },
  { date: '05 Jan 2012 12:00', amount: 48, amount_week_earlier: 40 },
  { date: '06 Jan 2012 12:00', amount: 45, amount_week_earlier: 20 },
  {
    date: '07 Jan 2012 12:00',
    amount: 50,
    amount_week_earlier: 20,
    image: '/assets/images/area-chart-tooltip.svg',
  },
]

let mockResult: GetHookResponse<AreaChartValue[], any[]> = {
  data: undefined,
  error: false,
  isLoading: false,
  get: jest.fn(),
}

describe('AreaChart', () => {
  it('should render correctly', () => {
    mockResult = {
      ...mockResult,
      data: mockData,
    }
    render(withAppContext(<AreaChart queryString="department=ASC" />))

    const title = screen.getByRole('heading', {
      name: 'Afgehandelde meldingen afgelopen 7 dagen',
    })

    expect(title).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Arrow up' })).toBeInTheDocument()
  })

  it('should return loading incicator when loading', () => {
    mockResult = {
      ...mockResult,
      data: undefined,
      isLoading: true,
    }
    render(withAppContext(<AreaChart queryString="department=ASC" />))

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should show an error when there is one', () => {
    mockResult = {
      ...mockResult,
      data: undefined,
      error: true,
    }
    render(withAppContext(<AreaChart queryString="department=ASC" />))

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
