// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import BasePage from '../BasePage'

export const DEFAULT_MESSAGE = 'Pagina niet gevonden'

interface NotFoundPageProps {
  message?: string
}

const NotFoundPage: FunctionComponent<NotFoundPageProps> = ({
  message = DEFAULT_MESSAGE,
}) => <BasePage documentTitle="Pagina niet gevonden" pageTitle={message} />

export default NotFoundPage
