// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam

import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useContext } from 'react'

import {
  Close as CloseIcon,
  TrashBin as DeleteIcon,
} from '@amsterdam/asc-assets'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { useSelector } from 'react-redux'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { makeSelectUser, makeSelectUserCan } from 'containers/App/selectors'
import fileSize from 'signals/incident/services/file-size'

import {
  StyledAddNote,
  StyledBox,
  StyledBoxContent,
  StyledButton,
  StyledButtonWrapper,
  StyledDate,
  StyledDetails,
  StyledPdfImg,
  StyledEmployee,
  StyledError,
  StyledGradient,
  StyledImg,
  StyledLoadingIndicator,
  StyledName,
  StyledReporter,
  StyledUploadProgressError,
  Title,
  Wrapper,
} from './styled'
import StyledUploadProgress from './UploadProgress'
import { getAttachmentFileName } from './utils'
import IncidentDetailContext from '../../context'
import type { Files } from '../../hooks/useUpload'
import type { Attachment } from '../../types'
import { isPdf } from '../../utils/isPdf'
import FileInput from '../FileInput'

export const DELETE_CHILD = 'sia_delete_attachment_of_child_signal'
export const DELETE_NORMAL = 'sia_delete_attachment_of_normal_signal'
export const DELETE_OTHER = 'sia_delete_attachment_of_other_user'
export const DELETE_PARENT = 'sia_delete_attachment_of_parent_signal'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 20 * 2 ** 20 // 20 MiB

interface AttachmentsProps {
  attachments: Attachment[]
  className?: string
  add: (file: File) => void
  remove: (attachment: Attachment) => void
  isChildIncident: boolean
  isParentIncident: boolean
  isRemoving: boolean
  uploadProgress: number
  uploadError: boolean
}

const Attachments: FC<AttachmentsProps> = ({
  attachments,
  className,
  add,
  remove,
  isChildIncident,
  isParentIncident,
  isRemoving,
  uploadProgress,
  uploadError,
}) => {
  const { preview } = useContext(IncidentDetailContext)
  const [files, setFiles] = useState<Files>([])
  const [error, setError] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const hasAttachments = attachments.length > 0 || files.length > 0
  const userCan = useSelector(makeSelectUserCan)
  const user = useSelector(makeSelectUser)

  const handleChange = useCallback(
    (newFiles) => {
      if (newFiles.find((file: File) => file.size < MIN)) {
        setError(
          `Dit bestand is te klein. De minimale bestandsgrootte is ${fileSize(
            MIN
          )}.`
        )
        return
      }
      if (newFiles.find((file: File) => file.size > MAX)) {
        setError(
          `Dit bestand is te groot. De maximale bestandsgrootte is ${fileSize(
            MAX
          )}.`
        )
        return
      }
      setError('')
      setFiles(
        newFiles.map((file: File) => ({
          name: file.name,
          src: window.URL.createObjectURL(file),
        }))
      )
      add(newFiles)
    },
    [add, setFiles]
  )

  useEffect(() => {
    setFiles([])
  }, [attachments])

  const canDeleteAttachment = useCallback(
    (attachment) => {
      const canUser =
        userCan(DELETE_OTHER) ||
        (attachment.created_by && attachment.created_by === user?.username)
      const canChild = isChildIncident && userCan(DELETE_CHILD)
      const canParent = isParentIncident && userCan(DELETE_PARENT)
      const canNormal =
        !isChildIncident && !isParentIncident && userCan(DELETE_NORMAL)

      return canUser && (canChild || canParent || canNormal)
    },
    [isChildIncident, isParentIncident, user, userCan]
  )

  const onClickPreview = (attachment: Attachment) => {
    if (isPdf(attachment.location)) {
      window.open(attachment.location, '_blank')
      return
    }

    return (
      preview && preview('attachment', { attachmentHref: attachment.location })
    )
  }

  return (
    <Wrapper className={className} data-testid="attachments-definition">
      {hasAttachments && (
        <Title forwardedAs="h2" styleAs="h4">
          Bestanden
        </Title>
      )}
      {attachments.map((attachment) => {
        const fileName = getAttachmentFileName(attachment.location)

        return (
          <StyledBox
            key={attachment.location}
            onClick={() => {
              onClickPreview(attachment)
            }}
            title={fileName}
          >
            {isPdf(attachment.location) ? (
              <StyledPdfImg
                alt="Pdf icon"
                src={'/assets/images/icon-pdf.svg'}
              />
            ) : (
              <>
                <StyledImg src={attachment.location} />
                <StyledGradient />
              </>
            )}
            <StyledBoxContent>
              {!attachment.created_by && (
                <StyledReporter>Melder</StyledReporter>
              )}
              <StyledDetails isPdf={isPdf(attachment.location)}>
                {fileName && <StyledName>{fileName}</StyledName>}
                {attachment.created_by && (
                  <StyledEmployee>{attachment.created_by}</StyledEmployee>
                )}
                <StyledDate>
                  {format(parseISO(attachment.created_at), 'dd-MM-yyyy HH:mm')}
                </StyledDate>
              </StyledDetails>
              {canDeleteAttachment(attachment) && (
                <StyledButton
                  icon={<DeleteIcon />}
                  iconSize={18}
                  onClick={(event) => {
                    event.stopPropagation()
                    window.confirm(
                      `Weet je zeker dat je de bijlage '${fileName}' wilt verwijderen?`
                    ) && remove(attachment)
                  }}
                  title="Bijlage verwijderen"
                  variant="application"
                  disabled={isRemoving}
                />
              )}
            </StyledBoxContent>
          </StyledBox>
        )
      })}
      {files.map((file) =>
        uploadError ? (
          <StyledBox key={file.src}>
            <StyledImg src={file.src} />
            <StyledGradient />
            <StyledUploadProgressError progress={1} />
            <StyledBoxContent>
              <StyledDetails>
                <StyledName>{file.name}</StyledName>
                <StyledError>Uploaden mislukt</StyledError>
              </StyledDetails>
              <StyledButton
                icon={<CloseIcon />}
                iconSize={18}
                onClick={(event) => {
                  event.stopPropagation()
                  setFiles([])
                }}
                variant="application"
                title="Bijlage sluiten"
              />
            </StyledBoxContent>
          </StyledBox>
        ) : (
          <StyledBox key={file.src}>
            <StyledImg src={file.src} />
            <StyledGradient />
            {uploadProgress === 1 ? (
              <StyledLoadingIndicator />
            ) : (
              <StyledUploadProgress progress={uploadProgress || 0} />
            )}
            <StyledBoxContent>
              <StyledDetails>
                <StyledName>{file.name}</StyledName>
                <StyledDate>wordt geüpload</StyledDate>
              </StyledDetails>
            </StyledBoxContent>
          </StyledBox>
        )
      )}
      {error && <ErrorMessage message={error} />}
      <StyledButtonWrapper>
        <FileInput multiple={false} name="addPhoto" onChange={handleChange}>
          {files.length > 0 && !uploadError ? (
            <Button variant="application" disabled={true} type="button">
              Bestand toevoegen
            </Button>
          ) : (
            <Button forwardedAs="span" variant="application" type="button">
              Bestand toevoegen
            </Button>
          )}
        </FileInput>
        <Button
          type="button"
          variant="application"
          onClick={() => setShowNoteForm(!showNoteForm)}
        >
          Notitie toevoegen
        </Button>
      </StyledButtonWrapper>
      {showNoteForm && (
        <StyledAddNote
          maxContentLength={3000}
          onClose={() => setShowNoteForm(false)}
        />
      )}
    </Wrapper>
  )
}

export default Attachments
