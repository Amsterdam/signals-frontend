// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { capitalize } from 'shared/services/date-utils'
import parseISO from 'date-fns/parseISO'
import nl from 'date-fns/locale/nl'

const getValue = (value, incident) => {
  if (value && value.id === 'Nu') {
    return 'Nu'
  }

  if (!incident) {
    return ''
  }

  const time = `${incident.incident_time_hours}:${String(
    incident.incident_time_minutes
  ).padStart(2, '0')}`
  if (incident.incident_date === 'Vandaag') {
    return `Vandaag, ${time}`
  }

  return `${capitalize(
    format(parseISO(incident.incident_date), 'EEEE d MMMM', { locale: nl })
  )}, ${time}`
}

const DateTime = ({ value, incident }) => (
  <span>{getValue(value, incident)}</span>
)

DateTime.propTypes = {
  value: PropTypes.shape({}),
  incident: PropTypes.shape({}),
}

export default DateTime
