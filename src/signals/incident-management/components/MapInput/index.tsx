// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import type { ControllerRenderProps } from 'react-hook-form'

import Label from 'components/Label'
import MapInputComponent from 'components/MapInput'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { formatMapLocation } from 'shared/services/map-location'
import type { Location } from 'types/incident'

type Props = {
  display: string
  sort?: boolean
  id?: string
  onQueryResult: (location: Location) => void
} & Partial<ControllerRenderProps>

export const MapInput = (props: Props) => {
  const { name, display, onQueryResult, value: valueFromProps } = props

  const value = formatMapLocation(valueFromProps)
  const defaultCenter =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.map.optionsBackOffice?.center || MAP_OPTIONS.center

  const center = value?.coordinates || defaultCenter

  const mapOptions = {
    ...MAP_OPTIONS,
    ...(configuration.map.optionsBackOffice || {}),
    center,
    zoom: configuration.map.optionsMapInput.zoom,
  }

  const onLocationChange = (location: Location) => {
    onQueryResult(location)
  }

  return (
    <div className="map-input">
      <div className="mode_input map rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        <div className="map-input__control invoer">
          <MapInputComponent
            id="map-input"
            value={value}
            onChange={onLocationChange}
            mapOptions={mapOptions}
            hasZoomControls
            hasGPSControl={false}
          />
        </div>
      </div>
    </div>
  )
}

export default MapInput
