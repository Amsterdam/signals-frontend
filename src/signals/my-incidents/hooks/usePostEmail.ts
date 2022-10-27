// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback } from 'react'

import useFetch from 'hooks/useFetch'
import type { FetchResponse } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

type PostEmail = (email: string, isValid?: boolean) => void

export const usePostEmail = (): [
  PostEmail,
  Omit<FetchResponse<null>, 'post'>
] => {
  const { post, ...rest } = useFetch<null>()
  console.log('--- ~ rest', rest)

  const endpoint = `${configuration.MY_SIGNALS_LOGIN_URL}`

  const postEmail: PostEmail = useCallback(
    (email, isValid = true) => {
      if (!isValid) {
        return
      }

      const payload = {
        email,
      }

      post(endpoint, payload)
    },
    [endpoint, post]
  )

  return [postEmail, rest]
}
