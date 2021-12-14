// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback, useMemo, useContext } from 'react'
import styled from 'styled-components'
import { Row, Column } from '@amsterdam/asc-ui'
import { FormBuilder, FieldGroup } from 'react-reactive-form'

import { locationTofeature } from 'shared/services/map-location'

import MapContext from 'containers/MapContext'

import IncidentDetailContext from '../../context'
import { PATCH_TYPE_LOCATION } from '../../constants'
import LocationInput from './components/LocationInput'

const StyledColumn = styled(Column)`
  display: block;
  background: white;
  position: relative;
`

const LocationForm = () => {
  const {
    incident: { location },
    update,
    close,
  } = useContext(IncidentDetailContext)

  const form = useMemo(
    () =>
      FormBuilder.group({
        location,
      }),
    [location]
  )

  const onQueryResult = useCallback(
    (queryLocation) => {
      form.controls.location.setValue(queryLocation)
    },
    [form.controls.location]
  )

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      const { coordinates, ...formValueLocation } = form.value.location
      const patch = { location: { ...location, ...formValueLocation } }

      if (coordinates) {
        patch.location.geometrie = locationTofeature(coordinates)
        // the API expects a specifc order of coordinates: lng,lat
        patch.location.geometrie.coordinates.reverse()
      }

      update({
        type: PATCH_TYPE_LOCATION,
        patch,
      })

      close()
    },
    [update, form.value, close, location]
  )

  return (
    <Row>
      <StyledColumn span={12}>
        <FieldGroup
          control={form}
          render={() => (
            <MapContext>
              <LocationInput
                data-testid="locationForm"
                locationControl={form.get('location')}
                onClose={close}
                onQueryResult={onQueryResult}
                handleSubmit={handleSubmit}
              />
            </MapContext>
          )}
        />
      </StyledColumn>
    </Row>
  )
}

export default LocationForm
