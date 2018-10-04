import React from 'react';
import PropTypes from 'prop-types';

import { Validators } from 'react-reactive-form';

import './style.scss';

const Header = ({ meta, options, touched, hasError, getError, children }) => (
  <div className={`header ${touched && (hasError('required') || hasError('email') || hasError('maxLength')) ? 'header--invalid' : ''}`}>
    <div className="header__label">{meta && meta.label}
      {(meta.label && (!options || !options.validators)) || (options && options.validators && !options.validators.includes(Validators.required)) ?
        <span className="header--not-required">(niet verplicht)</span>
      : ''}
    </div>
    <div className="header__subheader">{meta && meta.subheader}</div>

    <div className="header__errors">
      <div className="header__errors__item">
        {touched
        && hasError('required')
        && 'Dit is een verplicht veld'}
      </div>

      <div className="header__errors__item">
        {touched
        && hasError('email')
        && 'Het moet een geldig e-mailadres zijn'}
      </div>

      <div className="header__errors__item">
        {touched
        && hasError('maxLength')
        && `U kunt maximaal ${getError('maxLength').requiredLength} tekens invoeren.`}
      </div>
    </div>

    <div className="header__children">
      {children}
    </div>
  </div>
);

Header.propTypes = {
  meta: PropTypes.object,
  options: PropTypes.object,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  getError: PropTypes.func,
  children: PropTypes.object
};

export default Header;
