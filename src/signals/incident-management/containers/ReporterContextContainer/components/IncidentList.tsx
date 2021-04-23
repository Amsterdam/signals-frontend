// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { Result } from '../types'
import IncidentListItem from './IncidentListItem'

interface InterfaceListProps {
  list: Result[]
  selectedIncidentId: string
  setSelectedIncidentId: (id: string) => void
  className?: string
}

const IncidentList: React.FunctionComponent<InterfaceListProps> = ({
  list,
  selectedIncidentId,
  setSelectedIncidentId,
  className,
}) => (
  <ul className={className}>
    {list.map((incident) => (
      <IncidentListItem
        key={incident.id}
        incident={incident}
        isSelected={incident.id === selectedIncidentId}
        onClick={() => setSelectedIncidentId(incident.id)}
      />
    ))}
  </ul>
)

export default IncidentList
