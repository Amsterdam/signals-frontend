// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import {
  Close as CloseIcon,
  TrashBin as DeleteIcon,
} from '@amsterdam/asc-assets'

import type { Attachment } from 'types/attachment'
import { useEffect } from 'react'
import type { FC } from 'react'
import Button from 'components/Button'
import { useCallback, useState } from 'react'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { makeSelectUser, makeSelectUserCan } from 'containers/App/selectors'
import fileSize from 'signals/incident/services/file-size'
import IncidentDetailContext from '../../context'
import FileInput from '../FileInput'
import type { Files } from '../../hooks/useUpload'
import {
  StyledAddNote,
  StyledBox,
  StyledButton,
  StyledButtonWrapper,
  StyledDate,
  StyledDetails,
  StyledEmployee,
  StyledError,
  StyledErrorMessage,
  StyledGradient,
  StyledImg,
  StyledLoadingIndicator,
  StyledName,
  StyledReporter,
  StyledUploadProgress,
  StyledUploadProgressError,
  Title,
  Wrapper,
} from './styles'

const DELETE_CHILD = 'sia_delete_attachment_of_child_signal'
const DELETE_NORMAL = 'sia_delete_attachment_of_normal_signal'
const DELETE_OTHER = 'sia_delete_attachment_of_other_user'
const DELETE_PARENT = 'sia_delete_attachment_of_parent_signal'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 20 * 2 ** 20 // 20 MiB

interface AttachmentsProps {
  attachments: Attachment[]
  className: string
  add: (file: File) => void
  remove: (attachment: Attachment) => void
  isChildIncident: boolean
  isParentIncident: boolean
  isRemoving: boolean
  uploadProgress: number
  uploadSuccess: boolean
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

  return (
    <Wrapper className={className}>
      {hasAttachments && (
        <Title forwardedAs="h2" styleAs="h4">
          Foto
        </Title>
      )}
      {attachments.map((attachment) => {
        const fileName = attachment.location?.split('/').pop() || ''

        return (
          <StyledBox
            key={attachment.location}
            onClick={() =>
              preview &&
              preview('attachment', { attachmentHref: attachment.location })
            }
            title={fileName}
          >
            <StyledImg src={attachment.location} />
            <StyledGradient />
            {!attachment.created_by && <StyledReporter>Melder</StyledReporter>}
            <StyledDetails>
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
                variant="application"
                disabled={isRemoving}
              />
            )}
          </StyledBox>
        )
      })}
      {files.map((file) =>
        uploadError ? (
          <StyledBox key={file.src}>
            <StyledImg src={file.src} />
            <StyledGradient />
            <StyledDetails>
              <StyledName>{file.name}</StyledName>
              <StyledError>Uploaden mislukt</StyledError>
            </StyledDetails>
            <StyledUploadProgressError progress={1} />
            <StyledButton
              icon={<CloseIcon />}
              iconSize={18}
              onClick={(event) => {
                event.stopPropagation()
                setFiles([])
              }}
              variant="application"
            />
          </StyledBox>
        ) : (
          <StyledBox key={file.src}>
            <StyledImg src={file.src} />
            <StyledGradient />
            <StyledDetails>
              <StyledName>{file.name}</StyledName>
              <StyledDate>wordt geüpload</StyledDate>
            </StyledDetails>
            {uploadProgress === 1 ? (
              <StyledLoadingIndicator />
            ) : (
              <StyledUploadProgress progress={uploadProgress || 0} />
            )}
          </StyledBox>
        )
      )}
      <StyledErrorMessage message={error} />
      <StyledButtonWrapper>
        <FileInput
          multiple={false}
          name="addPhoto"
          label="Foto toevoegen"
          onChange={handleChange}
        >
          {files.length > 0 && !uploadError ? (
            <Button variant="application" disabled={true} type="button">
              Foto toevoegen
            </Button>
          ) : (
            <Button forwardedAs="span" variant="application" type="button">
              Foto toevoegen
            </Button>
          )}
        </FileInput>
        <StyledAddNote maxContentLength={3000} />
      </StyledButtonWrapper>
    </Wrapper>
  )
}

export default Attachments
