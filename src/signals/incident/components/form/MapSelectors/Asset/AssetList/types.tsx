import type { LatLngTuple } from 'leaflet'

import type { FeatureStatusType, FeatureType, Item } from '../../types'

export interface AssetListItem {
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  remove?: (item: Item) => void
  item: Item
}

export type SelectionIncident = {
  categoryName?: string
  createdAt?: string
}

export type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

export type Properties = {
  category: {
    name: string
  }
  created_at: string
}
