// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { Paragraph } from '@amsterdam/asc-ui'

import { ExtraProperties } from './ExtraProperties'
import {
  FormTitle,
  StyledImage,
  ImageWrapper,
  StyledBacklink,
  StyledLink,
  Wrapper,
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

  return (
    <div>
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
            <ImageWrapper key={attachment.href + index}>
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
    </div>
  )
}
