// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import type { FeatureCollection } from 'geojson'

import IconList from 'components/IconList/IconList'
import configuration from 'shared/services/configuration/configuration'

import { AssetListItem } from './AssetListItem'
import { AssetListItemSelectable } from './AssetListItemSelectable'
import { ListDescription, ListHeading } from './styled'
import type { Feature } from '../../types'
import type { FeatureStatusType, FeatureType, Item } from '../../types'

export interface AssetListProps {
  className?: string
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  objectTypePlural?: string
  remove?: (item: Item) => void
  selection?: Item[]
  selectableFeatures?: FeatureCollection
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
    configuration.featureFlags.showSelectorV2removeafterfinishepic5440 &&
    selectableFeatures &&
    selectableFeatures?.features?.map((feat: any) => {
      const feature = feat as Feature
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
    (configuration.featureFlags.showSelectorV2removeafterfinishepic5440 &&
      zoomLevel &&
      zoomLevel >= 13) ||
    (selection && selection.length > 0)

  return (
    <div>
      {renderAssetListHeading && (
        <>
          <ListHeading>{objectTypePlural || 'Objecten'}</ListHeading>
          {!(
            (selectableComponents && selectableComponents?.length > 0) ||
            (selection && selection.length > 0)
          ) && (
            <ListDescription>
              {`Er zijn geen ${
                objectTypePlural || 'Objecten'
              } in de buurt. Versleep de kaart om de ${
                objectTypePlural || 'Objecten'
              }  te zien.`}
            </ListDescription>
          )}
        </>
      )}
      <IconList data-testid="asset-list" className={className}>
        {selection &&
          selection.length > 0 &&
          selection
            .filter(({ id }) => id)
            .map((item, index) => (
              <AssetListItem
                key={index}
                item={item}
                featureTypes={featureTypes}
                featureStatusTypes={featureStatusTypes}
                remove={() => remove && remove(item)}
              />
            ))}
        {Array.isArray(selectableComponents) &&
          selectableComponents.length > 0 &&
          selectableComponents}
      </IconList>
    </div>
  )
}

export default AssetList
