// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useLocation } from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'

import { StyledAlert, StyledMarkdown } from './styled'

export const FrontPageAlert = () => {
  const location = useLocation()
  const alertText = configuration.frontPageAlert.text

  if (!(location.pathname === '/incident/beschrijf') || !alertText) return null

  return (
    <StyledAlert level="error" outline>
      <StyledMarkdown>{alertText}</StyledMarkdown>
    </StyledAlert>
  )
}
