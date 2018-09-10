import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const RadioInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'}  mode_input ${touched && hasError('required') ? 'field--invalid' : ''}`}>
        <Title meta={meta} options={validatorsOrOpts} />

        <ErrorMessage
          touched={touched}
          hasError={hasError}
          getError={getError}
        />

        <div className="antwoorden">
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
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object
};

export default RadioInput;
