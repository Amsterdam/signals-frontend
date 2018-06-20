/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/';
const TextInput = ({ handler, touched, hasError, meta }) => (
  <div className={`row ${meta.readOnly ? 'mode_readonly' : 'mode_input'} verplicht`}>
    <div className="label col-12">
      <label htmlFor={meta.id}>{meta.label}</label>
    </div>


    <div className="invoer col-12">
      <input className="input" id={meta.id} name={meta.id} type={meta.type} placeholder={meta.placeholder} readOnly={meta.readOnly} {...handler()} />
    </div>
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default TextInput;
