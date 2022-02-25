import type {
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'

export const getFeatureStatusType = (
  feature: Feature,
  featureStatusTypes: FeatureStatusType[]
): FeatureStatusType | undefined => {
  if (!feature || !featureStatusTypes) {
    return
  }

  const statusValue = feature.properties[featureStatusTypes[0]?.statusField]

  if (statusValue) {
    const featureStatusType = featureStatusTypes.find((statusType) =>
      statusType.statusValues.some((value) => value === statusValue)
    )

    return featureStatusType
  }
}
