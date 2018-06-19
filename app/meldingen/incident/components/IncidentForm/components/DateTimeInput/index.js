import React from 'react';
import PropTypes from 'prop-types';

// import ErrorMessage from '../ErrorMessage/';

// 2011-10-05T14:48:00.000Z

function handleChange(setIncident, value) {
  setIncident({
    incident_date: value === 'earlier' ? formatDate(0) : value
  });
}

function formatDate(offset, format = 'value') {
  const options = format === 'label' ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'numeric', day: 'numeric' };
  if (offset === 0 && format === 'label') {
    return 'vandaag';
  }
  const date = new Date();
  const day = date.getDate();
  date.setDate(day - offset);
  return date.toLocaleDateString('nl-NL', options);
}

const DateTimeInput = ({ meta, parent }) => (
  <div className="antwoorden checkboxen">
    <div>{meta.label}</div>
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
            onChange={(e) => handleChange(parent.meta.setIncident, e.target.value)}
          >
            {[...Array(7).keys()].map((offset) => (
              <option key={`select-day-option-${offset}`} value={formatDate(offset)}>{formatDate(offset, 'label')}</option>
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
