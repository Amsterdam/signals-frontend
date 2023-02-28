// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import useFetch from 'hooks/useFetch'
import {
  get,
  useFetchResponse,
} from 'signals/IncidentMap/components/__test__/utils'
import { withAppContext } from 'test/utils'

import { AreaChart } from './AreaChart'
import type { AreaChartValue } from '../../charts/types'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

jest.mock('hooks/useFetch')

const mockData: AreaChartValue[] = [
  // { date: '01 Jan 2012 12:00', amount: 48, amount_week_earlier: 30 },
  // { date: '02 Jan 2012 12:00', amount: 34, amount_week_earlier: 33 },
  // { date: '03 Jan 2012 12:00', amount: 44, amount_week_earlier: 32 },
  // { date: '04 Jan 2012 12:00', amount: 40, amount_week_earlier: 10 },
  // { date: '05 Jan 2012 12:00', amount: 48, amount_week_earlier: 40 },
  // { date: '06 Jan 2012 12:00', amount: 45, amount_week_earlier: 20 },
  // {
  //   date: '07 Jan 2012 12:00',
  //   amount: 50,
  //   amount_week_earlier: 20,
  //   image: '/assets/images/area-chart-tooltip.svg',
  // },
]

describe('AreaChart', () => {
  it('should render correctly', () => {
    jest
      .mocked(useFetch)
      .mockImplementation(() => ({ ...useFetchResponse, data: mockData }))

    render(withAppContext(<AreaChart />))

    const title = screen.getByRole('heading', {
      name: 'Afgehandelde meldingen afgelopen 7 dagen',
    })

    expect(title).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Arrow up' })).toBeInTheDocument()
  })

  it('should return loading indicator when loading', () => {
    jest
      .mocked(useFetch)
      .mockImplementation(() => ({ ...useFetchResponse, isLoading: true }))

    render(withAppContext(<AreaChart />))

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    expect(get).toHaveBeenCalledWith(
      'http://localhost:8000/signals/v1/private/signals/stats/past_week',
      { status: 'o' }
    )
  })

  it('should show one error', () => {
    jest
      .mocked(useFetch)
      .mockImplementation(() => ({ ...useFetchResponse, error: true }))
    render(withAppContext(<AreaChart />))

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
