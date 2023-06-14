// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import { useFetch } from 'hooks'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { setClassification } from 'signals/incident/containers/IncidentContainer/actions'
import { getClassificationData } from 'signals/incident/containers/IncidentContainer/selectors'
import type SubCategory from 'types/api/sub-category'

const IncidentClassification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { category, subcategory } = useParams<{
    category: string
    subcategory: string
  }>()
  const { get, data, error } = useFetch<SubCategory>()
  const dispatch = useDispatch()
  const incidentFormPath = `/incident/beschrijf${location.search}`

  useEffect(() => {
    if (getIsAuthenticated()) {
      navigate(incidentFormPath, { replace: true })
    } else {
      get(
        `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
      )
    }
  }, [category, subcategory, get, incidentFormPath, navigate])

  useEffect(() => {
    if (data?.is_active) {
      dispatch(
        setClassification(getClassificationData(category, subcategory, data))
      )
    }
    if (data || error) {
      navigate(incidentFormPath, { replace: true })
    }
  }, [data, error, dispatch, category, subcategory, incidentFormPath, navigate])

  // This shows a loading indicator, it is used to build the logic
  // for setting the category and subcategory from the url
  // before redirecting to the incident page
  return <LoadingIndicator />
}

export default IncidentClassification
