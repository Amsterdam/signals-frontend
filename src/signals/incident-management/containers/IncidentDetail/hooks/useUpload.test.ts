import { act, renderHook } from '@testing-library/react-hooks'
import {
  buffers as mockBuffers,
  eventChannel as mockEventChannel,
  END as mockEnd,
} from 'redux-saga'

import configuration from 'shared/services/configuration/configuration'

import useUpload from './useUpload'

const id = 3

const mockChannel = {
  fn: (emitter: (input: any) => void) => {
    emitter(mockEnd)
  },
}

jest.mock(
  'shared/services/file-upload-channel',
  () => () =>
    mockEventChannel((emitter) => {
      mockChannel.fn(emitter)
      return () => {}
    }, mockBuffers.sliding<Record<string, unknown> | null>(2))
)

describe('hooks/useUpload', () => {
  beforeEach(() => {
    mockChannel.fn = (emitter) => {
      emitter(mockEnd)
    }
  })

  describe('upload', () => {
    it('should have default values', async () => {
      const { result, unmount } = renderHook(() => useUpload())

      expect(result.current.uploadProgress).toEqual(0)
      expect(result.current.uploadSuccess).toEqual(false)
      expect(result.current.uploadError).toEqual(false)

      unmount()
    })

    it('should reflect upload progress', async () => {
      mockChannel.fn = (emitter) => {
        emitter({ progress: 0.8 })
        emitter(mockEnd)
      }

      const { result, unmount } = renderHook(() => useUpload())

      act(() => {
        result.current.upload(
          [
            {
              size: 123456,
              type: 'jpg',
              lastModified: 1,
              webkitRelativePath: '',
              name: 'flower',
              slice: (() => {}) as any,
              arrayBuffer: (() => {}) as any,
              stream: (() => {}) as any,
              text: (() => {}) as any,
            },
          ],
          1,
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments/`
        )
      })

      expect(result.current.uploadProgress).toEqual(0.8)
      expect(result.current.uploadSuccess).toEqual(false)
      expect(result.current.uploadError).toEqual(false)

      unmount()
    })

    it('should reflect upload success', async () => {
      mockChannel.fn = (emitter) => {
        emitter({ success: true })
        emitter(mockEnd)
      }

      const { result, unmount } = renderHook(() => useUpload())

      act(() => {
        result.current.upload(
          [
            {
              size: 123456,
              type: 'jpg',
              lastModified: 1,
              webkitRelativePath: '',
              name: 'flower',
              slice: (() => {}) as any,
              arrayBuffer: (() => {}) as any,
              stream: (() => {}) as any,
              text: (() => {}) as any,
            },
          ],
          1,
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments/`
        )
      })

      expect(result.current.uploadProgress).toEqual(0)
      expect(result.current.uploadSuccess).toEqual(true)
      expect(result.current.uploadError).toEqual(false)

      unmount()
    })

    it('should reflect upload error', async () => {
      mockChannel.fn = (emitter) => {
        emitter({ error: true })
        emitter(mockEnd)
      }

      const { result, unmount } = renderHook(() => useUpload())

      act(() => {
        result.current.upload(
          [
            {
              size: 123456,
              type: 'jpg',
              lastModified: 1,
              webkitRelativePath: '',
              name: 'flower',
              slice: (() => {}) as any,
              arrayBuffer: (() => {}) as any,
              stream: (() => {}) as any,
              text: (() => {}) as any,
            },
          ],
          1,
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments/`
        )
      })

      expect(result.current.uploadProgress).toEqual(0)
      expect(result.current.uploadSuccess).toEqual(false)
      expect(result.current.uploadError).toEqual(true)

      unmount()
    })
  })
})
