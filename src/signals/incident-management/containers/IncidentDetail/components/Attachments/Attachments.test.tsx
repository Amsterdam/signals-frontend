// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as appSelectors from 'containers/App/selectors'
import { withAppContext } from 'test/utils'

import Attachments from './Attachments'
import attachments from '../../../../../../../internals/mocks/fixtures/attachments.json'
import userFixture from '../../../../../../utils/__tests__/fixtures/user.json'
import {
  DELETE_CHILD,
  DELETE_NORMAL,
  DELETE_OTHER,
  DELETE_PARENT,
} from '../../constants'
import IncidentDetailContext from '../../context'

jest.mock('./UploadProgress', () => ({ progress }: { progress: number }) => (
  <span>progress-{progress}</span>
))

const patch = jest.fn()
const preview = jest.fn()
const add = jest.fn()
const remove = jest.fn()

describe('Attachments', () => {
  beforeEach(() => {
    patch.mockClear()
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the Attachments component', () => {
    const fileName = 'ae70d54aca324d0480ca01934240c78f.jpg'

    render(
      withAppContext(
        <Attachments
          patch={patch}
          attachments={attachments.results}
          add={add}
          remove={remove}
          isChildIncident={false}
          isParentIncident={false}
          isRemoving={false}
          uploadProgress={0}
          uploadError={false}
        />
      )
    )

    expect(screen.getByText(/bestanden$/i)).toBeInTheDocument()
    expect(screen.getByTitle(fileName)).toBeInTheDocument()
    expect(screen.getAllByText(/melder/i)).toHaveLength(3)
    expect(screen.getByText(fileName)).toBeInTheDocument()
    expect(screen.getByText('10-06-2020 11:51')).toBeInTheDocument()
  })

  it('works without location', () => {
    render(
      withAppContext(
        <Attachments
          patch={patch}
          attachments={attachments.results}
          add={add}
          remove={remove}
          isChildIncident={false}
          isParentIncident={false}
          isRemoving={false}
          uploadProgress={0}
          uploadError={false}
        />
      )
    )

    expect(screen.getAllByText(/melder/i)).toHaveLength(3)
  })

  it('works without attachments', () => {
    render(
      withAppContext(
        <Attachments
          patch={patch}
          attachments={[]}
          add={add}
          remove={remove}
          isChildIncident={false}
          isParentIncident={false}
          isRemoving={false}
          uploadProgress={0}
          uploadError={false}
        />
      )
    )

    expect(screen.queryByText(/melder/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/bestand toevoegen/i)).toBeInTheDocument()
  })

  it('shows the creator', () => {
    const employee = 'employee@signalen.dev'

    const newAttachments = [
      {
        ...attachments.results[0],
        created_by: employee,
      },
    ]

    render(
      withAppContext(
        <Attachments
          patch={patch}
          attachments={newAttachments}
          add={add}
          remove={remove}
          isChildIncident={false}
          isParentIncident={false}
          isRemoving={false}
          uploadProgress={0}
          uploadError={false}
        />
      )
    )

    expect(screen.getByText(employee)).toBeInTheDocument()
  })

  describe('uploading', () => {
    beforeEach(() => {
      patch.mockClear()
    })
    it('calls add and shows the file', async () => {
      const files = [
        {
          name: 'bloem.jpeg',
          size: 89691,
          type: 'image/jpeg',
        },
      ]

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      const fileInputElement = screen.getByLabelText(/bestand toevoegen/i)
      fireEvent.change(fileInputElement, {
        target: { files },
      })
      expect(add).toHaveBeenCalledWith(files)
      expect(await screen.findByText('bloem.jpeg')).toBeInTheDocument()
      expect(screen.getByText(/wordt geüpload/i)).toBeInTheDocument()
      expect(screen.getByText('progress-0')).toBeInTheDocument()
      expect(
        screen.queryByText(/dit bestand is te groot/i)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/dit bestand is te klein/i)
      ).not.toBeInTheDocument()
    })

    it('shows the upload progress', async () => {
      const files = [
        {
          name: 'bloem.jpeg',
          size: 89691,
          type: 'image/jpeg',
        },
      ]

      const { rerender } = render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      const fileInputElement = screen.getByLabelText(/bestand toevoegen/i)
      fireEvent.change(fileInputElement, {
        target: { files },
      })
      expect(await screen.findByText('bloem.jpeg')).toBeInTheDocument()
      expect(screen.getByText(/progress/)).toBeInTheDocument()
      expect(screen.getByText('progress-0')).toBeInTheDocument()
      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      expect(screen.getByText(/bestand toevoegen/i)).toBeDisabled()

      rerender(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0.4}
            uploadError={false}
          />
        )
      )

      expect(screen.getByText('progress-0.4')).toBeInTheDocument()
      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0.8}
            uploadError={false}
          />
        )
      )

      expect(screen.getByText('progress-0.8')).toBeInTheDocument()
      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={1}
            uploadError={false}
          />
        )
      )

      expect(screen.queryByText(/progress/)).not.toBeInTheDocument()
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })

    it('handles upload error', async () => {
      const files = [
        {
          name: 'bloem.jpeg',
          size: 89691,
          type: 'image/jpeg',
        },
      ]

      const { rerender } = render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      const fileInputElement = screen.getByLabelText(/bestand toevoegen/i)
      fireEvent.change(fileInputElement, {
        target: { files },
      })
      expect(await screen.findByText('bloem.jpeg')).toBeInTheDocument()
      expect(screen.getByText(/progress/)).toBeInTheDocument()
      expect(screen.getByText('progress-0')).toBeInTheDocument()
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
      expect(screen.getByText(/bestand toevoegen/i)).toBeDisabled()

      rerender(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0.4}
            uploadError={false}
          />
        )
      )

      expect(screen.getByText('progress-0.4')).toBeInTheDocument()
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0.8}
            uploadError={true}
          />
        )
      )

      expect(screen.queryByText('progress-0.8')).not.toBeInTheDocument()
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
      expect(screen.getByText(/uploaden mislukt/i)).toBeInTheDocument()

      const closeButton = screen.getByTitle(/bijlage sluiten/i)
      userEvent.click(closeButton)

      expect(screen.queryByText('bloem.jpeg')).not.toBeInTheDocument()
    })

    it('handles too large files', () => {
      const files = [
        {
          name: 'bloem.jpeg',
          size: 89691000,
          type: 'image/jpeg',
        },
      ]

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      const fileInputElement = screen.getByLabelText(/bestand toevoegen/i)
      fireEvent.change(fileInputElement, {
        target: { files },
      })
      expect(add).not.toHaveBeenCalled()
      expect(screen.getByText(/dit bestand is te groot/i)).toBeInTheDocument()
      expect(
        screen.queryByText(/dit bestand is te klein/i)
      ).not.toBeInTheDocument()
    })

    it('handles too small files', () => {
      const files = [
        {
          name: 'bloem.jpeg',
          size: 8969,
          type: 'image/jpeg',
        },
      ]

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      const fileInputElement = screen.getByLabelText(/bestand toevoegen/i)
      fireEvent.change(fileInputElement, {
        target: { files },
      })
      expect(add).not.toHaveBeenCalled()
      expect(
        screen.queryByText(/dit bestand is te groot/i)
      ).not.toBeInTheDocument()
      expect(screen.getByText(/dit bestand is te klein/i)).toBeInTheDocument()
    })
  })

  it('can toggle the note form', () => {
    render(
      withAppContext(
        <Attachments
          patch={patch}
          attachments={attachments.results}
          add={add}
          remove={remove}
          isChildIncident={false}
          isParentIncident={false}
          isRemoving={false}
          uploadProgress={0}
          uploadError={false}
        />
      )
    )

    const noteButton = screen.getByText(/notitie toevoegen/i)
    userEvent.click(noteButton)
    const closeNoteButton = screen.getByText(/annuleer/i)
    userEvent.click(closeNoteButton)
    expect(screen.queryByText(/annuleer/i)).not.toBeInTheDocument()

    userEvent.click(noteButton)
    userEvent.click(noteButton)
    expect(screen.queryByText(/annuleer/i)).not.toBeInTheDocument()
  })

  describe('deleting', () => {
    beforeEach(() => {
      patch.mockClear()
    })
    it('does not show the delete button when not allowed', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => false)

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(
        screen.queryByTitle(/bijlage verwijderen/i)
      ).not.toBeInTheDocument()
    })

    it('shows the delete button when allowed', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(screen.getAllByTitle(/bijlage verwijderen/i)).toHaveLength(4)
    })

    it('shows the delete button when allowed from others and for normal incidents', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_NORMAL
        )

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(screen.getAllByTitle(/bijlage verwijderen/i)).toHaveLength(4)
    })

    it('shows the delete button when allowed from others and for child incidents', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_CHILD
        )

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={true}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(screen.getAllByTitle(/bijlage verwijderen/i)).toHaveLength(4)
    })

    it('shows the delete button when allowed from others and for parent incidents', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_PARENT
        )

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={true}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(screen.getAllByTitle(/bijlage verwijderen/i)).toHaveLength(4)
    })

    it('shows the delete button when its your own attachment and allowed for normal incidents', () => {
      const employee = 'employee@signalen.dev'

      const newAttachments = [
        {
          ...attachments.results[0],
          created_by: employee,
        },
      ]

      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => (action) => action === DELETE_NORMAL)
      jest
        .spyOn(appSelectors, 'makeSelectUser')
        .mockImplementation(() => ({ ...userFixture, username: employee }))

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={newAttachments}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )

      expect(screen.getByTitle(/bijlage verwijderen/i)).toBeInTheDocument()
    })

    it('calls remove', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)
      jest.spyOn(window, 'confirm').mockImplementation(() => {
        return true
      })

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )
      const deleteButton = screen.getByTestId(
        'DeleteIcon2020-06-10T11:51:24.281272+02:00'
      )
      userEvent.click(deleteButton)
      expect(remove).toHaveBeenCalledWith(attachments.results[0])
    })

    it('does not call remove without confirmation', () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)
      jest.spyOn(window, 'confirm').mockImplementation(() => {
        return false
      })

      render(
        withAppContext(
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        )
      )
      const deleteButton = screen.getByTestId(
        'DeleteIcon2020-06-10T11:51:24.281272+02:00'
      )
      userEvent.click(deleteButton)
      expect(remove).not.toHaveBeenCalled()
    })
  })

  describe('patch', () => {
    const publicAttachmentResults = [
      {
        ...attachments.results[0],
        created_by: 'user@example.com',
      },
    ]

    beforeEach(() => {
      patch.mockClear()
    })

    it('should open EditAttachment form and the form should be interactive', async () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)

      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={publicAttachmentResults}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).toBeInTheDocument()

      userEvent.click(screen.getByTitle('Openbaar maken'))

      expect(screen.queryByTitle('Openbaar maken')).toBeDisabled()

      expect(
        screen.queryByRole('checkbox', { name: 'Openbaar tonen' })
      ).toBeInTheDocument()

      expect(screen.queryByText(/Onderschrift/)).not.toBeInTheDocument()

      userEvent.click(screen.getByRole('checkbox', { name: 'Openbaar tonen' }))

      expect(screen.getByText(/Onderschrift/)).toBeInTheDocument()
    })
    it('should not open EditAttachment form', async () => {
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => false)

      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={publicAttachmentResults}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).not.toBeInTheDocument()
    })

    it('should show public and non public attachments with and without edit button', async () => {
      const attachmentResultsMultiple = [
        {
          ...attachments.results[0],
          created_by: 'user@example.com',
          public: true,
        },
        {
          ...attachments.results[0],
          location: 'https://ae70d54aca324d0480ca01934240c78ff.jpg',
        },
      ]

      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={attachmentResultsMultiple}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).toBeInTheDocument()

      expect(screen.getByText('Melder')).toBeInTheDocument()

      expect(screen.getByText('Openbaar')).toBeInTheDocument()

      expect(screen.getAllByText(/^[a-zA-Z0-9]+.jpg/).length).toBe(2)

      userEvent.click(screen.getByTitle('Openbaar maken'))

      expect(screen.getByText(/Onderschrift/)).toBeInTheDocument()
      expect(
        screen.getByRole('checkbox', { name: 'Openbaar tonen' })
      ).toBeInTheDocument()
    })

    it('should not be able to make pdf public available', async () => {
      const attachmentResultsMultiple = [
        {
          ...attachments.results[0],
          created_by: 'user@example.com',
          public: true,
        },
        {
          ...attachments.results[0],
          is_image: false,
          created_by: 'user@example.com',
          location: 'https://ae70d54aca324d0480ca01934240c78ff.jpg',
        },
      ]

      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={attachmentResultsMultiple}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.getAllByTitle('Openbaar maken')).toHaveLength(1)
    })

    it('should open EditAttachment form and it should send a PATCH request', async () => {
      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={publicAttachmentResults}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).toBeInTheDocument()

      userEvent.click(screen.getByTitle('Openbaar maken'))

      userEvent.click(screen.getByRole('checkbox', { name: 'Openbaar tonen' }))

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() =>
        expect(patch).toHaveBeenCalledWith(
          'http://localhost:8000/signals/v1/private/signals/63/attachments/88',
          { public: true }
        )
      )

      patch.mockClear()

      userEvent.click(screen.getByTitle('Openbaar maken'))

      userEvent.type(screen.getByRole('textbox'), 'test')

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() =>
        expect(patch).toHaveBeenCalledWith(
          'http://localhost:8000/signals/v1/private/signals/63/attachments/88',
          { public: true, caption: 'test' }
        )
      )
    })

    it('should open EditAttachment form and it should send a PATCH request with caption null', async () => {
      const publicAttachmentResultsWithCaption = [
        {
          ...attachments.results[0],
          caption: 'test',
          created_by: 'test@user.nl',
        },
      ]

      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={publicAttachmentResultsWithCaption}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).toBeInTheDocument()

      userEvent.click(screen.getByTitle('Openbaar maken'))

      userEvent.click(screen.getByRole('checkbox', { name: 'Openbaar tonen' }))

      userEvent.clear(screen.getByRole('textbox'))

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() =>
        expect(patch).toHaveBeenCalledWith(
          'http://localhost:8000/signals/v1/private/signals/63/attachments/88',
          { public: true, caption: null }
        )
      )
    })

    it('should open EditAttachment form, fill it and press cancel button', async () => {
      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: () => {},
              preview,
            }}
          >
            <Attachments
              patch={patch}
              attachments={publicAttachmentResults}
              add={add}
              remove={remove}
              isChildIncident={false}
              isParentIncident={false}
              isRemoving={false}
              uploadProgress={0}
              uploadError={false}
            />
          </IncidentDetailContext.Provider>
        )
      )

      expect(screen.queryByTitle('Openbaar maken')).toBeInTheDocument()

      userEvent.click(screen.getByTitle('Openbaar maken'))

      userEvent.click(screen.getByRole('checkbox', { name: 'Openbaar tonen' }))

      userEvent.type(screen.getByRole('textbox'), 'test')

      userEvent.click(screen.getByRole('button', { name: 'Annuleer' }))

      await waitFor(() => expect(patch).not.toHaveBeenCalled())
    })
  })

  it('shows the preview', () => {
    const fileName = 'ae70d54aca324d0480ca01934240c78f.jpg'

    render(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{
            update: () => {},
            preview,
          }}
        >
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        </IncidentDetailContext.Provider>
      )
    )

    const box = screen.getByTitle(fileName)
    userEvent.click(box)

    expect(preview).toHaveBeenCalled()
  })

  it('shows a pdf in a new tab', () => {
    const fileName = 'ae70d54aca324d0480ca01934240c78f.pdf'

    const mockOpen = jest.fn()
    global.window.open = mockOpen

    const pdfAttachments = [...attachments.results]
    pdfAttachments[0].location = 'https://ae70d54aca324d0480ca01934240c78f.pdf'

    render(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{
            update: () => {},
            preview,
          }}
        >
          <Attachments
            patch={patch}
            attachments={attachments.results}
            add={add}
            remove={remove}
            isChildIncident={false}
            isParentIncident={false}
            isRemoving={false}
            uploadProgress={0}
            uploadError={false}
          />
        </IncidentDetailContext.Provider>
      )
    )

    const box = screen.getByTitle(fileName)
    userEvent.click(box)

    expect(preview).not.toHaveBeenCalled()

    expect(mockOpen).toBeCalled()
  })
})
