// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import vegaEmbed from 'vega-embed'
import type { EmbedOptions } from 'vega-embed'
import IncidentManagementContext from '../../../../context'
import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'

import { ComparisonRate } from './ComparisonRate'
import { AreaChartWrapper as Wrapper } from './styled'
import type { ComparisonRateType } from './types'
import { formatData, getMaxDomain, getToday, getPercentage } from './utils'
import { INCIDENTS_URL } from '../../../../routes'
import { constants, getAreaChartSpec } from '../../charts'
import type { AreaChartValue } from '../../charts'
import { ModuleTitle } from '../ModuleTitle'

const embedOptions: EmbedOptions = {
  actions: false,
  timeFormatLocale: constants.timeFormatLocale,
  mode: 'vega-lite',
}

export const AreaChart = () => {
  const [data, setData] = useState<AreaChartValue[]>()
  const [maxDomain, setMaxDomain] = useState<number>()
  const [comparisonRate, setComparisonRate] = useState<ComparisonRateType>()
  const dispatch = useDispatch()

  const { dashboardFilter, setDashboardFilter } = useContext(
    IncidentManagementContext
  )
  console.log('---  dashboardFilters', dashboardFilter)

  const {
    data: rawData,
    error,
    isLoading,
    get: getAreaChart,
  } = useFetch<AreaChartValue[]>()

  useEffect(() => {
    if (!rawData) {
      getAreaChart(configuration.INCIDENTS_PAST_WEEK, { status: 'o' })
    }
  }, [getAreaChart, rawData])

  useEffect(() => {
    if (rawData) {
      const formattedData = formatData(rawData)
      const maxDomain = getMaxDomain(rawData)
      const comparisonRate = getPercentage(rawData)

      setData(formattedData)
      setMaxDomain(maxDomain)
      setComparisonRate(comparisonRate)
    }
  }, [rawData])

  useEffect(() => {
    if (error) {
      dispatch(
        showGlobalNotification({
          title: 'De data kon niet worden opgehaald',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [error, dispatch])

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (data && maxDomain) {
    const today = getToday()
    const areaChartSpecs = getAreaChartSpec(data, maxDomain, today)

    vegaEmbed('#area-chart', areaChartSpecs, embedOptions)
      .then((result) => {
        result.view.addEventListener('click', function (event, item) {
          console.log('CLICK', event, item?.datum)
          // console.log('time:', Date.parse(item?.datum.date.toString()))

          // const d = new Date(0)
          // console.log('date:', d.setUTCSeconds(item?.datum.date))
          console.log('newData', new Date(item?.datum.date))
          const date = new Date(item?.datum.date)
          console.log('---  date', date)
          setDashboardFilter({
            ...dashboardFilter,
            // incident_date: { value: '2023-02-28', display: '' },
            created_after: { value: '2023-02-27', display: '' },
            created_before: { value: '2023-02-28', display: '' },
            status: { value: 'o', display: '' },
          })
          // console.log('time:', item?.datum.date)
        })
      })
      .catch(console.warn)

    // vegaEmbed('#area-chart', areaChartSpecs, embedOptions)
  }

  return (
    <>
      <Wrapper>
        <ModuleTitle title="Afgehandelde meldingen afgelopen 7 dagen" />
        <div id="area-chart" data-testid="area-chart" />
        {comparisonRate && <ComparisonRate comparisonRate={comparisonRate} />}
      </Wrapper>
      <Link to={{ pathname: INCIDENTS_URL, state: { useBacklink: true } }}>
        <button>OVERVIEW</button>
      </Link>
    </>
  )
}
