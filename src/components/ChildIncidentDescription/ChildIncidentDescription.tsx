// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import styled from 'styled-components'

interface ChildIncidentDescriptionProps {
  canView: boolean
  text?: string
  className?: string
}

const IncidentDescription = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  // Supported by all major browsers except IE
  // On overflow, render ellipsis on second line
  @supports (-webkit-line-clamp: 2) {
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`

const ChildIncidentDescription: FunctionComponent<
  ChildIncidentDescriptionProps
> = ({ canView, text, className }) => (
  <IncidentDescription className={className}>
    {canView ? text : '-'}
  </IncidentDescription>
)

export default ChildIncidentDescription
