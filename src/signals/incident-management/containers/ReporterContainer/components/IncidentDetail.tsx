// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'

import {
  CompactThemeProvider,
  Heading,
  Link as AscLink,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { makeSelectSubCategories } from 'models/categories/selectors'
import type { Incident as IncidentType } from 'types/api/incident'

import ContactHistory from './ContactHistory'

interface IncidentDetailProps {
  incident: IncidentType
}

const Text = styled(Paragraph)`
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: ${themeSpacing(2)};
`

const IncidentDescription = styled(Text)`
  margin-top: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(3)};
`

const InfoStyle = styled(Paragraph)`
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

  &:hover > * {
    color: ${themeColor('secondary')};
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
        category,
        status,
      } = incident
      const subcategory = subcategories?.find(
        (s) => s.slug === category?.sub_slug
      )?.extendedName

      return {
        id,
        description,
        date,
        status: status?.state_display,
        subcategory,
        isParent: !!incident._links['sia:children'],
      }
    }, [incident, subcategories])

  return (
    <IncidentStyle data-testid="incidentDetail">
      <StyledLink
        variant="inline"
        forwardedAs={Link}
        to={`/manage/incident/${id}`}
        target="_blank"
      >
        <Heading data-testid="incident-heading" as="h2" styleAs="h5">
          {`${isParent ? 'Hoofd' : 'Standaard'}melding ${id}`}
        </Heading>
      </StyledLink>
      <IncidentDescription data-testid="incident-description">
        {description}
      </IncidentDescription>
      <CompactThemeProvider>
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
      </CompactThemeProvider>
      <Text data-testid="label-history">
        Contactgeschiedenis vanaf afgehandeld
      </Text>
      <ContactHistory id={id} />
    </IncidentStyle>
  )
}

export default IncidentDetail
