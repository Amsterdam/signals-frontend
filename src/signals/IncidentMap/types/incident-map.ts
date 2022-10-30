import type { Feature } from 'geojson'
import type { LatLngTuple } from 'leaflet'

export type PointLatLng = {
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
  icon?: string
  created_at: string
}

export type Filter = {
  name: string
  _display?: string
  filterActive: boolean
  slug: string
  icon?: string
  subCategories?: SubCategory[]
  nrOfIncidents: number
}

export type SubCategory = Omit<Filter, 'subCategories'>

export type Incident = Feature<PointLatLng, Properties>

export interface Icon {
  slug: string
  icon: string
}
