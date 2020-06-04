import React from 'react';
import PropTypes from 'prop-types';

const HiddenInput = ({ handler }) => {
  const { value, name } = handler();

  if (!value || !name) return null;

  return <input type="hidden" {...handler()} />;
};

HiddenInput.propTypes = {
  handler: PropTypes.func,
};

export default HiddenInput;
