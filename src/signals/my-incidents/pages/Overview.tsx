// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2024 Gemeente Amsterdam
import { useEffect } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

import {
  StyledEmail,
  StyledLink,
  StyledHeading,
  Wrapper,
  StyledRow,
} from './styled'
import { IncidentsList } from '../components'
import { useMyIncidentContext } from '../context'
import type { Email } from '../types'

export const Overview = () => {
  const { get, data } = useFetch<Email>()
  const { email, setEmail } = useMyIncidentContext()
  const token =
    location.pathname.split('/')[location.pathname.split('/').length - 1]

  useEffect(() => {
    data && setEmail(data.email)
  }, [setEmail, data])

  useEffect(() => {
    !email &&
      get(
        configuration.MY_SIGNALS_USER,
        {},
        {},
        { Authorization: `Token ${token}` }
      )
  }, [email, get, token])

  useEffect(() => {
    ;(window as any).dataLayer?.push({
      event: 'interaction.component.virtualPageview',
      meta: {
        vpv_url: `/mijn-meldingen/ingelogd/`,
      },
    })
  }, [])

  return (
    <StyledRow>
      <Wrapper>
        <Helmet
          defaultTitle={configuration.language.siteTitle}
          titleTemplate={`${configuration.language.siteTitle} - %s`}
        >
          <title>{'Mijn Meldingen'}</title>
        </Helmet>

        <header>
          <StyledHeading>{'Mijn meldingen'}</StyledHeading>
        </header>

        <StyledEmail>{email}</StyledEmail>
        <Paragraph>
          Dit zijn de meldingen die u de afgelopen 12 maanden heeft gemaakt:
        </Paragraph>
        <StyledLink
          to="/incident/beschrijf"
          onClick={() =>
            (window as any)?.dataLayer?.push({
              event: 'interaction.generic.component.linkClick',
              meta: {
                category: 'interaction.generic.component.linkClick',
                action: 'myIncidentsOverview - intern',
                label: 'Maak een nieuwe melding - /incident/beschrijf',
              },
            })
          }
          variant="inline"
          fontSize={16}
          forwardedAs={Link}
        >
          Maak een nieuwe melding
        </StyledLink>

        <IncidentsList token={token} />
      </Wrapper>
    </StyledRow>
  )
}
