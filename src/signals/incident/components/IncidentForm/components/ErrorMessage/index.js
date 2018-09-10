import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ErrorMessage = ({ touched, hasError, getError }) => (
  <div className="field-errors">
    <div className="field-errors__item">
      {touched
      && hasError('required')
      && 'Dit is een verplicht veld'}
    </div>

    <div className="field-errors__item">
      {touched
      && hasError('email')
      && 'Het moet een geldig e-mailadres zijn'}
    </div>

    <div className="field-errors__item">
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
