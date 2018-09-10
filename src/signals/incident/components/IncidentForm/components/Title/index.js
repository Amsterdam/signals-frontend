import React from 'react';
import PropTypes from 'prop-types';

import { Validators } from 'react-reactive-form';

import './style.scss';

const Title = ({ meta, options }) => (
  <div className="title">
    <div className="title__label">{meta && meta.label}
      {!options || !options.validators || (options && options.validators && !options.validators.includes(Validators.required)) ?
        <span className="title--not-required">(niet verplicht)</span>
      : ''}
    </div>
    <div className="title__subtitle">{meta && meta.subtitle}</div>
  </div>
);

Title.propTypes = {
  meta: PropTypes.object,
  options: PropTypes.object
};

export default Title;
