import type { FeatureStatusType } from 'signals/incident/components/form/MapSelectors/types'

export const getFeatureStatusType = (
  feature: any,
  featureStatusTypes: FeatureStatusType[]
): FeatureStatusType | undefined => {
  if (!feature || !featureStatusTypes) {
    return
  }

  const statusValue = feature.properties[featureStatusTypes[0]?.statusField]

  if (statusValue) {
    return featureStatusTypes.find((statusType) =>
      statusType.statusValues.some((value) => value === statusValue)
    )
  }

  return
}
