// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { screen, render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as appSelectors from 'containers/App/selectors'
import { withAppContext } from 'test/utils'

import Attachments, {
  DELETE_CHILD,
  DELETE_NORMAL,
  DELETE_OTHER,
  DELETE_PARENT,
} from './Attachments'
import attachments from '../../../../../../../internals/mocks/fixtures/attachments.json'
import userFixture from '../../../../../../utils/__tests__/fixtures/user.json'
import IncidentDetailContext from '../../context'

jest.mock('./UploadProgress', () => ({ progress }: { progress: number }) => (
  <span>progress-{progress}</span>
))

describe('Attachments', () => {
  it('renders the Attachments component', () => {
    const add = jest.fn()
    const remove = jest.fn()
    const fileName = 'ae70d54aca324d0480ca01934240c78f.jpg'

    render(
      withAppContext(
        <Attachments
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
    expect(screen.getByText(/melder/i)).toBeInTheDocument()
    expect(screen.getByText(fileName)).toBeInTheDocument()
    expect(screen.getByText('10-06-2020 11:51')).toBeInTheDocument()
  })

  it('works without location', () => {
    const add = jest.fn()
    const remove = jest.fn()

    const newAttachments = [
      {
        ...attachments.results[0],
        location: '',
      },
    ]

    render(
      withAppContext(
        <Attachments
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

    expect(screen.getByText(/melder/i)).toBeInTheDocument()
  })

  it('works without attachments', () => {
    const add = jest.fn()
    const remove = jest.fn()

    render(
      withAppContext(
        <Attachments
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
    const add = jest.fn()
    const remove = jest.fn()
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
    it('calls add and shows the file', async () => {
      const add = jest.fn()
      const remove = jest.fn()
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
      const add = jest.fn()
      const remove = jest.fn()
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
      const add = jest.fn()
      const remove = jest.fn()
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
      const add = jest.fn()
      const remove = jest.fn()
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
      const add = jest.fn()
      const remove = jest.fn()
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
    const add = jest.fn()
    const remove = jest.fn()

    render(
      withAppContext(
        <Attachments
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
    it('does not show the delete button when not allowed', () => {
      const add = jest.fn()
      const remove = jest.fn()
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => false)

      render(
        withAppContext(
          <Attachments
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
      const add = jest.fn()
      const remove = jest.fn()
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)

      render(
        withAppContext(
          <Attachments
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

      expect(screen.getByTitle(/bijlage verwijderen/i)).toBeInTheDocument()
    })

    it('shows the delete button when allowed from others and for normal incidents', () => {
      const add = jest.fn()
      const remove = jest.fn()
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_NORMAL
        )

      render(
        withAppContext(
          <Attachments
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

      expect(screen.getByTitle(/bijlage verwijderen/i)).toBeInTheDocument()
    })

    it('shows the delete button when allowed from others and for child incidents', () => {
      const add = jest.fn()
      const remove = jest.fn()
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_CHILD
        )

      render(
        withAppContext(
          <Attachments
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

      expect(screen.getByTitle(/bijlage verwijderen/i)).toBeInTheDocument()
    })

    it('shows the delete button when allowed from others and for parent incidents', () => {
      const add = jest.fn()
      const remove = jest.fn()
      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(
          () => (action) => action === DELETE_OTHER || action === DELETE_PARENT
        )

      render(
        withAppContext(
          <Attachments
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

      expect(screen.getByTitle(/bijlage verwijderen/i)).toBeInTheDocument()
    })

    it('shows the delete button when its your own attachment and allowed for normal incidents', () => {
      const add = jest.fn()
      const remove = jest.fn()
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
      const add = jest.fn()
      const remove = jest.fn()

      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)
      jest.spyOn(window, 'confirm').mockImplementation(() => {
        return true
      })

      render(
        withAppContext(
          <Attachments
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
      const removeButton = screen.getByTitle(/bijlage verwijderen/i)
      userEvent.click(removeButton)
      expect(remove).toHaveBeenCalledWith(attachments.results[0])
    })

    it('does not call remove without confirmation', () => {
      const add = jest.fn()
      const remove = jest.fn()

      jest
        .spyOn(appSelectors, 'makeSelectUserCan')
        .mockImplementation(() => () => true)
      jest.spyOn(window, 'confirm').mockImplementation(() => {
        return false
      })

      render(
        withAppContext(
          <Attachments
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
      const removeButton = screen.getByTitle(/bijlage verwijderen/i)
      userEvent.click(removeButton)
      expect(remove).not.toHaveBeenCalled()
    })
  })

  it('shows the preview', () => {
    const preview = jest.fn()
    const add = jest.fn()
    const remove = jest.fn()
    const fileName = 'ae70d54aca324d0480ca01934240c78f.jpg'

    render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ update: () => {}, preview }}>
          <Attachments
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
})
