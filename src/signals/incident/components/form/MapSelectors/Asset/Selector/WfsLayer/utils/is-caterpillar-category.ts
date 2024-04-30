import type { Feature as FeatureGeo } from 'geojson'

export const isCaterpillarCategory = (feature: FeatureGeo) => {
  return (
    typeof feature.id === 'number' &&
    feature.properties &&
    // properties is an object or an array with a species
    ('species' in feature.properties || 'species' in feature.properties[0])
  )
}
