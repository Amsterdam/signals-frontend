// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import type { EmbedOptions } from 'vega-embed'
import vegaEmbed from 'vega-embed'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'

import { ComparisonRate } from './ComparisonRate'
import { AreaChartWrapper as Wrapper, StyledAreaChart } from './styled'
import type { ComparisonRateType } from './types'
import { formatData, getMaxDomain, getPercentage, getToday } from './utils'
import { INCIDENTS_URL } from '../../../../routes'
import type { AreaChartValue } from '../../charts'
import { constants, getAreaChartSpec } from '../../charts'
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
  const [, setWidth] = useState(0)
  const [data, setData] = useState<AreaChartValue[]>()
  const [maxDomain, setMaxDomain] = useState<number>()
  const appHtmlElement = document.getElementById('bar-chart')
  const maxHeight = appHtmlElement ? appHtmlElement.offsetHeight : 0
  const [comparisonRate, setComparisonRate] = useState<ComparisonRateType>()
  const dispatch = useDispatch()

  const {
    data: rawData,
    error,
    isLoading,
    get: getAreaChart,
  } = useGetAreaChart()

  const onResize = () => {
    //Trigger a rerender. Vega lite resize is buggy and doesn't do it properly.
    setWidth(window.innerWidth)
  }

  window.addEventListener('resize', onResize)

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
    const AreaChartSpecs = getAreaChartSpec(data, maxDomain, today, maxHeight)

    vegaEmbed('#area-chart', AreaChartSpecs, embedOptions)
  }

  return (
    <Wrapper>
      <Link to={{ pathname: INCIDENTS_URL, state: { useBacklink: true } }}>
        <ModuleTitle title="Afgehandelde meldingen afgelopen 7 dagen" />
        <StyledAreaChart id="area-chart" data-testid="area-chart" />
        {comparisonRate && <ComparisonRate comparisonRate={comparisonRate} />}
      </Link>
    </Wrapper>
  )
}
