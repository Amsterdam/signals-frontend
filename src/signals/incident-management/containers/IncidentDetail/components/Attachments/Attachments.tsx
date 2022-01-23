// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing, Heading, themeColor } from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import type { Attachment } from 'types/attachment'
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
  padding: 6px 8px;
  background-color: rgba(150, 150, 150, 0.8);
  color: ${themeColor('tint', 'level1')};
  font-size: 14px;
  line-height: 14px;
`

interface AttachmentsProps {
  attachments: Array<Attachment>
  className: string
}

const Attachments: FC<AttachmentsProps> = ({ attachments, className }) => {
  const { preview } = useContext(IncidentDetailContext)
  const [files, setFiles] = useState([])
  const hasAttachments = attachments.length > 0 || files.length > 0

  const handleChange = useCallback(
    (newFiles) => {
      setFiles(newFiles)
    },
    [setFiles]
  )

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
          <StyledReporter>Melder</StyledReporter>
          <StyledDate>
            {format(parseISO(attachment.created_at), 'dd-MM-yyyy HH:mm')}
          </StyledDate>
        </StyledBox>
      ))}
      {files.map((file) => (
        <StyledBox key={window.URL.createObjectURL(file)}>
          <StyledImg src={window.URL.createObjectURL(file)} />
          <StyledReporter>wordt geüpload</StyledReporter>
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
