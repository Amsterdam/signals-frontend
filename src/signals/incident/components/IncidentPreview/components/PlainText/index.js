import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const PlainText = ({ label, value }) => (
  <div className="preview-text">
    <div className="row">
      <div className="col-5 col-md-4">
        <div className="preview-text__item-label">{label}</div>
      </div>
      <div className="col-5 col-md-7">
        <div className="preview-text__item-value">{value}</div>
      </div>
    </div>
  </div>
);

PlainText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default PlainText;
