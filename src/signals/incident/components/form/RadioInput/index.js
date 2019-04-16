import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

const RadioInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <Header
          meta={meta}
          options={validatorsOrOpts}
          touched={touched}
          hasError={hasError}
          getError={getError}
        >
          <div className="antwoorden">
            {meta.values ? meta.values.map((value, key) => (
              <div className="antwoord" key={value}>
                <input
                  id={`${meta.name}-${key + 1}`}
                  className="kenmerkradio"
                  {...handler('radio', value)}
                  onClick={(e) => parent.meta.updateIncident({ [meta.name]: e.target.value })}
                />
                <label htmlFor={`${meta.name}-${key + 1}`}>{value}</label>
              </div>
            )) : ''}
          </div>
        </Header>
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
