import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Image = ({ label, value }) => (
  <div className="preview-image">
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
  </div>
);

Image.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};

export default Image;
