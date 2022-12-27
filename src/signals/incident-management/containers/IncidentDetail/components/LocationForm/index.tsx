// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { FormEvent } from 'react'
import { useContext } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'

import FormFooter from 'components/FormFooter'
import MapContext from 'containers/MapContext'
import { coordinatesToFeature } from 'shared/services/map-location'
import MapInput from 'signals/incident-management/components/MapInput'
import type { Context as IncidentDetailContextType } from 'signals/incident-management/containers/IncidentDetail/types'

import type { Incident } from '../../../../../../types/incident'
import { PATCH_TYPE_LOCATION } from '../../constants'
import IncidentDetailContext from '../../context'

const StyledColumn = styled(Column)`
  display: block;
  background: white;
  position: relative;
`

const LocationForm = () => {
  const { incident, update, close } = useContext<IncidentDetailContextType>(
    IncidentDetailContext
  )

  const location = incident?.location

  const { getValues, control, setValue } = useForm<{
    location: Partial<Incident>
  }>({
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      location,
    },
  })

  const onSubmit = (e: FormEvent) => {
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

    close && close()
  }

  return (
    <Row>
      <StyledColumn span={12}>
        <form data-testid="location-form" onSubmit={onSubmit}>
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
                  name="location"
                  display=""
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
