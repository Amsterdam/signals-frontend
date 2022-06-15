// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  themeSpacing,
  Heading,
  themeColor,
  Button as AscButton,
} from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import LoadingIndicator from 'components/LoadingIndicator'
import type { Attachment } from 'types/attachment'
import { useEffect } from 'react'
import type { FC } from 'react'
import Button from 'components/Button'
import { useCallback, useState } from 'react'
import { useContext } from 'react'
import IncidentDetailContext from '../../context'
import FileInput from '../FileInput'
import type { Files } from '../../hooks/useUpload'

const Wrapper = styled.article`
  contain: content;
  position: relative;
  z-index: 0;
`

const Title = styled(Heading)`
  margin: ${themeSpacing(4)} 0;
`

const StyledBox = styled.div`
  position: relative;
  display: inline-block;
  width: 180px;
  height: 135px;
  border: 1px solid ${themeColor('tint', 'level3')} !important;
  cursor: pointer;
`

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  margin-right: 10px;
  margin-bottom: ${themeSpacing(2)};
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
  background-color: rgba(50, 50, 50, 0.8);
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

const StyledLoadingIndicator = styled(LoadingIndicator)`
  width: 50px;
  height: 50px;
`

interface AttachmentsProps {
  attachments: Attachment[]
  className: string
  add: (file: File) => void
  remove: (attachment: Attachment) => void
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
  isRemoving,
  uploadProgress,
}) => {
  const { preview } = useContext(IncidentDetailContext)
  const [files, setFiles] = useState<Files>([])
  const hasAttachments = attachments.length > 0 || files.length > 0

  const handleChange = useCallback(
    (newFiles) => {
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
            <StyledButton
              icon={<img src="/assets/images/icon-delete.svg" alt="Bewerken" />}
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
          </StyledBox>
        )
      })}
      {files.map((file) => (
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
      ))}
      <FileInput name="addPhoto" label="Foto toevoegen" onChange={handleChange}>
        <Button
          forwardedAs="span"
          variant={hasAttachments ? 'textButton' : 'application'}
        >
          Foto toevoegen
        </Button>
      </FileInput>
    </Wrapper>
  )
}

export default Attachments
