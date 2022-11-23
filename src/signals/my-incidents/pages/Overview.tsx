import { Paragraph } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import configuration from 'shared/services/configuration/configuration'

import { IncidentsList } from '../components'
import { useMyIncidents } from '../hooks'
import {
  StyledEmail,
  StyledLink,
  StyledHeading,
  Wrapper,
  StyledRow,
} from './styled'

export const Overview = () => {
  // TODO: Backend should provide the email when fetching the IncidentList.
  const { email = 'test@gmail.com' } = useMyIncidents()

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
          variant="inline"
          fontSize={16}
          forwardedAs={Link}
        >
          Maak een nieuwe melding
        </StyledLink>

        <IncidentsList />
      </Wrapper>
    </StyledRow>
  )
}
