import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Title = ({ meta }) => (
  <div className=" col-12 title">
    <div className="title__label label">{meta && meta.label}</div>
    <div className="title__subtitle">{meta && meta.subtitle}</div>
  </div>
);

Title.propTypes = {
  meta: PropTypes.object
};

export default Title;
