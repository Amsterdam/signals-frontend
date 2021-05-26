// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'
import { incidentType } from 'shared/types'

import MapSelect from 'components/MapSelect'
import MapSelectGenericPreview from '../MapSelectGeneric'
import { getOVLIcon } from '../../../form/MapSelect/iconMapping'

export const DEFAULT_COORDS = [4.900312721729279, 52.37248465266875]

export const getLatlng = (location) => {
  const coords = location?.geometrie?.coordinates || DEFAULT_COORDS
  return {
    latitude: coords[1],
    longitude: coords[0],
  }
}

const Values = styled.div`
  margin-bottom: ${themeSpacing(4)};
`

const MapSelectPreview = ({ value, meta, incident }) => (
  <Fragment>
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
  </Fragment>
)

MapSelectPreview.propTypes = {
  incident: incidentType,
  meta: PropTypes.shape({
    endpoint: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
  }),
  value: PropTypes.arrayOf(PropTypes.string),
}

export default configuration.featureFlags.useMapSelectGeneric
  ? MapSelectGenericPreview
  : MapSelectPreview
