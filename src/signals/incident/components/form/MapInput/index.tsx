// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import FormField from 'components/FormField'
import MapInputComponent from 'components/MapInput'
import MapContext from 'containers/MapContext'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { Location } from 'types/incident'
import type { FormInputProps } from 'types/reactive-form'

import getMapCenter from './getMapCenter'
import { TOUCH_GESTURE_MESSAGE_OPTION } from './touchGestureMessage'

const MapInput: FunctionComponent<FormInputProps<Location>> = ({
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
  value,
}) => {
  const center = value?.coordinates || getMapCenter()

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
      className="map-input"
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
      data-testid="map-input"
    >
      <div className="invoer">
        <MapContext>
          <MapInputComponent
            id={meta.name || ''}
            aria-label={configuration.language.mapDescription}
            aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
            onChange={onLocationChange}
            value={value}
            mapOptions={mapOptions}
            hasGPSControl
          />
        </MapContext>
      </div>
    </FormField>
  )
}

export default MapInput
