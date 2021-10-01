// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Theme } from 'types/theme'
import ParentIncidentIcon from 'components/ParentIncidentIcon'
import type { FunctionComponent } from 'react'
import { ReporterIncident } from '../types'

import FeedbackStatus from './FeedbackStatus'

const Info = styled.span`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`

const InfoWrapper = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const ListItem = styled.li<{ isSelected: boolean; theme: Theme }>`
  display: flex;
  // Separate lines to prevent wrapping due to max line width
  padding-top: ${themeSpacing(3)};
  padding-right: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(3)};
  padding-left: ${themeSpacing(2)};
  border-bottom: 1px solid ${themeColor('tint', 'level4')};

  :hover {
    cursor: pointer;

    ${Info} {
      text-decoration: underline;
      color: ${themeColor('secondary')};
    }
  }

  ${({ isSelected, theme }) =>
    isSelected &&
    `
      background-color: rgba(0,70,153,0.1);
      border-left: 4px solid ${themeColor('primary')({ theme })};
      margin-left: -4px;
    `}
`

const Wrapper = styled.div`
  display: grid;
  grid: auto-flow / 2fr 1fr 1fr;
  grid-gap: ${themeSpacing(1)};
  width: 100%;
`

const StyledParentIncidentIcon = styled(ParentIncidentIcon)`
  padding-top: ${themeSpacing(1)};
  padding-right: ${themeSpacing(1)};
`

const Spacing = styled.div`
  width: ${themeSpacing(6)};
`

const StyledFeedbackStatus = styled(FeedbackStatus)`
  justify-self: end;
`

const DateTime = styled.p`
  margin: 0;
  color: ${themeColor('tint', 'level5')};
`

interface IncidentListItemProps {
  incident: ReporterIncident
  isSelected: boolean
  onClick: () => void
}

const IncidentListItem: FunctionComponent<IncidentListItemProps> = ({
  incident: { category, feedback, id, status, createdAt, hasChildren },
  isSelected,
  onClick,
}) => (
  <ListItem onClick={onClick} isSelected={isSelected}>
    {hasChildren ? <StyledParentIncidentIcon /> : <Spacing />}
    <Wrapper>
      <InfoWrapper>
        <Info data-testid="incident-info">
          {id} {category}
        </Info>
        <DateTime data-testid="date-time">
          {format(new Date(createdAt), 'dd-MM-yyyy HH:mm')}
        </DateTime>
      </InfoWrapper>
      <span data-testid="incident-status">{status}</span>
      <StyledFeedbackStatus feedback={feedback} />
    </Wrapper>
  </ListItem>
)

export default IncidentListItem
