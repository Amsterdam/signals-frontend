import type { Point, Feature as GeoFeature } from 'geojson'
import { Property } from 'types/api/geography'

export type Feature = GeoFeature<Point, Property>
