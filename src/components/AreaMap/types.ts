import type { Point, Feature as GeoFeature } from 'geojson'
import type { Property } from 'types/api/geography'

export type Feature = GeoFeature<Point, Property>
