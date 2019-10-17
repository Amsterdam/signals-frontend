import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ObjectValue = ({ label, value }) => (
  <div className="object-value">
    <div className="row">
      <div className="col-5 col-md-4">
        <div className="object-value__item-label">{label}</div>
      </div>
      <div className="col-5 col-md-7">
        <div className="object-value__item-value">{value.label}</div>
      </div>
    </div>
  </div>
);

ObjectValue.propTypes = {
  label: PropTypes.string,
  value: PropTypes.object,
};

export default ObjectValue;
