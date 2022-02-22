// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FunctionComponent } from 'react'

import IconList, { IconListItem } from 'components/IconList/IconList'
import Button from 'components/Button'
import type { FeatureStatusType, FeatureType, Item } from '../../types'

const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-right: 2px;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  min-width: auto;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const StyledStatusDescription = styled.div<{ status?: string }>`
  color: ${({ status }) =>
    status === 'reported'
      ? themeColor('secondary')
      : themeColor('support', 'valid')};
`

const StyledLabel = styled.div`
  margin-left: ${themeSpacing(2)};
`

export interface AssetListProps {
  className?: string
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  onRemove?: () => void
  selection: Item
}

const AssetList: FunctionComponent<AssetListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
  featureStatusTypes,
}) => {
  const { id, type, status } = selection
  const { description, icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === type) ?? {}

  const label = [description, id].filter(Boolean).join(' - ')

  if (!id) return null

  const featureStatusType = status
    ? featureStatusTypes.find(({ typeValue }) => typeValue === status)
    : undefined
  const extendedId = featureStatusType
    ? `assetListItem-${id}-hasStatus`
    : `assetListItem-${id}`

  return (
    <IconList data-testid="assetList" className={className}>
      <IconListItem
        key={id}
        id={extendedId}
        iconUrl={icon?.iconUrl}
        featureStatusType={featureStatusType}
      >
        <ItemWrapper>
          <StyledLabel>
            {label}
            {featureStatusType && (
              <StyledStatusDescription status={featureStatusType.typeValue}>
                {featureStatusType?.description}
              </StyledStatusDescription>
            )}
          </StyledLabel>
          {onRemove && (
            <StyledButton
              data-testid={`assetListRemove-${id}`}
              aria-label="Verwijder"
              icon={<Close />}
              onClick={onRemove}
            />
          )}
        </ItemWrapper>
      </IconListItem>
    </IconList>
  )
}

export default AssetList
