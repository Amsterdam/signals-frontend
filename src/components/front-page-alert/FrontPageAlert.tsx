// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Alert } from '@amsterdam/asc-ui'

import configuration from 'shared/services/configuration/configuration'

import Markdown from '../Markdown'

export const FrontPageAlert = () => {
  const alertText = configuration.frontPageAlert.text

  return (
    <>
      {alertText && (
        <Alert level="error" outline style={{ marginTop: 5, marginBottom: 30 }}>
          <Markdown>{alertText}</Markdown>
        </Alert>
      )}
    </>
  )
}
