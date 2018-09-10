import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';
const TextInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div>
    {meta && meta.isVisible ?
      <div className="row mode_input">
        <Title meta={meta} options={validatorsOrOpts} />

        <div className={`${meta.className || 'col-12'} invoer`}>
          <input
            type={meta.type}
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

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default TextInput;
