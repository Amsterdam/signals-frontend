// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import IconList from 'components/IconList/IconList'
import { capitalize } from 'shared/services/date-utils'

import { AssetListItem } from './AssetListItem'
import { AssetListItemSelectable } from './AssetListItemSelectable'
import { ListDescription, ListHeading } from './styled'
import type { FeatureStatusType, FeatureType, Item } from '../../types'
import type { SelectableFeature } from '../../types'

export interface AssetListProps {
  className?: string
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  objectTypePlural?: string
  remove?: (item: Item) => void
  selection?: Item[]
  selectableFeatures?: SelectableFeature[]
  zoomLevel?: number
}

const AssetList: FunctionComponent<AssetListProps> = ({
  remove,
  selection,
  className,
  featureTypes,
  featureStatusTypes,
  selectableFeatures,
  objectTypePlural,
  zoomLevel,
}) => {
  const selectableComponents =
    selectableFeatures &&
    selectableFeatures?.map((feature) => {
      return (
        <AssetListItemSelectable
          key={feature.id}
          selection={selection}
          feature={feature}
          featureTypes={featureTypes}
          featureStatusTypes={featureStatusTypes}
        />
      )
    })
  const renderAssetListHeading =
    (zoomLevel && zoomLevel >= 13) || (selection && selection.length > 0)

  return (
    <>
      {renderAssetListHeading && (
        <>
          <ListHeading>
            {(objectTypePlural && capitalize(objectTypePlural)) || 'Objecten'}
          </ListHeading>
          {featureTypes.length > 0 &&
            !(
              (selectableComponents && selectableComponents?.length > 0) ||
              (selection && selection.length > 0)
            ) && (
              <ListDescription>
                {`Er zijn geen ${
                  objectTypePlural || 'objecten'
                } in de buurt. Versleep de kaart om de ${
                  objectTypePlural || 'objecten'
                } te zien.`}
              </ListDescription>
            )}
        </>
      )}
      <IconList data-testid="asset-list" className={className}>
        {selection &&
          selection.length > 0 &&
          selection
            .filter(({ id }) => id)
            .map((item) => (
              <AssetListItem
                key={item.id}
                item={item}
                featureTypes={featureTypes}
                featureStatusTypes={featureStatusTypes}
                remove={remove}
              />
            ))}
        {Array.isArray(selectableComponents) &&
          selectableComponents.length > 0 &&
          selectableComponents}
      </IconList>
    </>
  )
}

export default AssetList
