// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useSelectionProps } from './hooks/useSelectionProps'
import { StyledLabel, ListItem } from './styled'
import { IconListItem } from '../../../../../../../components/IconList'
import type { Feature, FeatureType, Item, FeatureStatusType } from '../../types'

export type Props = {
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  feature: Feature
  selection?: Item[]
}

export const AssetListItemSelectable = ({
  featureTypes,
  featureStatusTypes,
  feature,
  selection,
}: Props) => {
  const props = useSelectionProps({
    featureTypes,
    featureStatusTypes,
    feature,
    selection,
  })
  if (!props) return null

  const { id, item, featureStatusType, icon, onClick } = props
  return (
    <ListItem data-testid="asset-list-item-selectable">
      <IconListItem
        id={`${id}`}
        iconUrl={icon?.iconUrl}
        featureStatusType={featureStatusType}
        remove={onClick}
        item={item}
        checked={false}
      >
        <StyledLabel>{item.label}</StyledLabel>
      </IconListItem>
    </ListItem>
  )
}
