import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// import ErrorMessage from '../ErrorMessage/';

// 2011-10-05T14:48:00.000Z

function handleChange(setIncident, value) {
  setIncident({
    incident_date: value === 'earlier' ? formatDate(0) : value
  });
}

function formatDate(offset, type = 'value') {
  const format = type === 'label' ? 'dddd D MMMM' : 'YYYY-MM-DD';
  if (offset === 0 && format === 'label') {
    return 'vandaag';
  }
  return moment().subtract(offset, 'days').format(format);
}

const DateTimeInput = ({ meta, parent }) => (
  <div className="antwoorden checkboxen">
    <div>{meta.label} {moment.locale()}</div>
    <div>{meta.subtitle}</div>
    <div className="antwoord">
      <input
        className="kenmerkradio"
        type="radio"
        name="{meta.name}"
        id="{meta.name}-now"
        value="now"
        checked={parent.value.incident_date === 'now'}
        onChange={(e) => handleChange(parent.meta.setIncident, e.target.value)}
      />
      <label htmlFor="{meta.name}-now">Nu</label>
    </div>
    <div className="antwoord">
      <input
        type="radio"
        name="{meta.name}"
        id="{meta.name}-earlier"
        value="earlier"
        checked={parent.value.incident_date !== undefined && parent.value.incident_date !== 'now'}
        onChange={(e) => handleChange(parent.meta.setIncident, e.target.value)}
      />
      <label htmlFor="{meta.name}-earlier">Eerder</label>
    </div>
    {parent.value.incident_date !== undefined && parent.value.incident_date !== 'now' ?
      <div>
        <label htmlFor="{meta.name}-select-day">Dag</label>
        <div className="invoer">
          <select
            id="{meta.name}-select-day"
            value={parent.value.incident_date}
            onChange={(e) => handleChange(parent.meta.setIncident, e.target.value)}
          >
            {[...Array(7).keys()].map((offset) => (
              <option key={`select-day-option-${offset}`} value={formatDate(offset)}>{formatDate(offset, 'label')}</option>
            ))}
          </select>
        </div>
        <label htmlFor="{meta.name}-select-time">Tijd</label>
        <div className="in">
          <select
            value={parent.value.incident_time_hours}
            id="{meta.name}-select-time-hours"
            onChange={(e) => parent.meta.setIncident({ incident_time_hours: e.target.value })}
          >
            {[...Array(24).keys()].map((hour) => (
              <option
                key={`select-time-hours-option-${hour}`}
                value={hour}
              >{hour}</option>
            ))}
          </select>

          <select
            id="{meta.name}-select-time-minutes"
            value={parent.value.incident_time_minutes}
            onChange={(e) => parent.meta.setIncident({ incident_time_minutes: e.target.value })}
          >
            {[...Array(12).keys()].map((minute) => (
              <option
                key={`select-time-minutes-option-${minute * 5}`}
                value={minute * 5}
              >{minute * 5}</option>
            ))}
          </select>
        </div>
      </div>
      : ''
    }
  </div>
);

DateTimeInput.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default DateTimeInput;
