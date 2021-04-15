// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useCallback, useMemo, useContext } from 'react'
import styled from 'styled-components'
import { Row, Column } from '@amsterdam/asc-ui'
import { FormBuilder, FieldGroup } from 'react-reactive-form'

import MapContext from 'containers/MapContext'

import { mapLocation } from 'shared/services/map-location'
import LocationInput from './components/LocationInput'
import IncidentDetailContext from '../../context'
import { PATCH_TYPE_LOCATION } from '../../constants'

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
    (value) => {
      const newLocation = mapLocation(value)

      form.controls.location.setValue(newLocation)
    },
    [form.controls.location]
  )

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      update({
        type: PATCH_TYPE_LOCATION,
        patch: { location: { ...location, ...form.value.location } },
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
