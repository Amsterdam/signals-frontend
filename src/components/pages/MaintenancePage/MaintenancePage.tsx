// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { Alert } from '@amsterdam/asc-ui'

import BasePage from '../BasePage'

const MaintenancePage: FunctionComponent = () => (
  <BasePage
    documentTitle="Onderhoudspagina"
    pageTitle={'Melding openbare ruimte en overlast'}
  >
    <Alert
      level="error"
      heading="Tijdelijk niet te gebruiken"
      content="Wij zijn dit formulier aan het verbeteren. Daarom kunt u het formulier korte tijd niet gebruiken. Probeer het later nog eens."
    />
  </BasePage>
)

export default MaintenancePage
