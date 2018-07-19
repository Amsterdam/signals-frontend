import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ touched, hasError, getError }) => (
  <div className="field-errors">
    <div>
      {touched
      && hasError('required')
      && 'Dit is een verplicht veld'}
    </div>

    <div>
      {touched
      && hasError('email')
      && 'Het moet een geldig e-mailadres zijn'}
    </div>

    <div>
      {touched
      && hasError('maxLength')
      && `Dit veld mag niet langer dan ${getError('maxLength').requiredLength} characters zijn.`}
    </div>
  </div>
);

ErrorMessage.propTypes = {
  touched: PropTypes.bool.isRequired,
  hasError: PropTypes.func.isRequired,
  getError: PropTypes.func.isRequired
};

export default ErrorMessage;
