import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const KeyValue = ({ label, value, values }) => (
  <div className="preview-text">
    <div className="row">
      <div className="col-5 col-md-4">
        <div className="preview-text__item-label">{label}</div>
      </div>
      <div className="col-5 col-md-7">
        <div className="preview-text__item-value">{values && values[value]}</div>
      </div>
    </div>
  </div>
);

KeyValue.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  values: PropTypes.object
};

export default KeyValue;
