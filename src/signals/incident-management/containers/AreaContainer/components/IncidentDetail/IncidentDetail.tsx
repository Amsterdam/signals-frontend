import { Link } from 'react-router-dom'
import {
  Heading,
  themeSpacing,
  Link as AscLink,
  themeColor,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import BackLink from 'components/BackLink'
import { string2date, string2time } from 'shared/services/string-parser'
import type { Incident } from 'types/api/incident'
import { isStatusEnd } from 'signals/incident-management/definitions/statusList'

interface IncidentDetailProps {
  incident: Incident
  onBack: () => void
}

const Wrapper = styled.section`
  padding: ${themeSpacing(4)};
`

const StyledLink = styled(AscLink)`
  margin-bottom: ${themeSpacing(4)};
  text-decoration: underline;
  display: block;

  :hover {
    cursor: pointer;
    & > * {
      color: ${themeColor('secondary')};
    }
  }
`

const Section = styled.div`
  margin-top: ${themeSpacing(4)};
`

const SectionTitle = styled.div`
  color: ${themeColor('tint', 'level5')};
`

const Status = styled.div<{ isEnded: boolean }>`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  color: ${({ isEnded }) =>
    themeColor('support', isEnded ? 'valid' : 'invalid')};
`

const formatDate = (date: string): string => {
  return `${string2date(date)} ${string2time(date)}`
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({
  onBack,
  incident,
}) => {
  const isParent = Boolean(incident._links['sia:children'])

  return (
    <Wrapper>
      <Section>
        <BackLink to="#" onClick={() => onBack()}>
          Terug naar filter
        </BackLink>
      </Section>
      <Section>
        <StyledLink
          forwardedAs={Link}
          to={`/manage/incident/${incident.id}`}
          target="_blank"
        >
          <Heading data-testid="incident-heading" as="h2" styleAs="h6">
            {`${isParent ? 'Hoofd' : 'Standaard'}melding ${incident.id}`}
          </Heading>
        </StyledLink>
      </Section>
      <Section>
        <Heading as="h2" styleAs="h3" data-testid="text">
          {incident.text}
        </Heading>
      </Section>
      <Section>
        <SectionTitle>Locatie</SectionTitle>
        <span data-testid="location">
          {incident.location?.address_text || 'Locatie is gepind op de kaart'}
        </span>
      </Section>
      <Section>
        <SectionTitle>Gemeld op</SectionTitle>
        <span data-testid="date">
          {incident.incident_date_start &&
            formatDate(incident.incident_date_start)}
        </span>
      </Section>
      <Section>
        <SectionTitle>Status</SectionTitle>
        <Status isEnded={isStatusEnd(incident.status.state)}>
          <span data-testid="status">{incident?.status.state_display}</span>
        </Status>
      </Section>
      <Section>
        <SectionTitle>Subcategorie (verantwoordelijke afdeling)</SectionTitle>
        <span data-testid="subcategory">{incident.category?.sub} </span>
        <span data-testid="departments">
          ({incident.category?.departments})
        </span>
      </Section>
    </Wrapper>
  )
}

export default IncidentDetail
