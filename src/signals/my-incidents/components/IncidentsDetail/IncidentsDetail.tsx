// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useState } from 'react'

import AttachmentViewer from 'components/AttachmentViewer'

import { ExtraProperties } from './ExtraProperties'
import {
  FormTitle,
  StyledImage,
  ImageWrapper,
  StyledBacklink,
  StyledLink,
  DescriptionWrapper,
  ContentWrapper,
  StyledDD,
  StyledFigCaption,
  ImagesWrapper,
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

  const attachmentsUser = attachments?.filter(
    (attachment) => !attachment.created_by
  )

  const attachmentsMunicipality = attachments?.filter(
    (attachment) => attachment.created_by
  )

  return (
    <ContentWrapper>
      <StyledBacklink to={`/mijn-meldingen/${token}`}>
        Mijn meldingen
      </StyledBacklink>

      <header>
        <StyledHeading>{`Meldingsnummer: ${_display}`}</StyledHeading>
      </header>
      <dl>
        <DescriptionWrapper>
          <FormTitle>Omschrijving</FormTitle>
          <StyledDD>{text}</StyledDD>
        </DescriptionWrapper>

        {attachmentsUser?.length > 0 && (
          <DescriptionWrapper>
            <FormTitle>
              Foto{attachmentsUser.length > 1 && "'s"} gestuurd door u
            </FormTitle>

            <ImagesWrapper>
              {attachmentsUser.map((attachment, index) => (
                <ImageWrapper
                  key={attachment.href + index}
                  onClick={() => {
                    setSelectedAttachment(attachment.href)
                  }}
                >
                  <StyledImage src={attachment.href} />
                </ImageWrapper>
              ))}
            </ImagesWrapper>
          </DescriptionWrapper>
        )}

        {attachmentsMunicipality?.length > 0 && (
          <DescriptionWrapper>
            <FormTitle>
              Foto{attachmentsMunicipality.length > 1 && "'s"} gestuurd door de
              gemeente
            </FormTitle>

            <ImagesWrapper>
              {attachmentsMunicipality.map((attachment, index) => (
                <ImageWrapper key={attachment.href + index}>
                  <StyledImage src={attachment.href} />
                  {attachment.caption && (
                    <StyledFigCaption>{attachment.caption}</StyledFigCaption>
                  )}
                </ImageWrapper>
              ))}
            </ImagesWrapper>
          </DescriptionWrapper>
        )}

        <DescriptionWrapper>
          <FormTitle>Locatie</FormTitle>
          <StyledDD style={{ marginBottom: 0 }}>
            {location.address_text}
          </StyledDD>
          <StyledLink variant="inline" onClick={() => setShowMap(true)}>
            Bekijk op kaart
          </StyledLink>
        </DescriptionWrapper>

        <DescriptionWrapper>
          <ExtraProperties items={extra_properties} />
        </DescriptionWrapper>
      </dl>

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
