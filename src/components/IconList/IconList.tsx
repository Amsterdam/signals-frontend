// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2023 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

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
  onClick?: (item: Item) => void
  item?: Item
  checkboxDisabled?: boolean
  checked?: boolean
}

export const IconListItem = ({
  iconUrl,
  children,
  className,
  iconSize = 40,
  id,
  featureStatusType,
  onClick,
  item,
  checkboxDisabled,
  checked,
}: IconListItemProps) => {
  const [checkedState, setCheckedState] = useState<boolean | undefined>(
    undefined
  )
  const [disabled, setDisabled] = useState<boolean>(false)

  const onClickWithDelay = useCallback(
    (item) => {
      if (onClick && !disabled) {
        setDisabled(true)
        setCheckedState(!checked)
        const timeout = setTimeout(() => {
          onClick(item)
          setDisabled(false)
        }, 600)
        return () => clearTimeout(timeout)
      }
    },
    [checked, disabled, onClick]
  )

  return (
    <StyledListItem data-testid={id} className={className}>
      {!checkboxDisabled && (
        <Checkbox
          onClick={() => onClickWithDelay(item)}
          checked={checkedState === undefined ? checked : checkedState}
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
}

const StyledList = styled(List)`
  margin: 0;
`

export default StyledList
