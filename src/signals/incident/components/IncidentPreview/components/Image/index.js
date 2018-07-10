import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ label, value, optional }) => (
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value"><img border="1" height="80" src={value} alt="" /></span>
      </span>
    : ''}
  </span>
);

Image.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool
};

export default Image;
