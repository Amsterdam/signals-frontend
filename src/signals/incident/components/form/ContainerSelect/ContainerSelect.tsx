// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import React, { useCallback, useState } from 'react'
import { ContainerSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'
import Summary from './Summary'
import type { ClickEventHandler, Item, Meta } from './types'
import type { Incident } from 'types/incident'
import type { LatLngExpression } from 'leaflet'

export interface ContainerSelectProps {
  handler: () => { value: Item[] }
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { extra_container: Item[] }) => void
    }
  }
}

const ContainerSelect: FunctionComponent<ContainerSelectProps> = ({
  handler,
  meta,
  parent,
}) => {
  const value = handler().value
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()

  const {
    coordinates,
  } = parent.meta.incidentContainer.incident.location.geometrie
  const location: LatLngExpression = [coordinates[1], coordinates[0]]

  /* istanbul ignore next */
  const update = useCallback(
    (selectedValue: Item[]) => {
      parent.meta.updateIncident({ extra_container: selectedValue })
    },
    [parent]
  )

  const edit = useCallback<ClickEventHandler>(
    (event) => {
      event.preventDefault()
      setShowMap(true)
    },
    [setShowMap]
  )

  const close = useCallback<() => void>(() => {
    setShowMap(false)
  }, [setShowMap])

  return (
    <ContainerSelectProvider
      value={{
        selection: value,
        location,
        meta,
        message,
        update,
        edit,
        close,
        setMessage,
      }}
    >
      {!showMap && value.length === 0 && <Intro />}

      {showMap && <Selector />}

      {!showMap && value.length > 0 && <Summary />}
    </ContainerSelectProvider>
  )
}

export default ContainerSelect
