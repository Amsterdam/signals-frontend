// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Theme } from 'types/theme'
import { Result } from '../types'
import FeedbackStatus from './FeedbackStatus'

const Category = styled.span`
  font-weight: 600;
`

const ListItem = styled.li<{ isSelected: boolean; theme: Theme }>`
  padding: ${themeSpacing(2)};
  padding-right: ${themeSpacing(4)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};

  :hover {
    cursor: pointer;

    ${Category} {
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
  padding-left: ${themeSpacing(6)};
  display: grid;
  grid: auto-flow / 2fr 2fr 1fr;
  grid-gap: ${themeSpacing(1)};
`

const StyledFeedbackStatus = styled(FeedbackStatus)`
  justify-self: end;
`

const DateTime = styled.p`
  margin: 0;
  color: ${themeColor('tint', 'level5')};
`

interface IncidentListItemProps {
  incident: Result
  isSelected: boolean
  onClick: () => void
}

const IncidentListItem: React.FC<IncidentListItemProps> = ({
  incident: { category, feedback, id, status, created_at },
  isSelected,
  onClick,
}) => (
  <ListItem onClick={onClick} isSelected={isSelected}>
    <Wrapper>
      <Category>
        {id} {category.sub}
      </Category>
      <span>{status.state_display}</span>
      <StyledFeedbackStatus feedback={feedback} />
      <DateTime>{format(new Date(created_at), 'dd-MM-yyyy HH:mm')}</DateTime>
    </Wrapper>
  </ListItem>
)

export default IncidentListItem
