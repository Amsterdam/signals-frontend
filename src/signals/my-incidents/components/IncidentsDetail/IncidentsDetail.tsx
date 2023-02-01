// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'

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
  const answersGebeurtHetVaker = useMemo(() => {
    return incidentsDetail?.extra_properties?.find(
      (property) => property.id === 'extra_personen_overig_vaker_momenten'
    )?.answer
  }, [incidentsDetail?.extra_properties])

  const attachments = incidentsDetail?._links?.['sia:attachments']

  return (
    <div>
      <StyledBacklink to={`/mijn-meldingen/${token}`}>
        Mijn meldingen
      </StyledBacklink>

      <header>
        <StyledHeading>{`Meldingsnummer: ${incidentsDetail._display}`}</StyledHeading>
      </header>
      <Wrapper>
        <FormTitle>Omschrijving</FormTitle>
        <Paragraph strong>{incidentsDetail?.text}</Paragraph>
      </Wrapper>

      <Wrapper>
        {attachments && (
          <FormTitle>Foto{attachments.length > 1 && "'s"}</FormTitle>
        )}
        {attachments?.map((attachment, index) => (
          <ImageWrapper key={attachment.href + index}>
            <StyledImage src={attachment.href} />
          </ImageWrapper>
        ))}
      </Wrapper>

      <Wrapper>
        <FormTitle>Locatie</FormTitle>
        <Paragraph strong style={{ marginBottom: 0 }}>
          {incidentsDetail?.location?.address_text}
        </Paragraph>
        <StyledLink variant="inline" onClick={() => setShowMap(true)}>
          Bekijk op kaart
        </StyledLink>
      </Wrapper>

      <Wrapper>
        {answersGebeurtHetVaker && (
          <>
            <FormTitle>Gebeurt het vaker?</FormTitle>
            <Paragraph strong>{answersGebeurtHetVaker}</Paragraph>
          </>
        )}
      </Wrapper>
    </div>
  )
}
