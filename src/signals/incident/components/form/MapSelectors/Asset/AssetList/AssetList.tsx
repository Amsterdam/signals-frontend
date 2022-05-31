// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FunctionComponent } from 'react'

import IconList, { IconListItem } from 'components/IconList/IconList'
import Button from 'components/Button'
import type { FeatureStatusType, FeatureType, Item } from '../../types'
import { FeatureStatus } from '../../types'

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
    status === FeatureStatus.REPORTED
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
  onRemove?: (item: Item) => void
  selection: Item[]
}

interface AssetListItem {
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  onRemove?: (item: Item) => void
  item: Item
}

export const AssetListItem: FunctionComponent<AssetListItem> = ({featureStatusTypes, featureTypes, item, onRemove}) => {
  const { id, type, status } = item
  const { description, icon }: Partial<FeatureType> =
  featureTypes?.find(({ typeValue }) => typeValue === type) ?? {}

  const label = [description, id].filter(Boolean).join(' - ')

  if (!id) return null

  const featureStatusType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === status
  )
  const extendedId = featureStatusType
    ? `assetListItem-${id}-hasStatus`
    : `assetListItem-${id}`

  return (
    <IconListItem
      key={id}
      id={extendedId}
      iconUrl={icon?.iconUrl}
      featureStatusType={featureStatusType}
    >
      <ItemWrapper>
        <StyledLabel>
          {label}
          {featureStatusType?.description && (
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
            onClick={() => onRemove(item)}
          />
        )}
      </ItemWrapper>
    </IconListItem>
  )
}

const AssetList: FunctionComponent<AssetListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
  featureStatusTypes,
}) => {
  console.log(selection)
  return (
    <IconList data-testid="assetList" className={className}>
      {selection.length > 0 && selection.map(item => (
        <AssetListItem
          key={item.id}
          item={item}
          featureTypes={featureTypes}
          featureStatusTypes={featureStatusTypes}
          onRemove={() => onRemove && onRemove(item)}
        />)
      )}
    </IconList>
)}

export default AssetList
