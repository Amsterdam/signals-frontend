// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import type { FormInputProps } from 'types/reactive-form'
import type { Location } from 'types/incident'
import type { Address } from 'types/address'

import MapInputComponent from 'components/MapInput'
import MapContext from 'containers/MapContext'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { formatMapLocation } from 'shared/services/map-location'

import FormField from '../FormField'
import { TOUCH_GESTURE_MESSAGE_OPTION } from './touchGestureMessage'
import getMapCenter from './getMapCenter'

interface MapValue {
  location?: {
    lat: number
    lng: number
  }
  addressText?: string
  address?: Address
}

const MapInput: FunctionComponent<FormInputProps<Location>> = ({
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
  value,
}) => {
  const mapLocation = formatMapLocation(value) as MapValue
  const { location } = mapLocation

  const center = location ? [location.lat, location.lng] : getMapCenter()

  const mapOptions = {
    ...MAP_OPTIONS,
    ...TOUCH_GESTURE_MESSAGE_OPTION,
    center,
  }

  // Can't use useCallback here, would break the rules of hooks
  const onLocationChange = (location: Location) => {
    parent.meta.updateIncident({ location })
  }

  if (!meta?.isVisible) return null

  return (
    <FormField
      className="mapInput"
      meta={meta}
      options={validatorsOrOpts}
      touched={touched}
      hasError={hasError}
      getError={getError}
      data-testid="mapInput"
    >
      <div className="invoer">
        <MapContext>
          <MapInputComponent
            id={meta.name}
            aria-label={configuration.language.mapDescription}
            aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
            onChange={onLocationChange}
            value={mapLocation}
            mapOptions={mapOptions}
            hasGPSControl
          />
        </MapContext>
      </div>
    </FormField>
  )
}

export default MapInput
