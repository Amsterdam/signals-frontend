import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Image = ({ label, value, optional }) => (
  <div className="preview-image">
    {!optional || (optional && value) ?
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-image__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-image__item-value">
            <img className="preview-image__item-value-image" src={value} alt="" />
          </div>
        </div>
      </div>
    : ''}
  </div>
);

Image.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool
};

export default Image;
