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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const featureStatusType = featureStatusTypes.find(({ statusValues }) =>
      statusValues.includes(statusValue)
    )
    return featureStatusType
  }
}
