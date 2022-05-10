// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { formatDate } from 'signals/incident/containers/IncidentReplyContainer/utils'

export const formattedDate = (date: string) =>
  formatDate(new Date(date), `'Gemeld op:' dd MMMM`)
