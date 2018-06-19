import React from 'react';
import PropTypes from 'prop-types';

const PlainText = ({ label, value }) => (
  <span>
    <span className="preview-item-label">{label}</span>
    <span className="preview-item-value">{value}</span>
  </span>
);

PlainText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

export default PlainText;
