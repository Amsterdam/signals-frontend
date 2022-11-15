import { Paragraph } from '@amsterdam/asc-ui'
import { Row } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'

import configuration from 'shared/services/configuration/configuration'

import { IncidentsList } from '../components'
import { useMyIncidents } from '../hooks'
import { StyledEmail, StyledLink } from './styled'
import { StyledHeading, Wrapper } from './styled'
export const Overview = () => {
  // TODO: Backend should provide the email when fetching the IncidentList.
  const { email = 'test@gmail.com' } = useMyIncidents()

  return (
    <Row>
      <Wrapper>
        <Helmet
          defaultTitle={configuration.language.siteTitle}
          titleTemplate={`${configuration.language.siteTitle} - %s`}
        >
          <title>{'Mijn Meldingen'}</title>
        </Helmet>

        <header>
          <StyledHeading>{'Mijn Meldingen'}</StyledHeading>
        </header>

        <StyledEmail>{email}</StyledEmail>
        <Paragraph>
          Dit zijn de meldingen die u de afgelopen 12 maanden heeft gemaakt:
        </Paragraph>
        <StyledLink href="/incident/beschrijf" variant="inline" fontSize={16}>
          Maak een nieuwe melding
        </StyledLink>

        <IncidentsList />
      </Wrapper>
    </Row>
  )
}
