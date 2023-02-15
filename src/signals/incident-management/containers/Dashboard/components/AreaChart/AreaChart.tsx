// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import vegaEmbed from 'vega-embed'
import type { EmbedOptions } from 'vega-embed'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'

import { ComparisonRate } from './ComparisonRate'
import { AreaChartWrapper as Wrapper } from './styled'
import type { ComparisonRateType } from './types'
import { formatData, getToday, getPercentage } from './utils'
import { getMaxDomain } from './utils'
import { INCIDENTS_URL } from '../../../../routes'
import { getAreaChartSpec } from '../../charts'
import { constants } from '../../charts'
import type { AreaChartValue as Value } from '../../charts/types'
import { useGetAreaChart } from '../../hooks/useGetAreaChart'
import { ModuleTitle } from '../ModuleTitle'

const embedOptions: EmbedOptions = {
  actions: false,
  timeFormatLocale: constants.timeFormatLocale,
  mode: 'vega-lite',
}

interface Props {
  queryString: string
}

export const AreaChart = ({ queryString }: Props) => {
  const [data, setData] = useState<Value[]>()
  const [maxDomain, setMaxDomain] = useState<number>()
  const [comparisonRate, setComparisonRate] = useState<ComparisonRateType>()
  const dispatch = useDispatch()

  const {
    data: rawData,
    error,
    isLoading,
    get: getAreaChart,
  } = useGetAreaChart()

  useEffect(() => {
    getAreaChart(queryString)
  }, [getAreaChart, queryString])

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
    const AreaChartSpecs = getAreaChartSpec(data, maxDomain, today)

    vegaEmbed('#area-chart', AreaChartSpecs, embedOptions)
  }

  return (
    <Link to={{ pathname: INCIDENTS_URL, state: { useBacklink: true } }}>
      <Wrapper>
        <ModuleTitle title="Afgehandelde meldingen afgelopen 7 dagen" />
        <div id="area-chart" data-testid="area-chart" />
        {comparisonRate && <ComparisonRate comparisonRate={comparisonRate} />}
      </Wrapper>
    </Link>
  )
}
