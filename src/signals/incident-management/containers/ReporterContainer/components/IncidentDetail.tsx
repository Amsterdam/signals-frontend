import { FunctionComponent, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Heading,
  Link as AscLink,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { format } from 'date-fns'
import { makeSelectSubCategories } from 'models/categories/selectors'
import { useSelector } from 'react-redux'
import type { Incident as IncidentType } from '../../IncidentDetail/types'
import ContactHistory from './ContactHistory'

interface IncidentDetailProps {
  incident: IncidentType
}

const Text = styled(Paragraph)`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-size: 18px;
  margin-bottom: ${themeSpacing(2)};
`

const IncidentDescription = styled(Text)`
  margin-top: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(3)};
`

const DescriptionStyle = styled(Paragraph)`
  font-size: 16px;
  line-height: ${themeSpacing(6)};
`

const InfoStyle = styled(DescriptionStyle)`
  color: ${themeColor('tint', 'level5')};
  display: grid;
  grid: auto-flow / 3fr 4fr;
  grid-gap: ${themeSpacing(6)};
  row-gap: ${themeSpacing(4)};
  width: 100%;
`

const IncidentStyle = styled.div`
  padding-top: ${themeSpacing(5)};
  padding-left: ${themeSpacing(8)};
`

const StyledLink = styled(AscLink)`
  margin-bottom: ${themeSpacing(4)};
  text-decoration: underline;

  :hover {
    cursor: pointer;
    & > * {
      color: ${themeColor('secondary')};
    }
  }
`

const Value = styled.span`
  color: ${themeColor('tint', 'level7')};
`

const IncidentDetail: FunctionComponent<IncidentDetailProps> = ({
  incident,
}) => {
  const subcategories = useSelector(makeSelectSubCategories)
  const { id, description, date, status, subcategory, isParent } =
    useMemo(() => {
      const {
        id,
        created_at: date,
        text: description,
        category: { sub_slug },
        status: { state_display: status },
      } = incident
      const subcategory = subcategories?.find(
        (s: any) => s.slug === sub_slug
      ).extendedName

      return {
        id,
        description,
        date,
        status,
        subcategory,
        isParent: !!incident._links['sia:children'],
      }
    }, [incident, subcategories])

  return (
    <IncidentStyle>
      <StyledLink
        forwardedAs={Link}
        to={`/manage/incident/${id}`}
        target="_blank"
      >
        <Heading data-testid="incident-heading" as="h2" styleAs="h6">
          {`${isParent ? 'Hoofd' : 'Standaard'}melding ${id}`}
        </Heading>
      </StyledLink>
      <IncidentDescription data-testid="incident-description">
        {description}
      </IncidentDescription>
      <InfoStyle>
        <span data-testid="label-date-definition">Gemeld op</span>
        <Value data-testid="value-date-definition">
          {format(new Date(date), 'dd-MM-yyyy HH:mm')}
        </Value>
        <span data-testid="label-subcategory">
          Subcategorie (verantwoordelijke afdeling){' '}
        </span>
        <Value data-testid="value-subcategory">{subcategory}</Value>
        <span data-testid="label-status">Status </span>
        <Value data-testid="value-status">{status}</Value>
      </InfoStyle>
      <Text data-testid="label-history">
        Contactgeschiedenis vanaf afgehandeld
      </Text>
      <ContactHistory id={id} />
    </IncidentStyle>
  )
}

export default IncidentDetail
