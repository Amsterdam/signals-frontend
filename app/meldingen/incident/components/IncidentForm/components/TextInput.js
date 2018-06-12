import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ handler, touched, hasError, meta }) => (
  <div>
    <input placeholder={meta.placeholder} {...handler()} />
    <span>
      {touched
      && hasError('required')
      && `${meta.label} is verplicht veld`}
      {touched
      && hasError('email')
      && `${meta.label} moet een geldig e-mailadres bevatten`}
    </span>
  </div>
);

TextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.boolean,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default TextInput;
