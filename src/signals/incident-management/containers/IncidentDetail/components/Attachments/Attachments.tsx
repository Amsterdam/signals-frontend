// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing, Heading, themeColor } from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import LoadingIndicator from 'components/LoadingIndicator'
import { useSelector } from 'react-redux'
import { makeSelectUploadProgress } from 'containers/App/selectors'
import type { Attachment } from 'types/attachment'
import { useEffect } from 'react'
import type { FC } from 'react'
import Button from 'components/Button'
import { useCallback, useState } from 'react'
import { useContext } from 'react'
import IncidentDetailContext from '../../context'
import FileInput from '../FileInput'

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

const StyledDate = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: ${themeColor('tint', 'level1')};
  font-size: 14px;
  line-height: 14px;
`

const StyledEmployee = styled(StyledDate)`
  bottom: 30px;
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
  attachments: Array<Attachment>
  className: string
  add: (file: File) => void
}

type Files = Array<{
  name: string
  src: string
}>

const Attachments: FC<AttachmentsProps> = ({ attachments, className, add }) => {
  const { preview } = useContext(IncidentDetailContext)
  const uploadProgress = useSelector(makeSelectUploadProgress)
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
      {attachments.map((attachment) => (
        <StyledBox
          key={attachment.location}
          onClick={() =>
            preview &&
            preview('attachment', { attachmentHref: attachment.location })
          }
        >
          <StyledImg src={attachment.location} />
          <StyledGradient />
          <StyledReporter>Melder</StyledReporter>
          <StyledEmployee>Employee</StyledEmployee>
          <StyledDate>
            {format(parseISO(attachment.created_at), 'dd-MM-yyyy HH:mm')}
          </StyledDate>
          <StyledUploadProgress progress={0.5} />
        </StyledBox>
      ))}
      {files.map((file) => (
        <StyledBox key={file.src}>
          <StyledImg src={file.src} />
          <StyledGradient />
          <StyledEmployee>{file.name}</StyledEmployee>
          <StyledDate>wordt geüpload</StyledDate>
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
