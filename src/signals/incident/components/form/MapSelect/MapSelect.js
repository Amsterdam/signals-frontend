// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'

import MapSelectComponent from 'components/MapSelect'
import configuration from 'shared/services/configuration/configuration'
import { featureTolocation } from 'shared/services/map-location'

import FormField from '../FormField'
import { getOVLIcon, LEGEND_ITEMS } from './iconMapping'

const filter_legend = (items, types) =>
  items.filter((element) => types.includes(element.key))

const DEFAULT_COORDS = configuration.map.options.center

export const getLatlng = (location) => {
  const defaultCoords = { lat: DEFAULT_COORDS[0], lng: DEFAULT_COORDS[1] }
  return location?.geometrie
    ? featureTolocation(location.geometrie)
    : defaultCoords
}

const Selection = styled.span`
  display: inline-block;
  margin-top: ${themeSpacing(3)};
`

const MapSelect = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) => {
  const onSelectionChange = (selection) => {
    const value = [...selection.set.values()]
    parent.meta.updateIncident({ [meta.name]: value })
  }

  const latlng = getLatlng(parent.meta.incidentContainer.incident.location)
  const url = meta.endpoint
  const filtered_legend = filter_legend(LEGEND_ITEMS, meta.legend_items)

  // Get selection array from "handler".
  // the value is not always an array (it's a string on load).
  // So make sure selection is array:
  const value = handler().value
  const selection = Array.isArray(value) ? value : []

  return (
    meta?.isVisible && (
      <FormField
        // className value is referenced by form component
        className="mapSelect"
        meta={meta}
        options={validatorsOrOpts}
        touched={touched}
        hasError={hasError}
        getError={getError}
      >
        <MapSelectComponent
          id={meta.name}
          aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
          geojsonUrl={url}
          getIcon={getOVLIcon}
          hasGPSControl
          iconField="objecttype"
          idField="objectnummer"
          latlng={latlng}
          legend={filtered_legend}
          onSelectionChange={onSelectionChange}
          value={selection}
          zoomMin={meta.zoomMin}
        />
        {selection.length > 0 && (
          <Selection>Gekozen op de kaart: {selection.join('; ')}</Selection>
        )}
      </FormField>
    )
  )
}

MapSelect.defaultProps = {
  hasError: () => {},
}

MapSelect.propTypes = {
  handler: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.shape({
    className: PropTypes.string,
    endpoint: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
    legend_items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    zoomMin: PropTypes.number,
  }),
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
}

export default MapSelect
