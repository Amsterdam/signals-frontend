import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Title = ({ meta }) => (
  <div className=" col-12 title">
    <div className="title__label label">{meta.label}</div>
    <div className="title__subtitle">{meta.subtitle}</div>
  </div>
);

Title.propTypes = {
  meta: PropTypes.object.isRequired
};

export default Title;
