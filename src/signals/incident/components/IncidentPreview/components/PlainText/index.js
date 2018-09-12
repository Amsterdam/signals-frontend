import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const PlainText = ({ label, value, optional }) => (
  <div className="preview-text">
    {!optional || (optional && value) ?
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-text__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-text__item-value">{value}</div>
        </div>
      </div>
      : ''}
  </div>
);

PlainText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool
};

export default PlainText;
