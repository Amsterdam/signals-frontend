import type {
  FeatureIcon,
  FeatureProps,
} from 'signals/incident/components/form/MapSelectors/types'

interface Feature {
  properties: FeatureProps
}

interface FeatureStatusType {
  statusValues: string[] | number[]
  statusField: string
  idField: string
  description: string
  icon: FeatureIcon
}

export function getFeatureStatusType<
  Type1 extends Feature,
  Type2 extends FeatureStatusType
>(feature: Type1, featureStatusTypes: Type2[]): Type2 | undefined {
  const statusValue = feature?.properties[featureStatusTypes[0].statusField]

  return featureStatusTypes.find((statusType) =>
    statusType.statusValues.some((value) => value === statusValue)
  )
}
