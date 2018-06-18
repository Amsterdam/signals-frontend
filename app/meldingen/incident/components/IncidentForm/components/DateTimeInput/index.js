import React from 'react';
import PropTypes from 'prop-types';

// import ErrorMessage from '../ErrorMessage/';

function handleChange(parent, setIncident, value) {
  setIncident({
    incident_date: value
  });
  console.log('handleChange', value, parent);
}

const DateTimeInput = ({ meta, parent }) => (
  <div className="antwoorden checkboxen">
    {console.log('render field')}
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
        onChange={(e) => handleChange(parent, parent.meta.setIncident, e.target.value)}
      />
      <label htmlFor="{meta.name}-now">Nu</label>
    </div>
    <div className="antwoord">
      <input
        type="radio"
        name="{meta.name}"
        id="{meta.name}-earlier"
        value="earlier"
        checked={parent.value.incident_date === 'earlier'}
        onChange={(e) => handleChange(parent, parent.meta.setIncident, e.target.value)}
      />
      <label htmlFor="{meta.name}-earlier">Eerder</label>
    </div>
    {parent.value.incident_date === 'earlier' ?
      <div>select earlier</div>
      : ''
    }
  </div>
);

DateTimeInput.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default DateTimeInput;
