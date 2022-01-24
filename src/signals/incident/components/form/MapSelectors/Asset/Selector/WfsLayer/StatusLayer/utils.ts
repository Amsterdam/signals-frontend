import type {
  CheckedFeatureType,
  Feature,
  FeatureType,
  ReportedFeatureType,
} from 'signals/incident/components/form/MapSelectors/types'

export const getIsReported = (
  feature: Feature | undefined,
  reportedFeatureType: ReportedFeatureType | undefined
) => {
  if (!feature || !reportedFeatureType) {
    return false
  }
  return Boolean(
    feature.properties[reportedFeatureType.isReportedField] ===
      reportedFeatureType.isReportedValue
  )
}

export const getIsChecked = (
  feature: Feature | undefined,
  checkedFeatureType: CheckedFeatureType | undefined
): boolean => {
  if (!feature || !checkedFeatureType) {
    return false
  }
  const isCheckedValue = feature.properties[checkedFeatureType.isCheckedField]
  return isCheckedValue
    ? Boolean(
        checkedFeatureType.isCheckedValues.includes(isCheckedValue.toString())
      )
    : false
}

export const getReportedFeatureType = (featureTypes: FeatureType[]) =>
  featureTypes.find(({ typeValue }) => typeValue === 'reported')

export const getCheckedFeatureType = (featureTypes: FeatureType[]) =>
  featureTypes.find(({ typeValue }) => typeValue === 'checked')
