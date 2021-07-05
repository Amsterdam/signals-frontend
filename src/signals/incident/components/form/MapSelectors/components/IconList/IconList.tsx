// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { List, Icon, themeSpacing, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`

const StyledIcon = styled(Icon)`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
  align-self: start;
`

interface IconListItemProps {
  iconUrl: string
  id?: string
  className?: string
  iconSize?: number
}

export const IconListItem: FunctionComponent<IconListItemProps> = ({
  iconUrl,
  iconSize = 40,
  children,
  className,
  id,
}) => (
  <StyledListItem data-testid={id} className={className}>
    <StyledIcon iconUrl={iconUrl} size={iconSize} />
    {children}
  </StyledListItem>
)

export default List
