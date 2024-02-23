// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import configuration from 'shared/services/configuration/configuration'

export const useCheckApiHealth = async () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname.includes('/onderhoud')) return null

  try {
    const response = await fetch(`${configuration.apiBaseUrl}/signals/`, {
      method: 'HEAD',
    })

    if (response.status === 503) {
      navigate('/onderhoud')
    }
  } catch (error) {
    dispatch(
      showGlobalNotification({
        title: 'Er kon geen health check worden uitgevoerd op de API.',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )
  }
}
