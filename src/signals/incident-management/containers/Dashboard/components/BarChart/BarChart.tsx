// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useEffect, useState, useMemo } from 'react'

import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import vegaEmbed from 'vega-embed'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetchAll } from 'hooks'
import { statusListDashboard as statusList } from 'signals/incident-management/definitions/statusList'

import { Link, Wrapper } from './styled'
import type { RawData } from './types'
import {
  getMaxDomain,
  getQueryList,
  getTotalNrOfIncidents,
  formatData,
} from './utils'
import IncidentManagementContext from '../../../../context'
import type { IncidentManagementContextType } from '../../../../context'
import { INCIDENTS_URL } from '../../../../routes'
import { getBarChartSpecs } from '../../charts'
import type { BarChartValue } from '../../charts'
import type { VegaLiteBarChartItem } from '../BarChart/types'
import { ModuleTitle } from '../ModuleTitle'

interface Props {
  queryString: string
}

export const BarChart = ({ queryString }: Props) => {
  const [data, setData] = useState<BarChartValue[]>()
  const [total, setTotal] = useState<number>()
  const queryList = useMemo(() => getQueryList(queryString), [queryString])
  const { setDashboardFilter } = useContext<IncidentManagementContextType>(
    IncidentManagementContext
  )
  const history = useHistory()
  const dispatch = useDispatch()

  const {
    data: rawData,
    error,
    isLoading,
    get: getBarChart,
  } = useFetchAll<RawData>()

  const goTo = () => {
    history.push({
      pathname: INCIDENTS_URL,
      state: { useDashboardFilters: true },
    })
  }

  const handleOnClick = () => {
    setDashboardFilter((prevFilter) => ({
      ...prevFilter,
      status: {
        display: 'Status',
        value: statusList.map((status) => status.slug),
      },
    }))

    goTo()
  }

  useEffect(() => {
    getBarChart(queryList)
  }, [getBarChart, queryList])

  useEffect(() => {
    if (rawData) {
      const formattedData = formatData(rawData)
      const totalIncidents = getTotalNrOfIncidents(rawData)
      setTotal(totalIncidents)
      setData(formattedData)
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

  if (data) {
    const maxDomain = getMaxDomain(data)
    const barChartSpecs = getBarChartSpecs(data, maxDomain)

    vegaEmbed('#bar-chart', barChartSpecs, { actions: false })
      .then((result) => {
        result.view.addEventListener('click', (_event, item) => {
          const barChartItem = item as VegaLiteBarChartItem
          setDashboardFilter((prevFilter) => ({
            ...prevFilter,
            status: {
              value: [barChartItem?.datum.slug],
              display: barChartItem?.datum.status,
            },
          }))

          goTo()
        })
      })
      .catch(console.warn)
  }

  return (
    <Wrapper>
      <Link
        onClick={handleOnClick}
        onKeyDown={handleOnClick}
        role="button"
        tabIndex={0}
      >
        <ModuleTitle
          title="Openstaande meldingen tot en met vandaag"
          amount={total?.toString()}
        />
      </Link>
      <div data-testid="bar-chart" id="bar-chart" />
    </Wrapper>
  )
}
