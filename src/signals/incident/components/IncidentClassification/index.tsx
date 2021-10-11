// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'

import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClassification } from 'signals/incident/containers/IncidentContainer/actions'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import LoadingIndicator from 'components/LoadingIndicator'
import { getClassificationData } from 'signals/incident/containers/IncidentContainer/selectors'
import type SubCategory from 'types/api/sub-category'

const IncidentClassification = () => {
  const history = useHistory()
  const { category, subcategory } = useParams<{
    category: string
    subcategory: string
  }>()
  const { get, data, error } = useFetch<SubCategory>()
  const dispatch = useDispatch()
  const incidentFormPath = `/incident/beschrijf${history.location.search}`

  useEffect(() => {
    if (getIsAuthenticated()) {
      history.replace(incidentFormPath)
    } else {
      get(
        `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
      )
    }
  }, [category, subcategory, get, history, incidentFormPath])

  useEffect(() => {
    if (data?.is_active) {
      dispatch(
        setClassification(getClassificationData(category, subcategory, data))
      )
    }
    if (data || error) {
      history.replace(incidentFormPath)
    }
  }, [data, error, history, dispatch, category, subcategory, incidentFormPath])

  // This shows a loading indicator, it is used to build the logic
  // for setting the category and subcategory from the url
  // before redirecting to the incident page
  return <LoadingIndicator />
}

export default IncidentClassification
