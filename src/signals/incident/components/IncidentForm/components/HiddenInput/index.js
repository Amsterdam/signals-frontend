import React from 'react';
import PropTypes from 'prop-types';

const HiddenInput = ({ handler, meta }) => (
  <div>
    <input type="hidden" placeholder={meta.placeholder} readOnly={meta.readOnly} {...handler()} />
  </div>
);

HiddenInput.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object
};

export default HiddenInput;
