import React from 'react';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import PropTypes from 'prop-types';
import { nl } from 'date-fns/locale';
import Select from 'components/SelectInput';
import { capitalize } from 'shared/services/date-utils';
import Header from '../Header';

import './style.scss';

const formatDate = (offset, type = 'value') => {
  const dateFormat = type === 'label' ? 'EEEE d MMMM' : 'yyyy-MM-dd';
  if (offset === 0) {
    return 'Vandaag';
  }

  const date = subDays(new Date(), offset);
  return capitalize(format(date, dateFormat, { locale: nl }));
};


const DateTimeInput = ({ touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  if (!meta?.isVisible) return null;

  const options = [...Array(7).keys()].map(offset => {
    const name = formatDate(offset, 'label');
    const value = formatDate(offset);
    return ({
      value,
      key: name,
      name,
    });
  });

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <div className="datetime-input__earlier">
        <div className="datetime-input__earlier-date">
          <Select
            name="day"
            data-testid="selectDay"
            label={<strong>Dag</strong>}
            value={`${parent.value.incident_date}`}
            onChange={e => parent.meta.updateIncident({ incident_date: e.target.value })}
            options={options}
          />
        </div>

        <div className="datetime-input__earlier-time">
          <div>
            <Select
              name="hours"
              data-testid="selectHours"
              label={<strong>Tijd</strong>}
              value={`${parent.value.incident_time_hours}`}
              onChange={e => parent.meta.updateIncident({ incident_time_hours: e.target.value })}
              options={[...Array(24).keys()].map(value => ({ value, key: value, name: value }))}
            />
          </div>
          <span className="datetime-input__earlier-time-label">uur</span>
          <div>
            <Select
              name="minutes"
              data-testid="selectMinutes"
              value={`${parent.value.incident_time_minutes}`}
              onChange={e => parent.meta.updateIncident({ incident_time_minutes: e.target.value })}
              options={[...Array(12).keys()].map(minute => ({
                value: minute * 5,
                name: minute * 5,
                key: minute * 5,
              }))}
            />
          </div>
          <span className="datetime-input__earlier-time-label">min</span>
        </div>
      </div>
    </Header>
  );
};

DateTimeInput.propTypes = {
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default DateTimeInput;
