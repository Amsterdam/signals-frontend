// Copyright (C) 2021 Gemeente Amsterdam
import { Play } from '@amsterdam/asc-assets'
import { Icon } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.span`
  display: flex;
  & span:nth-child(2) {
    margin-left: -5px; // specific value. Ensures the parent icon composition icons are near each other.
  }
`

interface ParentIncidentIconProps {
  className?: string
}

const ParentIncidentIcon: React.FunctionComponent<ParentIncidentIconProps> = ({
  className,
}) => (
  <Wrapper role="img" aria-label="Hoofdmelding" className={className}>
    <Icon size={14}>
      <Play />
    </Icon>
    <Icon size={14}>
      <Play />
    </Icon>
  </Wrapper>
)

export default ParentIncidentIcon
