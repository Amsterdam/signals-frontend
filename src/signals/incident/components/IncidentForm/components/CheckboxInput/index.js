import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

const CheckboxInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
      <div className={`${meta.className || 'col-12'} mode_input`}>
        <Header
          meta={meta}
          options={validatorsOrOpts}
          touched={touched}
          hasError={hasError}
          getError={getError}
        >,
          <div className="antwoorden">
            <div className="antwoord">
              <input
                id={meta.name}
                {...handler('checkbox')}
                onClick={(e) => parent.meta.updateIncident({ [meta.name]: e.target.checked })}
              />
              <label htmlFor={meta.name}>{meta.value}</label>
            </div>
          </div>
        </Header>
      </div>
       : ''}
  </div>
);

CheckboxInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object
};

export default CheckboxInput;
