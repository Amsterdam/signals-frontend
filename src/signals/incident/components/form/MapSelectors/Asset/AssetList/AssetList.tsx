// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FunctionComponent } from 'react'

import IconList, { IconListItem } from 'components/IconList/IconList'
import Button from 'components/Button'

import type { FeatureType, Item, ReportedFeatureType } from '../../types'

const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-left: 8px;
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

const StyledDiv = styled.div`
  color: ${themeColor('secondary')};
`

const StyledLabel = styled.div`
  margin-left: ${themeSpacing(2)};
`

export interface AssetListProps {
  className?: string
  featureTypes: FeatureType[]
  onRemove?: () => void
  selection: Item
}

const AssetList: FunctionComponent<AssetListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
}) => {
  const item = useMemo(() => {
    const { id, type, isReported, isChecked } = selection
    const { description, icon }: Partial<FeatureType> =
      featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

    const label = [description, id].filter(Boolean).join(' - ')

    const baseItem = {
      id,
      label,
    }

    return {
      ...baseItem,
      iconUrl: icon ? icon.iconUrl : '',
      isChecked,
      isReported,
    }
  }, [featureTypes, selection])

  const reportedFeatureType = useMemo(() => {
    return featureTypes.find(
      ({ typeValue }) => typeValue === 'reported'
    ) as ReportedFeatureType
  }, [featureTypes])

  const checkedFeatureType = useMemo(() => {
    return featureTypes.find(
      ({ typeValue }) => typeValue === 'checked'
    ) as ReportedFeatureType
  }, [featureTypes])

  return (
    <IconList data-testid="assetList" className={className}>
      <IconListItem
        key={item.id}
        id={
          item.isReported
            ? `assetListItem-${item.id}-reported`
            : item.isChecked
            ? `assetListItem-${item.id}-checked`
            : `assetListItem-${item.id}`
        }
        iconUrl={item.iconUrl}
        isReported={item.isReported}
        isChecked={item.isChecked}
      >
        <ItemWrapper>
          <StyledLabel>
            <div>{item.label}</div>
            {item.isReported && (
              <StyledDiv>{reportedFeatureType.description}</StyledDiv>
            )}
            {!item.isReported && item.isChecked && (
              <StyledDiv>{checkedFeatureType.description}</StyledDiv>
            )}
          </StyledLabel>
          {onRemove && (
            <StyledButton
              data-testid={`assetListRemove-${item.id}`}
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
