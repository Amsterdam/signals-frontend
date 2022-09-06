// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { useContext } from 'react'
import styled from 'styled-components'
import { Row, Column } from '@amsterdam/asc-ui'

import { coordinatesToFeature } from 'shared/services/map-location'

import MapContext from 'containers/MapContext'

import { useForm, Controller } from 'react-hook-form'
import FormFooter from 'components/FormFooter'
import MapInput from '../../../../components/MapInput'
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

  const { getValues, control, setValue } = useForm({
    defaultValues: {
      location,
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const { coordinates, ...formValueLocation } = getValues().location

    const patch = { location: { ...location, ...formValueLocation } }

    if (coordinates) {
      patch.location.geometrie = coordinatesToFeature(coordinates)
      // the API expects a specifc order of coordinates: lng,lat
      patch.location.geometrie.coordinates.reverse()
    }

    update({
      type: PATCH_TYPE_LOCATION,
      patch,
    })

    close()
  }

  return (
    <Row>
      <StyledColumn span={12}>
        <form data-testid="locationForm" onSubmit={onSubmit}>
          <MapContext>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <MapInput
                  id="map-input"
                  value={field.value}
                  onQueryResult={(location) => {
                    setValue('location', location)
                  }}
                  name={'location'}
                  display={'location'}
                />
              )}
            />
            <FormFooter
              cancelBtnLabel="Annuleer"
              inline
              onCancel={close}
              onSubmitForm={() => {}}
              submitBtnLabel="Opslaan"
            />
          </MapContext>
        </form>
      </StyledColumn>
    </Row>
  )
}

export default LocationForm
