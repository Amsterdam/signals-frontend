import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ touched, hasError }) => (
  <div className="field-errors">
    <div>
      {touched
      && hasError('required')
      && 'Dit is verplicht veld'}
    </div>

    <div>
      {touched
      && hasError('email')
      && 'Het moet een geldig e-mailadres zijn'}
    </div>
  </div>
);

ErrorMessage.propTypes = {
  touched: PropTypes.bool.isRequired,
  hasError: PropTypes.func.isRequired
};

export default ErrorMessage;
