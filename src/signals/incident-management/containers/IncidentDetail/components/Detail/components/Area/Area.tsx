// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Link as AscLink } from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'

import { INCIDENT_URL } from 'signals/incident-management/routes'

const Area: React.FC<{ count: number; id: number }> = ({ count, id }) => (
  <>
    <dt data-testid="detail-area-definition">Omgeving</dt>
    <dd data-testid="detail-area-value">
      <AscLink as={Link} variant="inline" to={`${INCIDENT_URL}/${id}/omgeving`}>
        {count} {count === 1 ? 'melding' : 'meldingen'} in deze omgeving
      </AscLink>
    </dd>
  </>
)

export default Area
