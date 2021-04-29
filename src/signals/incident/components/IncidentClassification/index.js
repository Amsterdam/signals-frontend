// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'

import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClassification } from 'signals/incident/containers/IncidentContainer/actions'
import { isAuthenticated } from 'shared/services/auth/auth'
import LoadingIndicator from 'components/LoadingIndicator'
import { getClassificationData } from 'signals/incident/containers/IncidentContainer/selectors'

const IncidentClassification = () => {
  const history = useHistory()
  const { category, subcategory } = useParams()
  const { get, data, error } = useFetch()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated()) {
      history.replace('/')
    } else {
      get(
        `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`
      )
    }
  }, [category, subcategory, get, history])

  useEffect(() => {
    if (data && data.is_active) {
      dispatch(
        setClassification(getClassificationData(category, subcategory, data))
      )
    }
    if (data || error) history.replace('/')
  }, [data, error, history, dispatch, category, subcategory])

  // This shows a loading indicator, it is used to build the logic
  // for setting the category and subcategory from the url
  // before redirecting to the incident page
  return <LoadingIndicator />
}

export default IncidentClassification
