import React from 'react';
import PropTypes from 'prop-types';

const HiddenInput = ({ handler }) => (
  <div>
    <input
      type="hidden"
      {...handler()}
    />
  </div>
);

HiddenInput.propTypes = {
  handler: PropTypes.func,
};

export default HiddenInput;
