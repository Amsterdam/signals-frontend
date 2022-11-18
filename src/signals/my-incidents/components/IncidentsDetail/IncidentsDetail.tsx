// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { Paragraph, themeSpacing } from '@amsterdam/asc-ui'

import { StyledHeading } from '../../pages/styled'
import type { MyIncident } from '../../types'
import { FormTitle, StyledImg, StyledBacklink, StyledLink } from './styled'

type Props = {
  token: string
  setShowMap: (show: boolean) => void
  incidentsDetail?: MyIncident
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

  if (!incidentsDetail) {
    return null
  }

  return (
    <>
      <StyledBacklink
        style={{ margin: `${themeSpacing(6)}` }}
        to={`/mijn-meldingen/${token}`}
      >
        Mijn meldingen
      </StyledBacklink>

      <header>
        <StyledHeading>{`Meldingsnummer: ${incidentsDetail._display}`}</StyledHeading>
      </header>
      <FormTitle>Omschrijving</FormTitle>
      <Paragraph strong>{incidentsDetail?.text}</Paragraph>

      {incidentsDetail?._links?.['sia:attachments'] && (
        <FormTitle>Foto</FormTitle>
      )}
      {incidentsDetail?._links?.['sia:attachments']?.map((attachment) => (
        <StyledImg
          key={attachment.href}
          style={{ marginBottom: `${themeSpacing(6)}` }}
          src={attachment.href}
        />
      ))}

      <FormTitle>Locatie</FormTitle>
      <Paragraph strong style={{ marginBottom: `${themeSpacing(6)}` }}>
        {incidentsDetail?.location?.address_text}
      </Paragraph>
      <StyledLink
        style={{ marginBottom: `${themeSpacing(6)}` }}
        variant="inline"
        onClick={() => setShowMap(true)}
      >
        Bekijk op kaart (coming soon)
      </StyledLink>

      {answersGebeurtHetVaker && (
        <>
          <FormTitle>Gebeurt het vaker?</FormTitle>
          <Paragraph strong>{answersGebeurtHetVaker}</Paragraph>
        </>
      )}
    </>
  )
}
