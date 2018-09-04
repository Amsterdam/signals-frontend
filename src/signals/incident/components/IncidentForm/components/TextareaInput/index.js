import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';
const TextareaInput = ({ handler, touched, hasError, meta, parent, getError }) => (
  <div>
    {meta && meta.isVisible ?
      <div className="row mode_input">
        <Title meta={meta} />

        <div className={`col-${meta.cols || 12} invoer`}>
          <textarea
            placeholder={meta.placeholder}
            onChange={(e) => meta.updateIncident && parent.meta.setIncident({ [meta.name]: e.target.value })}
            {...handler()}
          />
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

TextareaInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func
};

export default TextareaInput;
