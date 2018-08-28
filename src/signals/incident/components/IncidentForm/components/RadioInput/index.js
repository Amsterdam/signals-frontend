import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const RadioInput = ({ handler, touched, hasError, meta, parent, getError }) => (
  <div>
    {meta && meta.isVisible ?
      <div className="row mode_input">
        <Title meta={meta} />

        <div className={`col-${meta.cols || 12} antwoorden`}>
          {meta.values ? map(meta.values, (value, key) => (
            <div className="antwoord" key={`${meta.name}-${key}`}>
              <input
                id={`${meta.name}-${key}`}
                className="kenmerkradio"
                {...handler('radio', value)}
                onClick={(e) => meta.updateIncident && parent.meta.setIncident({ [meta.name]: e.target.value })}
              />
              <label htmlFor={`${meta.name}-${key}`}>{value}</label>
            </div>
          )) : ''}
        </div>

        <ErrorMessage
          touched={touched}
          hasError={hasError}
          getError={getError}
        />
      </div>
       : ''}
  </div>
);

RadioInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default RadioInput;
