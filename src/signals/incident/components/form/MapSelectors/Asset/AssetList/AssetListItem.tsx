// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'

import type { FeatureCollection, Point } from 'geojson'
import { useSelector } from 'react-redux'

import {
  ListItem,
  SelectionNearby,
  StyledLabel,
  StyledStatusDescription,
} from './styled'
import type {
  AssetListItem as ItemType,
  Properties,
  SelectionIncident,
} from './types'
import { IconListItem } from '../../../../../../../components/IconList'
import { useFetch } from '../../../../../../../hooks'
import configuration from '../../../../../../../shared/services/configuration/configuration'
import { makeSelectCategory } from '../../../../../containers/IncidentContainer/selectors'
import { selectionIsNearby, selectionIsObject } from '../../constants'
import type { FeatureType } from '../../types'
import { formattedDate } from '../Selector_v2_removeafterfinishepic5440/utils'

export const AssetListItem: FunctionComponent<ItemType> = ({
  featureStatusTypes,
  featureTypes,
  item,
  remove,
}) => {
  const [selectionIncident, setSelectionIncident] = useState<SelectionIncident>(
    {}
  )
  const { get, data } = useFetch<FeatureCollection<Point, Properties>>()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { id, type, status } = item
  const { icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === type) ?? {}

  const featureStatusType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === status
  )
  const extendedId = featureStatusType
    ? `asset-list-item-${id}-has-status`
    : `asset-list-item-${id}`

  const selectionOnMap = selectionIsObject(item) ? item : undefined
  const selectionNearby = selectionIsNearby(item) ? item : undefined

  useEffect(() => {
    if (!selectionOnMap || !item.coordinates || !category || !subcategory)
      return

    const searchParams = new URLSearchParams({
      maincategory_slug: category,
      category_slug: subcategory,
      lat: item.coordinates?.lat.toString(),
      lon: item.coordinates?.lng.toString(),
      group_by: 'category',
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, selectionOnMap, item, category, subcategory])

  useEffect(() => {
    setSelectionIncident({})

    /* istanbul ignore next */
    if (selectionNearby) {
      setSelectionIncident({
        categoryName: item?.label,
        createdAt: item?.description,
      })
    }
    /* istanbul ignore next */
    if (selectionOnMap && data?.features) {
      setSelectionIncident({
        categoryName: data?.features[0].properties.category.name,
        createdAt: formattedDate(data?.features[0].properties.created_at),
      })
    }
  }, [data?.features, item, selectionOnMap, selectionNearby])

  return (
    <ListItem data-testid="asset-list-item">
      {!selectionNearby && (
        <IconListItem
          id={extendedId}
          iconUrl={icon?.iconUrl}
          featureStatusType={featureStatusType}
          remove={remove}
          item={item}
          checked
        >
          <StyledLabel>
            {item.label}
            {featureStatusType?.description && (
              <StyledStatusDescription status={featureStatusType.typeValue}>
                {featureStatusType?.description}
              </StyledStatusDescription>
            )}
          </StyledLabel>
        </IconListItem>
      )}
      {selectionIncident?.categoryName && selectionIncident?.createdAt && (
        <SelectionNearby key={selectionIncident.createdAt}>
          <strong>Deze melding is al bij ons bekend:</strong>
          <p>{selectionIncident.categoryName}</p>
          <span>{selectionIncident.createdAt}</span>
        </SelectionNearby>
      )}
    </ListItem>
  )
}
