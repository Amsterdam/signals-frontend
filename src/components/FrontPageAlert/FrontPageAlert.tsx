// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Alert } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'

import Markdown from '../Markdown'
import { useHistory } from 'react-router-dom'

export const FrontPageAlert = () => {
  const history = useHistory()
  const alertText = configuration.frontPageAlert.text

  if (!(history.location.pathname === '/incident/beschrijf') || !alertText)
    return <></>

  return (
    <Alert level="error" outline style={{ marginTop: 5, marginBottom: 30 }}>
      <Markdown>{alertText}</Markdown>
    </Alert>
  )
}
