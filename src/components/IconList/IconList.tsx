// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { List, themeSpacing, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import reportedIconUrl from 'shared/images/icon-reported-marker.svg?url'

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`

const StyledImg = styled.img`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`

const ReportedIcon = styled.img`
  margin-left: -20px;
  margin-top: -30px;
`

interface IconListItemProps {
  iconUrl?: string
  id?: string
  className?: string
  iconSize?: number
  isReported?: boolean
}

export const IconListItem: FunctionComponent<IconListItemProps> = ({
  iconUrl,
  children,
  className,
  iconSize = 40,
  id,
  isReported,
}) => (
  <StyledListItem data-testid={id} className={className}>
    <StyledImg alt="" height={iconSize} src={iconUrl} width={iconSize} />
    {isReported && (
      <ReportedIcon alt="" height={20} src={reportedIconUrl} width={20} />
    )}
    {children}
  </StyledListItem>
)

export default List
