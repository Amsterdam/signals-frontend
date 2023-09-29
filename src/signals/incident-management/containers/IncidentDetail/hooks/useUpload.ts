import { useEffect, useState } from 'react'

import type { EventChannel } from 'redux-saga'
import { runSaga, stdChannel } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'

import type { RequestType } from 'hooks/useFetch'
import fileUploadChannel from 'shared/services/file-upload-channel'

export type Files = Array<{
  name: string
  src: string
}>

interface UploadAttachmentsAction {
  type: 'upload'
  payload: {
    files: Files
    id: number
    endpoint: string
    field?: string
    requestType?: RequestType
  }
}

function* uploadAttachments(action: UploadAttachmentsAction) {
  yield all([
    ...action.payload.files.map((file) =>
      call(uploadFile, {
        payload: {
          file,
          id: action.payload.id,
          endpoint: action.payload.endpoint,
          field: action.payload?.field,
          requestType: action.payload?.requestType,
        },
      })
    ),
  ])
}

interface UploadFileAction {
  payload: {
    id?: number
    file?: { name: string }
    endpoint: string
    field?: string
    requestType?: RequestType
  }
}

function* uploadFile(action: UploadFileAction): any {
  const { id, file, endpoint, field, requestType } = action.payload

  const channel: EventChannel<any> = yield call(
    fileUploadChannel,
    endpoint,
    file,
    id,
    field,
    requestType
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

type DispatchType = 'UPLOAD_PROGRESS' | 'UPLOAD_SUCCESS' | 'UPLOAD_FAILURE'

interface DispatchAction {
  type: DispatchType
  payload: number
}

const channel = stdChannel()

const useUpload = () => {
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    const dispatchFn = (action: DispatchAction) => {
      switch (action.type) {
        case 'UPLOAD_PROGRESS':
          setProgress(action.payload)
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

  const upload = (
    files: File[],
    id: number,
    endpoint: string,
    field?: string,
    requestType?: string
  ) => {
    setSuccess(false)
    channel.put({
      type: 'upload',
      payload: { files, id, endpoint, field, requestType },
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
