import type { Feature as FeatuesGeo } from 'geojson'

import type { Feature } from 'signals/incident/components/form/MapSelectors/types'

interface Result {
  features: FeatuesGeo[]
}

export const mapCaterpillarFeatures = (result: Result) => {
  const mappedFeatures = result.features.map((feature) => {
    if (Array.isArray(feature.properties)) {
      if (!feature.properties[0].type) {
        return {
          ...feature,
          properties: {
            ...feature.properties[0],
            id: feature.id,
            type: 'Eikenboom',
          },
        }
      } else return feature
    } else if (!feature.properties?.type) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          id: feature.id,
          type: 'Eikenboom',
        },
      }
    } else return feature
  }) as Feature[]

  return { ...result, features: mappedFeatures }
}
