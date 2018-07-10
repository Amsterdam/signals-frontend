import React from 'react';
import PropTypes from 'prop-types';

const PlainText = ({ label, value, optional }) => (
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value">{value}</span>
      </span>
      : ''}
  </span>
);

PlainText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool
};

export default PlainText;
