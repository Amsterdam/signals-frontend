/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';
const TextInput = ({ handler, touched, hasError, meta }) => (
  <div className="row mode_input">
    <Title meta={meta} />

    <div className="invoer">
      <input type={meta.type} placeholder={meta.placeholder} readOnly={meta.readOnly} {...handler()} />
    </div>

    <ErrorMessage
      touched={touched}
      hasError={hasError}
    />
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default TextInput;
