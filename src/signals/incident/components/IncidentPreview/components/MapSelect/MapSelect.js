// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'

import { incidentType } from 'shared/types'
import configuration from 'shared/services/configuration/configuration'
import { featureTolocation } from 'shared/services/map-location'

import MapSelect from 'components/MapSelect'
import { getOVLIcon } from '../../../form/MapSelect/iconMapping'

export const DEFAULT_COORDS = configuration.map.options.center

export const getLatlng = (location) => {
  const defaultCoords = { lat: DEFAULT_COORDS[0], lng: DEFAULT_COORDS[1] }
  return location?.geometrie
    ? featureTolocation(location.geometrie)
    : defaultCoords
}

const Values = styled.div`
  margin-bottom: ${themeSpacing(4)};
`

const MapSelectPreview = ({ value, meta, incident }) => (
  <>
    <Values>{value.join('; ')}</Values>
    <MapSelect
      geojsonUrl={meta.endpoint}
      getIcon={getOVLIcon}
      iconField="objecttype"
      idField="objectnummer"
      latlng={getLatlng(incident.location)}
      selectionOnly
      value={value}
    />
  </>
)

MapSelectPreview.propTypes = {
  incident: incidentType,
  meta: PropTypes.shape({
    endpoint: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
  }),
  value: PropTypes.arrayOf(PropTypes.string),
}

export default MapSelectPreview
