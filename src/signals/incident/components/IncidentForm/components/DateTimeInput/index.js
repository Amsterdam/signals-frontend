import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Title from '../Title/';
// import ErrorMessage from '../ErrorMessage/';

import './style.scss';

const DateTimeInput = ({ meta, parent }) => {
  function formatDate(offset, type = 'value') {
    const format = type === 'label' ? 'dddd D MMMM' : 'YYYY-MM-DD';
    if (offset === 0) {
      return 'Vandaag';
    }
    return moment().subtract(offset, 'days').format(format);
  }

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ?
        <div className={`${meta.className || 'col-12'} mode_input datetime-input`}>
          <div className="invoer antwoorden">
            <Title meta={meta} />

            <div className="datetime-input__earlier">
              <div className="label">
                <label htmlFor={`${meta.name}-select-day`}>Dag</label>
              </div>
              <div className="invoer datetime-input__earlier-date">
                <select
                  id={`${meta.name}-select-day`}
                  className="datetime-input__earlier-day"
                  value={parent.value.incident_date}
                  onChange={(e) => meta.updateIncident && parent.meta.setIncident({ incident_date: e.target.value })}
                >
                  {[...Array(7).keys()].map((offset) => (
                    <option key={`select-day-option-${offset}`} value={formatDate(offset)}>{formatDate(offset, 'label')}</option>
                  ))}
                </select>
              </div>

              <div className="label">
                <label htmlFor={`${meta.name}-select-time-hours`}>Tijd</label>
              </div>
              <div className="invoer datetime-input__earlier-time">
                <select
                  value={parent.value.incident_time_hours}
                  id={`${meta.name}-select-time-hours`}
                  className="datetime-input__earlier-time-hours"
                  onChange={(e) => meta.updateIncident && parent.meta.setIncident({ incident_time_hours: e.target.value })}
                >
                  {[...Array(24).keys()].map((hour) => (
                    <option
                      key={`select-time-hours-option-${hour}`}
                      value={hour}
                    >{hour}</option>
                  ))}
                </select>
                <select
                  id={`${meta.name}-select-time-minutes`}
                  className="datetime-input__earlier-time-minutes"
                  value={parent.value.incident_time_minutes}
                  onChange={(e) => meta.updateIncident && parent.meta.setIncident({ incident_time_minutes: e.target.value })}
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
          </div>
        </div>
         : ''}
    </div>
  );
};

DateTimeInput.propTypes = {
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default DateTimeInput;
