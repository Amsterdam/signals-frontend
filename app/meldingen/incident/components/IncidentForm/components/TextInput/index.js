/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';
const TextInput = ({ handler, touched, hasError, meta, parent }) => (
  <div>
    {meta.ifVisible ?
      <div className="row mode_input">
        <Title meta={meta} />

        <div className={`col-${meta.cols || 12} invoer`}>
          <input
            type={meta.type}
            placeholder={meta.placeholder}
            readOnly={meta.readOnly}
            onChange={(e) => parent.meta.updateIncident({ [meta.name]: e.target.value })}
            {...handler()}
          />
        </div>

        <ErrorMessage
          touched={touched}
          hasError={hasError}
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
  parent: PropTypes.object
};

export default TextInput;
