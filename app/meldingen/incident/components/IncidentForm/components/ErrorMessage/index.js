import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ touched, hasError, meta }) => (
  <div>
    <div>
      {touched
      && hasError('required')
      && `${meta.label} is verplicht veld`}
    </div>

    <div>
      {touched
      && hasError('email')
      && `${meta.label} moet een geldig e-mailadres bevatten`}
    </div>
  </div>
);

ErrorMessage.propTypes = {
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default ErrorMessage;
