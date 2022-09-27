import type { Feature } from 'geojson'
import type { LatLngTuple } from 'leaflet'

export type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

export type Properties = {
  category: {
    name: string
    slug: string
    parent: {
      name: string
      slug: string
    }
  }
  created_at: string
}

export type Filter = {
  name: string
  _display?: string
  filterActive: boolean
  slug: string
}

export type Incident = Feature<Point, Properties>
