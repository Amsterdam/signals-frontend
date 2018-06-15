import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ text }) => (
  <span>
    {text}
  </span>
);

Text.propTypes = {
  text: PropTypes.string
};

export default Text;
