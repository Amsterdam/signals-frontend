// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import type { ReporterIncident } from '../types'
import IncidentListItem from './IncidentListItem'

interface InterfaceListProps {
  list: ReporterIncident[]
  selectedIncidentId: number
  selectIncident: (id: number) => void
  className?: string
}

const IncidentList: FunctionComponent<InterfaceListProps> = ({
  list,
  selectedIncidentId,
  selectIncident,
  className,
}) => (
  <ul className={className}>
    {list.map((incident) => (
      <IncidentListItem
        data-testid="incident-list-item"
        key={incident.id}
        incident={incident}
        isSelected={incident.id === selectedIncidentId}
        onClick={() => selectIncident(incident.id)}
      />
    ))}
  </ul>
)

export default IncidentList
