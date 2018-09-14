import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const KeyValue = ({ label, value, optional, values }) => (
  <div className="preview-text">
    {!optional || (optional && value) ?
      <div className="row">
        {console.log(label)}
        <div className="col-5 col-md-4">
          <div className="preview-text__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-text__item-value">{values[value]}</div>
        </div>
      </div>
      : ''}
  </div>
);

KeyValue.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool,
  values: PropTypes.object
};

export default KeyValue;
