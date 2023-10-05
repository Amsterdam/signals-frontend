// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { buffers, eventChannel, END } from 'redux-saga'

import { RequestType } from 'hooks/useFetch'

import { getAuthHeaders } from '../auth/auth'

export default (
  endpoint,
  file,
  id,
  field = 'file',
  requestType = RequestType.POST
) =>
  eventChannel((emitter) => {
    const formData = new window.FormData()
    formData.append('signal_id', id)
    formData.append(field, file)

    const xhr = new window.XMLHttpRequest()

    /* istanbul ignore next */
    const onProgress = (e) => {
      if (e.lengthComputable) {
        const progress = e.loaded / e.total
        emitter({ progress })
      }
    }

    /* istanbul ignore next */
    const onFailure = () => {
      emitter({ error: new Error('Upload failed') })
      emitter(END)
    }

    xhr.upload.addEventListener('progress', onProgress)
    xhr.upload.addEventListener('error', onFailure)
    xhr.upload.addEventListener('abort', onFailure)

    /* istanbul ignore next */
    xhr.onload = () => {
      // upload success
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
        emitter({ success: true })
        emitter(END)
      } else {
        onFailure()
      }
    }

    xhr.open(requestType, endpoint, true)
    const authHeaders = getAuthHeaders()
    Object.entries(authHeaders).forEach(([header, value]) => {
      xhr.setRequestHeader(header, value)
    })
    xhr.send(formData)

    return () => {
      xhr.upload.removeEventListener('progress', onProgress)
      xhr.upload.removeEventListener('error', onFailure)
      xhr.upload.removeEventListener('abort', onFailure)
      xhr.onload = null
      xhr.abort()
    }
  }, buffers.sliding(2))
