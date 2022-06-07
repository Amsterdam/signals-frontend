// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FunctionComponent } from 'react'
import type { FeatureCollection } from 'geojson'
import type { LatLngTuple } from 'leaflet'

import IconList, { IconListItem } from 'components/IconList/IconList'
import Button from 'components/Button'
import { useSelector } from 'react-redux'
import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
import type { FeatureStatusType, FeatureType, Item } from '../../types'
import { FeatureStatus } from '../../types'
import { selectionIsNearby, selectionIsObject } from '../../constants'
import { formattedDate } from '../Selector/utils'

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
  margin: 0 ${themeSpacing(2)};
  font-weight: bold;
`

const SelectionNearby = styled.div`
  margin: ${themeSpacing(3, 0, 0)};
  strong {
    font-weight: bold;
    margin: ${themeSpacing(6, 0, 3)};
    color: ${themeColor('secondary')};
  }
  p {
    display: block;
    margin: ${themeSpacing(2, 0, 0)};
  }
  span {
    display: block;
    margin-bottom: ${themeSpacing(4)};
  }
`

const ListItem = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  margin-bottom: ${themeSpacing(2)};
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

type SelectionIncident = {
  categoryName?: string
  createdAt?: string
}

type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

type Properties = {
  category: {
    name: string
  }
  created_at: string
}

export const AssetListItem: FunctionComponent<AssetListItem> = ({
  featureStatusTypes,
  featureTypes,
  item,
  onRemove,
}) => {
  const [selectionIncident, setSelectionIncident] = useState<SelectionIncident>(
    {}
  )
  const { get, data } = useFetch<FeatureCollection<Point, Properties>>()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { id, type, status } = item
  const { description, icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === type) ?? {}

  const label = [description, id].filter(Boolean).join(' - ')

  const featureStatusType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === status
  )
  const extendedId = featureStatusType
    ? `assetListItem-${id}-hasStatus`
    : `assetListItem-${id}`

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

    if (selectionNearby) {
      setSelectionIncident({
        categoryName: item?.label,
        createdAt: item?.description,
      })
    }

    if (selectionOnMap && data?.features) {
      setSelectionIncident({
        categoryName: data?.features[0].properties.category.name,
        createdAt: formattedDate(data?.features[0].properties.created_at),
      })
    }
  }, [data?.features, selectionOnMap, selectionNearby])

  return (
    <ListItem>
      {!selectionNearby && (
        <IconListItem
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

const AssetList: FunctionComponent<AssetListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
  featureStatusTypes,
}) => {
  return (
    <IconList data-testid="assetList" className={className}>
      {selection.length > 0 &&
        selection.map((item, index) => (
          <AssetListItem
            key={index}
            item={item}
            featureTypes={featureTypes}
            featureStatusTypes={featureStatusTypes}
            onRemove={() => onRemove && onRemove(item)}
          />
        ))}
    </IconList>
  )
}

export default AssetList
