// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing, Heading, themeColor } from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import type { Attachment } from 'types/attachment'
import type { FC } from 'react'
import { useContext } from 'react'
import IncidentDetailContext from '../../context'

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

// const StyledLink = styled(AscLink)`
//   font-size: inherit;
// `

interface AttachmentsProps {
  attachments: Array<Attachment>
}

const Attachments: FC<AttachmentsProps> = ({ attachments }) => {
  const { preview } = useContext(IncidentDetailContext)

  return (
    <Wrapper data-testid="incidentDetailAttachments">
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">
        Foto
      </Title>
      {attachments.map((attachment) => (
        <StyledBox
          key={attachment.location}
          onClick={() =>
            preview &&
            preview('attachment', { attachmentHref: attachment.location })
          }
        >
          <StyledImg
            data-testid="attachmentsValueButton"
            src={attachment.location}
          />
          <StyledReporter>Melder</StyledReporter>
          <StyledDate>
            {format(parseISO(attachment.created_at), 'dd-MM-yyyy HH:mm')}
          </StyledDate>
        </StyledBox>
      ))}
    </Wrapper>
  )
}

export default Attachments
