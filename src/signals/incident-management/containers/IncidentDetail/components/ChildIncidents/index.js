// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useMemo, useCallback, useContext } from 'react'

import { themeSpacing, Heading, themeColor } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Button from 'components/Button'
import { makeSelectHandlingTimesBySlug } from 'models/categories/selectors'
import { childIncidentType, historyType, incidentType } from 'shared/types'
import ChildIncidentsList from 'signals/incident-management/components/ChildIncidents'
import { INCIDENT_URL } from 'signals/incident-management/routes'

import { PATCH_TYPE_NOTES } from '../../constants'
import IncidentDetailContext from '../../context'

const isChildChanged = (childDatetime, parentDatetime) =>
  new Date(childDatetime) > new Date(parentDatetime)

const Section = styled.section`
  contain: content;
`

const ButtonContainer = styled.div`
  margin: ${themeSpacing(0, 2, 6, 0)};
`

const Title = styled(Heading)`
  margin: ${themeSpacing(4)} 0;
`

const StyledChildIncidentsList = styled(ChildIncidentsList)`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  margin-bottom: ${themeSpacing(4)};
`

const ChildIncidents = ({
  childrenList,
  parent,
  history = [],
  childIncidents = [],
}) => {
  const { update } = useContext(IncidentDetailContext)
  const handlingTimesBySlug = useSelector(makeSelectHandlingTimesBySlug)

  const children = useMemo(
    () =>
      Object.values(childrenList).map(
        ({ status, category, id, updated_at, can_view_signal }) => ({
          href: `${INCIDENT_URL}/${id}`,
          values: {
            id,
            status: status.state_display,
            category: `${category.sub} (${category.departments})`,
            handlingTime: handlingTimesBySlug[category.sub_slug],
          },
          changed: isChildChanged(updated_at, parent.updated_at),
          canView: can_view_signal,
          history: history.find((entry) => entry[0]._signal === id) || [],
          text: childIncidents.find((incident) => incident.id === id)?.text,
        })
      ),
    [
      childrenList,
      handlingTimesBySlug,
      parent.updated_at,
      history,
      childIncidents,
    ]
  )

  const canReset = useMemo(
    () => children.some(({ changed }) => changed),
    [children]
  )

  const resetAction = useCallback(() => {
    update({
      type: PATCH_TYPE_NOTES,
      patch: {
        notes: [{ text: 'Geen actie nodig' }],
      },
    })
  }, [update])

  if (!children?.length) {
    return null
  }

  return (
    <Section>
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">
        Deelmelding
      </Title>

      <StyledChildIncidentsList
        incidents={children}
        parentUpdatedAt={parent.updated_at}
      />

      <ButtonContainer>
        {canReset && (
          <Button
            type="button"
            variant="application"
            data-testid="no-action-button"
            onClick={() => resetAction()}
          >
            Geen actie nodig
          </Button>
        )}
      </ButtonContainer>
    </Section>
  )
}

ChildIncidents.propTypes = {
  childrenList: PropTypes.arrayOf(childIncidentType).isRequired,
  childIncidents: PropTypes.arrayOf(incidentType),
  parent: PropTypes.shape({ updated_at: PropTypes.string }).isRequired,
  history: PropTypes.arrayOf(historyType),
}

export default ChildIncidents
