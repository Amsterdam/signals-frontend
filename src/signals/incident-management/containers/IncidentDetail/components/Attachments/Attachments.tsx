// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  themeSpacing,
  Heading,
  themeColor,
  Button as AscButton,
} from '@amsterdam/asc-ui'
import ErrorMessage from 'components/ErrorMessage'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import {
  Close as CloseIcon,
  TrashBin as DeleteIcon,
} from '@amsterdam/asc-assets'

import LoadingIndicator from 'components/LoadingIndicator'
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
import AddNote from '../AddNote'

const DELETE_CHILD = 'sia_delete_attachment_of_child_signal'
const DELETE_NORMAL = 'sia_delete_attachment_of_normal_signal'
const DELETE_OTHER = 'sia_delete_attachment_of_other_user'
const DELETE_PARENT = 'sia_delete_attachment_of_parent_signal'

const MIN = 30 * 2 ** 10 // 30 KiB
const MAX = 20 * 2 ** 20 // 20 MiB

const Wrapper = styled.section`
  contain: content;
  position: relative;
  z-index: 0;
`

const StyledButtonWrapper = styled.div`
  display: flex;
  margin-top: ${themeSpacing(2)};
  gap: 8px;
`

const Title = styled(Heading)`
  margin: ${themeSpacing(4)} 0;
`

const StyledBox = styled.div`
  position: relative;
  display: inline-block;
  margin-right: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(2)};
  width: 180px;
  height: 135px;
  border: 1px solid ${themeColor('tint', 'level3')} !important;
  cursor: pointer;
`

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StyledGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 75%
  );
`

const StyledReporter = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${themeColor('tint', 'level1')};
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  text-transform: uppercase;
`

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 10px;
  bottom: 7px;
  left: 10px;
  color: ${themeColor('tint', 'level1')};
  font-size: 14px;
  line-height: 20px;
`

const StyledDate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledError = styled(StyledDate)`
  padding: 0 4px;
  border-radius: 2px;
  background-color: ${themeColor('error')};
`

const StyledEmployee = StyledDate

const StyledName = styled(StyledDate)`
  font-weight: bold;
`

const StyledButton = styled(AscButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: ${themeSpacing(0, 1.5)};
`

interface StyledUploadProgressProps {
  progress: number
}

const StyledUploadProgress = styled.div<StyledUploadProgressProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height 5px;
  background-color: ${themeColor('tint', 'level4')};

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => progress * 100}%;
    height: 100%;
    background-color: ${themeColor('primary')};
  }
`
const StyledUploadProgressError = styled(StyledUploadProgress)`
  &::after {
    background-color: ${themeColor('error')};
  }
`

const StyledLoadingIndicator = styled(LoadingIndicator)`
  width: 50px;
  height: 50px;
`

const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(8)};
`

const StyledAddNote = styled(AddNote)`
  flex-grow: 1;
`

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
