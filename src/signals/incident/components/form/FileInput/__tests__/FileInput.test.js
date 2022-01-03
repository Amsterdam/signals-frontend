// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { screen, render, fireEvent } from '@testing-library/react'
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
      render(
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

      expect(screen.queryByTestId('fileInput')).toBeInTheDocument()
      expect(screen.queryByTestId('fileInputUploadButton')).toBeInTheDocument()
      expect(screen.queryAllByTestId('fileInputEmptyBox').length).toBe(2)
    })

    describe('events', () => {
      const minFileSize = 30 * 2 ** 10
      const maxFileSize = 8 * 2 ** 20
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
        render(
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

        fireEvent.change(screen.queryByTestId('fileInputUpload'), {
          target: { files: [file1] },
        })
        await screen.findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file4, file1],
        })
      })

      it('uploads a file with no extra validations', async () => {
        handler.mockImplementation(() => ({ value: undefined }))

        render(
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

        fireEvent.change(screen.queryByTestId('fileInputUpload'), {
          target: { files: [file1] },
        })
        await screen.findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': expect.any(Array),
          'input-field-name': [file1],
        })
      })

      it('it removes 1 file when remove button was clicked', async () => {
        const expectedBlob = 'blob'
        handler.mockImplementation(() => ({ value: [file1, file2] }))
        window.URL.createObjectURL.mockImplementation(() => expectedBlob)

        render(
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

        const deleteFotoButtonList = screen.queryAllByTestId('deleteFotoButton')
        expect(deleteFotoButtonList.length).toBe(2)
        fireEvent.click(deleteFotoButtonList[0], {
          preventDefault: jest.fn(),
          foo: 'booo',
        })

        await screen.findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name': [file2],
          'input-field-name_previews': [expectedBlob],
        })
      })

      it('returns error when trying to upload file that is too small', async () => {
        const errorText =
          'Dit bestand is te klein. De minimale bestandgrootte is 30 kB.'

        handler.mockImplementation(() => ({ value: null }))
        render(
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

        const inputError = screen.getByTestId('fileInputError')
        expect(inputError).toBeInTheDocument()
        expect(inputError).not.toHaveTextContent(errorText)

        const fileInputElement = screen.getByTestId('fileInputUpload')
        expect(fileInputElement).toBeInTheDocument()

        fireEvent.change(fileInputElement, { target: { files: [file5] } })
        await screen.findByTestId('fileInputUpload')

        expect(parent.meta.updateIncident).toHaveBeenCalledWith({
          'input-field-name_previews': [],
          'input-field-name': [],
        })

        expect(inputError).toHaveTextContent(errorText)
      })
    })
  })
})
