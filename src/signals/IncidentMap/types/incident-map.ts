import type { Feature } from 'geojson'

export type PointLatLng = {
  type: 'Point'
  coordinates: [number, number]
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
  public_name?: string | null
  filterActive: boolean
  slug: string
  icon?: string
  subCategories?: SubCategory[]
  incidentsCount: number
  show_children_in_filter?: boolean
}

export type SubCategory = Omit<Filter, 'subCategories'>

export type Incident = Feature<PointLatLng, Properties>

export interface Icon {
  slug: string
  icon?: string
}
