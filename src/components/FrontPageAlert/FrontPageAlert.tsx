// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useHistory } from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'

import { StyledAlert, StyledMarkdown } from './styled'

export const FrontPageAlert = () => {
  const history = useHistory()
  const alertText = configuration.frontPageAlert.text

  if (!(history.location.pathname === '/incident/beschrijf') || !alertText)
    return null

  return (
    <StyledAlert level="error" outline>
      <StyledMarkdown>{alertText}</StyledMarkdown>
    </StyledAlert>
  )
}
