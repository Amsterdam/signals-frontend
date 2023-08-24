// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import {
  TYPE_GLOBAL,
  VARIANT_ERROR,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants'
import type { FetchError } from 'hooks/useFetch'
import { RequestType } from 'hooks/useFetch'

import { isFetchError } from '../../shared/type-guards'

interface Props {
  entityName: string // Name by which the stored/patched data should be labeled (eg. 'Afdeling')
  isLoading?: boolean // Flag indicating if data is still loading
  redirectURL?: string // URL to which the push should be directed when isSuccess is truthy
  isSuccess?: boolean // Flag indicating if data has been stored/patched successfully
  error?: boolean | FetchError // Exception object
  requestType?: string // Flag indicating what type of request it is
}

const useFetchResponseNotification = ({
  entityName,
  error,
  isLoading,
  isSuccess,
  redirectURL,
  requestType,
}: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showNotification = useCallback(
    (variant, title) =>
      dispatch(
        showGlobalNotification({
          variant,
          title,
          type: TYPE_GLOBAL,
        })
      ),
    [dispatch]
  )

  useEffect(() => {
    if (isLoading || (!error && !isSuccess)) return

    let message
    let variant = VARIANT_SUCCESS

    if (error && isFetchError(error)) {
      ;({ message } = error)
      variant = VARIANT_ERROR
    }

    if (isSuccess) {
      const entityLabel = entityName || 'Gegevens'
      const actionMap: { [key: string]: string } = {
        [RequestType.DELETE]: 'verwijderd',
        [RequestType.PATCH]: 'bijgewerkt',
        [RequestType.PUT]: 'bijgewerkt',
        [RequestType.POST]: 'toegevoegd',
      }

      message = `${entityLabel} ${
        requestType ? actionMap[requestType] : 'bijgewerkt'
      }`
    }
    showNotification(variant, message)
  }, [entityName, error, isLoading, isSuccess, showNotification, requestType])

  useEffect(() => {
    if (isLoading) return

    if (isSuccess && redirectURL) {
      navigate(redirectURL)
    }
  }, [navigate, isSuccess, redirectURL, isLoading])
}

export default useFetchResponseNotification
