// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useGetContextReporter from 'hooks/api/useGetContextReporter'
import useGetIncident from 'hooks/api/useGetIncident'

import type { Incident, Incidents } from './types'

export const PAGE_SIZE = 10

export interface FetchReporterHook {
  selectIncident: (id: number) => void
  incident: Incident
  incidents: Incidents
  currentPage: number
  setCurrentPage: (page: number) => void
}

export const useFetchReporter = (id: string): FetchReporterHook => {
  const storeDispatch = useDispatch()
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>()
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: getReporterData,
    error: getReporterError,
    isLoading: getReporterLoading,
    get: getContextReporter,
  } = useGetContextReporter()

  const incidents = {
    isLoading: getReporterLoading,
    data: getReporterData && {
      count: getReporterData.count,
      list: getReporterData.results.map((result) => ({
        id: result.id,
        canView: result.can_view_signal,
        category: result.category.sub,
        feedback: result.feedback
          ? {
              isSatisfied: result.feedback.is_satisfied,
              submittedAt: result.feedback.submitted_at,
            }
          : null,
        createdAt: result.created_at,
        hasChildren: result.has_children,
        status: result.status.state_display,
      })),
    },
  }

  const canView = incidents.data?.list.find(
    (item) => item.id === selectedIncidentId
  )?.canView

  const {
    error: getSelectedIncidentError,
    isLoading: getSelectedIncidentLoading,
    data: getSelectedIncidentData,
    get: getIncident,
  } = useGetIncident()

  useEffect(() => {
    if (canView && selectedIncidentId) {
      getIncident(selectedIncidentId)
    }
  }, [getIncident, canView, selectedIncidentId])

  const incident = {
    isLoading: getSelectedIncidentLoading,
    data: getSelectedIncidentData,
    id: selectedIncidentId,
    canView,
  }

  useEffect(() => {
    setSelectedIncidentId(getReporterData?.results[0]?.id)
  }, [getReporterData])

  useEffect(() => {
    if (id) {
      getContextReporter(Number(id), {
        page: currentPage,
        pageSize: PAGE_SIZE,
      })
    }
  }, [getContextReporter, id, currentPage])

  useEffect(() => {
    if (getReporterError || getSelectedIncidentError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [getReporterError, storeDispatch, getSelectedIncidentError])

  return {
    selectIncident: setSelectedIncidentId,
    incident,
    incidents,
    currentPage,
    setCurrentPage,
  }
}
