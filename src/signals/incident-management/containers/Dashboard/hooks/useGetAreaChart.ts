import { useFetchAll } from 'hooks'
import { useBuildGetter } from 'hooks/api/useBuildGetter'
import configuration from 'shared/services/configuration/configuration'

import type { AreaChartValue } from '../charts/types'

export const useGetAreaChart = () =>
  useBuildGetter<AreaChartValue[]>(() => {
    return [configuration.INCIDENTS_PAST_WEEK]
  })

// BarChart endpoint: /signals/v1/private/signals/stats/total'

// TODO: create an array of query strings to fetch all

export const useGetBarChart = () => {
  const result = useFetchAll()

  return result
}
;[
  {
    date: '2023-02-07',
    amount: 17,
    amount_week_earlier: 12,
  },
  {
    date: '2023-02-08',
    amount: 3,
    amount_week_earlier: 22,
  },
  {
    date: '2023-02-09',
    amount: 3,
    amount_week_earlier: 6,
  },
  {
    date: '2023-02-10',
    amount: 0,
    amount_week_earlier: 1,
  },
  {
    date: '2023-02-11',
    amount: 0,
    amount_week_earlier: 0,
  },
  {
    date: '2023-02-12',
    amount: 0,
    amount_week_earlier: 1,
  },
  {
    date: '2023-02-13',
    amount: 1,
    amount_week_earlier: 5,
  },
  {
    date: '2023-02-13',
    amount: 1,
    amount_week_earlier: 5,
    image: '/assets/images/area-chart-tooltip.svg',
  },
]
