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
  color: ${(p) => themeColor('support', p.isEnded ? 'valid' : 'invalid')};
`

const IncidentDetail: React.FC<IncidentDetailProps> = ({
  onBack,
  incident,
}) => {
  const isParent = Boolean(incident._links['sia:children'])

  return (
    <Wrapper>
      <Section>
        <BackLink to="#" onClick={() => onBack()}>
          {' '}
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
        <Heading as="h2" styleAs="h3">
          {incident.text}
        </Heading>
      </Section>
      <Section>
        <SectionTitle>Locatie</SectionTitle>
        {incident.location?.address_text || 'Locatie is gepind op de kaart'}
      </Section>
      <Section>
        <SectionTitle>Gemeld op</SectionTitle>
        {string2date(incident.incident_date_start)}{' '}
        {string2time(incident.incident_date_start)}&nbsp;
      </Section>
      <Section>
        <SectionTitle>Status</SectionTitle>
        <Status isEnded={isStatusEnd(incident.status.state)}>
          {incident?.status.state_display}
        </Status>
      </Section>
      <Section>
        <SectionTitle>Subcategorie (verantwoordelijke afdeling)</SectionTitle>
        {incident.category?.sub}
      </Section>
    </Wrapper>
  )
}

export default IncidentDetail
