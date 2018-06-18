import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ label, value }) => (
  <span>
    <span className="preview-item-label">{label}</span>
    <span className="preview-item-value">{value}</span>
  </span>
);

Text.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

export default Text;
