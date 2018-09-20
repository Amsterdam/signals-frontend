import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header/';

const TextareaInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
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
          <div className="invoer">
            <textarea
              placeholder={meta.placeholder}
              onChange={(e) => meta.updateIncident && parent.meta.updateIncident({ [meta.name]: e.target.value })}
              {...handler()}
            />
          </div>
        </Header>
      </div>
       : ''}
  </div>
);

TextareaInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default TextareaInput;
