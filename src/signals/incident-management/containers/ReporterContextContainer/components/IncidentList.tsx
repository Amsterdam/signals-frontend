// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { Result } from '../types'
import IncidentListItem from './IncidentListItem'

interface InterfaceListProps {
  list: Result[]
  selectedId: string
  selectIncident: (id: string) => void
  className?: string
}

const IncidentList: React.FC<InterfaceListProps> = ({
  list,
  selectedId,
  selectIncident,
  className,
}) => (
  <ul className={className}>
    {list.map((incident) => (
      <IncidentListItem
        key={incident.id}
        incident={incident}
        isSelected={incident.id === selectedId}
        onClick={() => selectIncident(incident.id)}
      />
    ))}
  </ul>
)

export default IncidentList
