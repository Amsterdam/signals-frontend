import { Paragraph } from '@amsterdam/asc-ui'

import { IncidentsList } from '../components'
import { useMyIncidents } from '../hooks'
import { BasePage } from './BasePage'
import { StyledEmail, StyledLink } from './styled'

export const Overview = () => {
  // TODO: Remove mock data
  const { email = 'test@gmail.com' } = useMyIncidents()

  return (
    <BasePage
      pageInfo={{
        documentTitle: 'Mijn Meldingen',
        dataTestId: 'mijnMeldingen',
        pageTitle: 'Mijn Meldingen',
      }}
    >
      <StyledEmail>{email}</StyledEmail>
      <Paragraph>
        Dit zijn de meldingen die u de afgelopen 12 maanden heeft gemaakt:
      </Paragraph>
      <StyledLink href="/incident/beschrijf" variant="inline" fontSize={16}>
        Maak een nieuwe melding
      </StyledLink>

      <IncidentsList />
    </BasePage>
  )
}
