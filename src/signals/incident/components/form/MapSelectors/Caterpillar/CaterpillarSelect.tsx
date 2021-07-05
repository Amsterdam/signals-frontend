// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useCallback, useState } from 'react'
import type { Incident } from 'types/incident'
import type { LatLngExpression } from 'leaflet'
import { ClickEventHandler } from '../types'
import Intro from '../components/Intro'
import type { Item } from './types'
import Summary from './Summary'
import type { Meta } from './types'
import { SelectProvider } from './context/context'
import Selector from './Selector'

export interface CaterpillarSelectProps {
  handler: () => { value: Item[] }
  meta: Meta
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { extra_eikenprocessierups: Item[] }) => void
    }
  }
}

const CaterpillarSelect: FunctionComponent<CaterpillarSelectProps> = ({
  handler,
  meta,
  parent,
}) => {
  const value = handler().value
  const [showMap, setShowMap] = useState(false)
  const [message, setMessage] = useState<string>()

  const { coordinates } =
    parent.meta.incidentContainer.incident.location.geometrie
  const location: LatLngExpression = [coordinates[1], coordinates[0]]

  /* istanbul ignore next */
  const update = useCallback(
    (selectedValue: Item[]) => {
      parent.meta.updateIncident({ extra_eikenprocessierups: selectedValue })
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
    <SelectProvider
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
      {!showMap && value.length === 0 && (
        <Intro edit={edit} location={location} />
      )}

      {showMap && <Selector />}

      {!showMap && value.length > 0 && <Summary />}
    </SelectProvider>
  )
}

export default CaterpillarSelect
