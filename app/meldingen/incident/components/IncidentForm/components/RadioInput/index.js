/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const RadioInput = ({ handler, touched, hasError, meta, parent }) => (
  <div>
    {meta.ifVisible ?
      <div className="row mode_input">
        <Title meta={meta} />

        <div className={`col-${meta.cols || 12} antwoorden`}>
          {meta.values ? map(meta.values, (value, key) => (
            <div className="antwoord" key={key}>
              <input
                id={key}
                className="kenmerkradio"
                {...handler('radio', key)}
                onClick={(e) => meta.updateIncident && parent.meta.setIncident({ [meta.name]: e.target.value })}
              />
              <label htmlFor={key}>{value}</label>
            </div>
          )) : ''}
        </div>

        <ErrorMessage
          touched={touched}
          hasError={hasError}
        />
      </div>
       : ''}
  </div>
);

RadioInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default RadioInput;
