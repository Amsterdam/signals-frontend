// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Link as AscLink } from '@amsterdam/asc-ui'

import { INCIDENT_URL } from 'signals/incident-management/routes'
import type { Reporter as ReporterType } from 'types/context'

export interface ReporterProps {
  reporter: ReporterType
  id: number
}

const Reporter: React.FC<ReporterProps> = ({
  reporter: { signal_count, open_count, negative_count },
  id,
}) => (
  <Fragment>
    <dt data-testid="detail-reporter-definition">Meldingen van deze melder</dt>
    <dd data-testid="detail-reporter-value">
      <AscLink as={Link} variant="inline" to={`${INCIDENT_URL}/${id}/melder`}>
        {signal_count} {signal_count === 1 ? 'melding' : 'meldingen'}
      </AscLink>
      <div>
        {negative_count}x niet tevreden / {open_count}x openstaand
      </div>
    </dd>
  </Fragment>
)

export default Reporter
