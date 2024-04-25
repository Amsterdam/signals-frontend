import type { Feature as FeatuesGeo } from 'geojson'

import type { Feature } from 'signals/incident/components/form/MapSelectors/types'

interface Result {
  features: FeatuesGeo[]
}

interface MappedResult {
  features: Feature[]
}

export const mapCaterpillarFeatures = (result: Result): MappedResult => {
  const mappedFeatures = result.features.map((feature) => {
    return {
      ...feature,
      properties: { ...feature.properties, id: feature.id, type: 'Eikenboom' },
    } as Feature
  })

  return { ...result, features: mappedFeatures }
}
