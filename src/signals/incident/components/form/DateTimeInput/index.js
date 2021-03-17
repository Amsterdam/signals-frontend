import React from 'react';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import PropTypes from 'prop-types';
import nl from 'date-fns/locale/nl';
import Select from 'components/Select';
import { capitalize } from 'shared/services/date-utils';
import Header from '../Header';
import styled from 'styled-components';
import Label from 'components/Label';
import { themeSpacing } from '@amsterdam/asc-ui';

const StyledLabel = styled(Label)`
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`;

const Info = styled.span`
  margin: ${themeSpacing(0, 4, 0, 2)};
`;

const DateTimeInputStyle = styled.div`
  margin-top: -12px;
`;

const FieldWrapper = styled.div`
  width: 240px; /* fixed value from design */

  & > div:last-child {
    margin-top: ${themeSpacing(3)};
  }
`;

const TimeWrapper = styled.div`
  margin-top: ${themeSpacing(7)};
  display: flex;
  align-items: flex-end;

  & > div:first-child > div:last-child {
    margin-top: ${themeSpacing(3)};
  }

  select {
    width: 80px; /* fixed value from design */
  }
`;
const StyledSelect = styled(Select)``;

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
    return {
      value,
      key: name,
      name,
    };
  });

  return (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <DateTimeInputStyle>
        <FieldWrapper>
          <StyledLabel htmlFor="day">Dag</StyledLabel>
          <StyledSelect
            id="day"
            name="day"
            data-testid="selectDay"
            value={`${parent.value.incident_date}`}
            onChange={e => parent.meta.updateIncident({ incident_date: e.target.value })}
            options={options}
          />
        </FieldWrapper>

        <TimeWrapper>
          <div>
            <StyledLabel>Tijd</StyledLabel>
            <StyledSelect
              id="hours"
              aria-describedby="uur"
              name="hours"
              data-testid="selectHours"
              value={`${parent.value.incident_time_hours}`}
              onChange={e => parent.meta.updateIncident({ incident_time_hours: e.target.value })}
              options={[...Array(24).keys()].map(value => ({ value, key: value, name: value }))}
            />
          </div>
          <Info id="uur">uur</Info>
          <div>
            <StyledSelect
              id="minutes"
              name="minutes"
              aria-describedby="min"
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
          <Info id="min" aria-label="minuten">
            min
          </Info>
        </TimeWrapper>
      </DateTimeInputStyle>
    </Header>
  );
};

DateTimeInput.defaultProps = {
  hasError: () => {},
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
