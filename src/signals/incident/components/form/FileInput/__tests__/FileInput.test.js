// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import FileInput from '..'

describe('Form component <FileInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    isVisible: true,
  }

  const props = {
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
      value: jest.fn(),
    },
  }

  describe('rendering', () => {
    it('should render upload field correctly', () => {
      const { getByTestId, getAllByTestId } = render(
        withAppContext(
          <FileInput
            {...props}
            meta={{
              ...metaFields,
              maxNumberOfFiles: 3,
            }}
          />
        )
      )

      expect(getByTestId('fileInput')).toBeInTheDocument()
      expect(getByTestId('fileInputUploadButton')).toBeInTheDocument()
      expect(getAllByTestId('fileInputEmptyBox').length).toBe(2)
    })

    describe('events', () => {
      const minFileSize = 30 * 2 ** 10
      const maxFileSize = 20 * 2 ** 20
      let handler
      let parent

      const file1 = {
        name: 'bloem.jpeg',
        size: 89691,
        type: 'image/jpeg',
      }
      const file2 = {
        name: 'already uploaded.gif',
        size: 34567,
        type: 'image/gif',
        existing: true,
      }
      const file3 = {
        name: 'way too large file.jpeg',
        size: maxFileSize,
        type: 'image/jpeg',
      }
      const file4 = {
        name: 'poeeee.jpeg',
        size: 34567,
        type: 'image/jpeg',
      }
      const file5 = {
        name: 'way too small file.jpeg',
        size: minFileSize - 1,
        type: 'image/jpeg',
      }

      beforeEach(() => {
        handler = jest.fn()
        parent = {
          meta: {
            updateIncident: jest.fn(),
          },
          value: jest.fn(),
        }

        window.URL = {
          createObjectURL: jest.fn(),
          revokeObjectURL: jest.fn(),
        }
      })

      afterEach(() => {
        delete window.URL
        jest.resetAllMocks()
      })

      it('uploads already uploaded file and triggers multiple errors', async () => {
        handler.mockImplementation(() => ({ value: [file2, file3, file4] }))
        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 4,
                maxFileSize,
                allowedFileTypes: ['image/jpeg'],
              }}
            />
          )
        )

        const fileInputElement = queryByTestId('fileInputUpload')
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file1] } })
        })

        await findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file4, file1],
        })
      })

      it('uploads a file with no extra validations', async () => {
        handler.mockImplementation(() => ({ value: undefined }))

        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 3,
                maxFileSize,
                allowedFileTypes: ['image/jpeg'],
              }}
            />
          )
        )

        const fileInputElement = queryByTestId('fileInputUpload')
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file1] } })
        })

        await findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file1],
        })
      })

      it('it removes 1 file when remove button was clicked', async () => {
        const expectedBlob = 'blob'
        handler.mockImplementation(() => ({ value: [file1, file2] }))
        window.URL.createObjectURL.mockImplementation(() => expectedBlob)

        const { queryAllByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={{
                ...parent,
                value: {
                  'input-field-name_previews': [
                    'blob:http://host/1',
                    'blob:http://host/2',
                  ],
                },
              }}
              handler={handler}
              meta={{
                ...metaFields,
              }}
            />
          )
        )

        const deleteFotoButtonList = queryAllByTestId('deleteFotoButton')
        expect(deleteFotoButtonList.length).toBe(2)
        act(() => {
          fireEvent.click(deleteFotoButtonList[0], {
            preventDefault: jest.fn(),
            foo: 'booo',
          })
        })

        await findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name': [file2],
          'input-field-name_previews': [expectedBlob],
        })
      })

      it('returns error when trying to upload file that is too small', async () => {
        handler.mockImplementation(() => ({ value: null }))
        const { queryByTestId, findByTestId } = render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                minFileSize,
                maxNumberOfFiles: 2,
              }}
            />
          )
        )

        expect(queryByTestId('fileInputUpload')).toBeInTheDocument()
        expect(queryByTestId('fileInputError')).not.toBeInTheDocument()

        const fileInputElement = queryByTestId('fileInputUpload')
        act(() => {
          fireEvent.change(fileInputElement, { target: { files: [file5] } })
        })

        await findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': [],
          'input-field-name': [],
        })
        expect(queryByTestId('fileInputError')).toBeInTheDocument()
      })

      it('should not upload more files than maxNumberOfFiles', async () => {
        handler.mockImplementation(() => ({ value: [file1, file2] }))

        render(
          withAppContext(
            <FileInput
              parent={parent}
              handler={handler}
              meta={{
                ...metaFields,
                maxNumberOfFiles: 0,
              }}
            />
          )
        )

        const fileInputElement = screen.getByTestId('fileInputUpload')

        act(() => {
          fireEvent.change(fileInputElement, {
            target: { files: [file1, file2] },
          })
        })

        screen.getByTestId('fileInputUpload')

        expect(screen.getByTestId('fileInputError')).toBeInTheDocument()
      })
    })
  })
})
