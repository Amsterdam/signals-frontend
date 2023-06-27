// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import type { FC } from 'react'

import { List, ListItem, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import ChildIncidentDescription from 'components/ChildIncidentDescription'
import ChildIncidentHistory from 'components/ChildIncidentHistory'
import Status from 'signals/incident-management/components/Status'
import statusList from 'signals/incident-management/definitions/statusList'
import type { History } from 'types/history'
import type { StatusCode } from 'types/status-code'

export const STATUS_NONE =
  'signals/incident-managementcomponents/ChildIncidents/STATUS_NONE'
export const STATUS_RESPONSE_REQUIRED =
  'signals/incident-managementcomponents/ChildIncidents/STATUS_RESPONSE_REQUIRED'

export type ChildIncident = {
  href?: string
  values: {
    id: number
    status: StatusCode
    category: string
    handlingTime: string
  }
  changed: boolean
  canView: boolean
  history?: Array<History>
  text?: string
  status?: typeof STATUS_NONE | typeof STATUS_RESPONSE_REQUIRED
}

type ChildIncidentsProps = {
  className?: string
  incidents: Array<ChildIncident>
  parentUpdatedAt: string
}

type LiProps = Pick<ChildIncident, 'status' | 'changed'>

const incidentIsHandled = (incident: ChildIncident) =>
  ['Afgehandeld', 'Gesplitst', 'Geannuleerd'].includes(incident.values.status)

const DisplayValue = styled.span.attrs(() => ({
  'data-testid': 'child-incidents-display-value',
}))`
  word-break: normal;
  white-space: nowrap;
`

const IDDisplayValue = styled(DisplayValue).attrs(() => ({
  'data-testid': 'child-incidents-id-display-value',
}))`
  padding-right: ${themeSpacing(1)};
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledChildIncidentDescription = styled(ChildIncidentDescription)`
  padding-right: ${themeSpacing(2)};
`

const StyledChildIncidentHistory = styled(ChildIncidentHistory)`
  margin-top: ${themeSpacing(3)};
`

const StyledList = styled(List)`
  margin-bottom: 0;
`

const Li = styled(ListItem)<LiProps>`
  display: flex;
  background-color: ${themeColor('tint', 'level3')};
  margin: 0;
  padding: 0;
  position: relative;

  & + & {
    margin-top: ${themeSpacing(1)};
  }

  ${({ status }) => {
    switch (status) {
      case STATUS_RESPONSE_REQUIRED:
        return css`
          &::before {
            background-color: ${themeColor('support', 'focus')};
            border-right: 2px solid white;
            bottom: 0;
            content: '';
            left: 0;
            position: absolute;
            width: ${themeSpacing(1.5)};
            top: 0;
          }
        `

      case STATUS_NONE:
      default:
        return null
    }
  }}

  :hover {
    ${IDDisplayValue} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  & > * {
    padding: ${themeSpacing(3, 5, 3, 4)};
    width: 100%;
    text-decoration: none;
    color: black;
    align-items: stretch;
  }

  ${({ changed }) =>
    changed &&
    css`
      border-left: 4px solid ${themeColor('support', 'focus')};

      & > a {
        border-left: 2px solid white;
        padding-left: ${themeSpacing(2)};
      }
    `}
`

const ChildIncidents: FC<ChildIncidentsProps> = ({
  className,
  incidents,
  parentUpdatedAt,
}) => (
  <StyledList className={className} data-testid="child-incidents">
    {incidents.map((incident) => {
      const status = statusList.find(
        ({ value }) => incident.values.status === value
      )

      const valueEntries = (
        <>
          <Row>
            <div>
              <IDDisplayValue>{incident.values.id}</IDDisplayValue>
              <DisplayValue>{incident.values.category}</DisplayValue>
            </div>
            <DisplayValue
              className={`status ${
                incidentIsHandled(incident) ? 'handled' : 'alert'
              }`}
            >
              {status && (
                <Status statusCode={status.key}>
                  {incident.values.status}
                </Status>
              )}
            </DisplayValue>
          </Row>
          <Row>
            <DisplayValue>
              <StyledChildIncidentDescription
                canView={incident.canView}
                text={incident.text}
              />
            </DisplayValue>
            <DisplayValue>{incident.values.handlingTime}</DisplayValue>
          </Row>
        </>
      )

      return (
        <Fragment key={incident.values.id}>
          <Li
            data-testid="child-incident-list-item"
            status={incident.status}
            changed={incident.changed}
          >
            {incident.href ? (
              <Link to={'../' + incident.href}>{valueEntries}</Link>
            ) : (
              <div>{valueEntries}</div>
            )}
          </Li>
          <StyledChildIncidentHistory
            canView={incident.canView}
            history={incident.history}
            parentUpdatedAt={parentUpdatedAt}
          />
        </Fragment>
      )
    })}
  </StyledList>
)

export default ChildIncidents
