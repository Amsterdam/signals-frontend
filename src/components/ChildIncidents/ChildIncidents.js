// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import { List, ListItem, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import ChildIncidentHistory from 'components/ChildIncidentHistory'
import ChildIncidentDescription from 'components/ChildIncidentDescription'
import { historyType } from 'shared/types'

export const STATUS_NONE = 'components/ChildIncidents/STATUS_NONE'
export const STATUS_RESPONSE_REQUIRED =
  'components/ChildIncidents/STATUS_RESPONSE_REQUIRED'

const DisplayValue = styled.span`
  word-break: normal;
  white-space: nowrap;
`

const IDDisplayValue = styled(DisplayValue)`
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

const Li = styled(ListItem)`
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

const ChildIncidents = ({ className, incidents, parentUpdatedAt }) => (
  <StyledList className={className} data-testid="childIncidents">
    {incidents.map((incident) => {
      const valueEntries = (
        <>
          <Row>
            <div>
              <IDDisplayValue key="id" title={incident.values.id}>
                {incident.values.id}
              </IDDisplayValue>
              <DisplayValue key="category" title={incident.values.category}>
                {incident.values.category}
              </DisplayValue>
            </div>
            <DisplayValue key="status" title={incident.values.status}>
              {incident.values.status}
            </DisplayValue>
          </Row>
          <Row>
            <DisplayValue>
              <StyledChildIncidentDescription
                canView={incident.canView}
                text={incident.text}
              />
            </DisplayValue>
            <DisplayValue
              key="handling-time"
              title={incident.values.handlingTime}
            >
              {incident.values.handlingTime}
            </DisplayValue>
          </Row>
        </>
      )

      return (
        <Fragment key={incident.values.id}>
          <Li status={incident.status} changed={incident.changed}>
            {incident.href ? (
              <Link to={incident.href}>{valueEntries}</Link>
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

ChildIncidents.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  parentUpdatedAt: PropTypes.string.isRequired,
  incidents: PropTypes.arrayOf(
    PropTypes.exact({
      href: PropTypes.string,
      status: PropTypes.string,
      values: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
      }),
      changed: PropTypes.bool.isRequired,
      canView: PropTypes.bool.isRequired,
      history: historyType,
      text: PropTypes.string,
    })
  ),
}

export default ChildIncidents
