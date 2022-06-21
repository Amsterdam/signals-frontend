// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { List, themeSpacing, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FeatureStatusType } from 'signals/incident/components/form/MapSelectors/types'

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  margin: ${themeSpacing(3, 0, 0)};
`

const StyledImg = styled.img`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`

const StatusIcon = styled.img`
  margin-left: -20px;
  margin-top: -30px;
`

export interface IconListItemProps {
  iconUrl?: string
  id?: string
  className?: string
  iconSize?: number
  featureStatusType?: FeatureStatusType
}

export const IconListItem: FunctionComponent<IconListItemProps> = ({
  iconUrl,
  children,
  className,
  iconSize = 40,
  id,
  featureStatusType,
}) => (
  <StyledListItem data-testid={id} className={className}>
    {iconUrl && (
      <StyledImg alt="" height={iconSize} src={iconUrl} width={iconSize} />
    )}
    {featureStatusType && (
      <StatusIcon
        alt=""
        height={20}
        src={featureStatusType.icon.iconUrl}
        width={20}
      />
    )}
    {children}
  </StyledListItem>
)

export default List
