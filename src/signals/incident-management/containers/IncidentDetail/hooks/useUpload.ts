import type { EventChannel } from 'redux-saga'
import { runSaga, stdChannel } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'
import { useEffect, useState } from 'react'
import fileUploadChannel from 'shared/services/file-upload-channel'
import configuration from 'shared/services/configuration/configuration'

const channel = stdChannel()

export function* uploadAttachments(action) {
  yield all([
    ...action.payload.files.map((file) =>
      call(uploadFile, {
        payload: {
          file,
          id: action.payload.id,
          private: true,
        },
      })
    ),
  ])
}

interface UploadFile {
  id?: number
  file?: { name: string }
  private?: boolean
}

export function* uploadFile(action: { payload: UploadFile }): any {
  const id = action.payload?.id ?? ''
  const isPrivate = action.payload?.private ?? false
  const endpoint = isPrivate
    ? configuration.INCIDENT_PRIVATE_ENDPOINT
    : configuration.INCIDENT_PUBLIC_ENDPOINT

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const channel: EventChannel<any> = yield call(
    fileUploadChannel,
    `${endpoint}${id}/attachments/`,
    action.payload?.file,
    id
  )

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { progress = 0, error, success } = yield take(channel)

    if (error) {
      yield put({
        type: 'UPLOAD_FAILURE',
      })
      return
    }

    if (success) {
      yield put({
        type: 'UPLOAD_SUCCESS',
      })
      return
    }

    yield put({
      type: 'UPLOAD_PROGRESS',
      payload: progress,
    })
  }
}

const useUpload = () => {
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const dispatchFn = (output) => {
      // console.debug('output', output)
      // dispatch(output)
      switch (output.type) {
        case 'UPLOAD_PROGRESS':
          setProgress(output.payload)
          break
        case 'UPLOAD_SUCCESS':
          setSuccess(true)
          break
        case 'UPLOAD_FAILURE':
          setError(true)
          break
      }
    }
    const { cancel } = runSaga(
      {
        channel,
        dispatch: dispatchFn,
      },
      function* saga() {
        yield takeLatest('upload', uploadAttachments)
      }
    )
    return () => {
      cancel()
    }
  }, [])

  const upload = (files, id) => {
    channel.put({
      type: 'upload',
      payload: { files, id },
    })
  }

  return {
    upload,
    uploadProgress: progress,
    uploadSuccess: success,
    uploadError: error,
  }
}

export default useUpload
