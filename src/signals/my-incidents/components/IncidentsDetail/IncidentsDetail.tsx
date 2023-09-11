// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useState } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'

import AttachmentViewer from 'components/AttachmentViewer'

import { ExtraProperties } from './ExtraProperties'
import {
  FormTitle,
  StyledImage,
  ImageWrapper,
  StyledBacklink,
  StyledLink,
  Wrapper,
  ContentWrapper,
} from './styled'
import { StyledHeading } from '../../pages/styled'
import type { MyIncidentDetail } from '../../types'

type Props = {
  token: string
  setShowMap: (show: boolean) => void
  incidentsDetail: MyIncidentDetail
}

export const IncidentsDetail = ({
  token,
  setShowMap,
  incidentsDetail,
}: Props) => {
  const { _display, text, location, extra_properties, _links } = incidentsDetail
  const attachments = _links?.['sia:attachments']
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null
  )

  const formattedAttachments =
    attachments?.map((attachment) => ({
      createdAt: attachment.created_at,
      createdBy: attachment.created_by,
      location: attachment.href,
      stateShown: 'foto gemeente',
      caption: attachment.caption,
    })) || []

  return (
    <ContentWrapper>
      <StyledBacklink to={`/mijn-meldingen/${token}`}>
        Mijn meldingen
      </StyledBacklink>

      <header>
        <StyledHeading>{`Meldingsnummer: ${_display}`}</StyledHeading>
      </header>
      <Wrapper>
        <FormTitle>Omschrijving</FormTitle>
        <Paragraph strong>{text}</Paragraph>
      </Wrapper>

      {attachments && (
        <Wrapper>
          <FormTitle>Foto{attachments.length > 1 && "'s"}</FormTitle>

          {attachments.map((attachment, index) => (
            <ImageWrapper
              key={attachment.href + index}
              onClick={() => {
                setSelectedAttachment(attachment.href)
              }}
            >
              <StyledImage src={attachment.href} />
            </ImageWrapper>
          ))}
        </Wrapper>
      )}

      <Wrapper>
        <FormTitle>Locatie</FormTitle>
        <Paragraph strong style={{ marginBottom: 0 }}>
          {location.address_text}
        </Paragraph>
        <StyledLink variant="inline" onClick={() => setShowMap(true)}>
          Bekijk op kaart
        </StyledLink>
      </Wrapper>

      <Wrapper>
        <ExtraProperties items={extra_properties} />
      </Wrapper>

      {selectedAttachment && (
        <AttachmentViewer
          attachments={formattedAttachments}
          href={selectedAttachment}
          onClose={() => {
            setSelectedAttachment(null)
          }}
        />
      )}
    </ContentWrapper>
  )
}
