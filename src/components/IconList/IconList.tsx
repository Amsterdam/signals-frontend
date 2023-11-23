// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { List } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import type {
  FeatureStatusType,
  Item,
} from 'signals/incident/components/form/MapSelectors/types'

import { StyledListItem, StyledImg, StatusIcon } from './styled'
import Checkbox from '../Checkbox'

export interface IconListItemProps {
  iconUrl?: string
  id?: string
  className?: string
  iconSize?: number
  featureStatusType?: FeatureStatusType
  children: ReactNode
  remove?: (item: Item) => void
  item?: Item
  checked?: boolean
  checkboxDisabled?: boolean
}

export const IconListItem = ({
  iconUrl,
  children,
  className,
  iconSize = 40,
  id,
  featureStatusType,
  remove,
  item,
  checked,
  checkboxDisabled,
}: IconListItemProps) => (
  <StyledListItem data-testid={id} className={className}>
    {!checkboxDisabled && (
      <Checkbox
        onClick={() => remove && item && remove(item)}
        checked={checked}
      />
    )}
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

const StyledList = styled(List)`
  margin: 0;
`

export default StyledList
