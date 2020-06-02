import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import { Validators } from 'react-reactive-form';

import './style.scss';

const Children = styled.div`
  display: flex;
  flex-flow: column;

  & > * + * {
    margin-top: ${themeSpacing(2)};
  }
`;

const Header = ({
  className, meta, options, touched, hasError, getError, children,
}) => (
  <div className={`${className} header ${touched && (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom')) ? 'header--invalid' : ''}`}>
    <div className="header__label">
      {meta && meta.label}
      {(meta.label && (!options || !options.validators)) || (options && options.validators && !options.validators.includes(Validators.required))
        ? <span className="header--not-required">(optioneel)</span>
        : ''}
    </div>
    <div className="header__subtitle">{meta && meta.subtitle}</div>

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

      <div className="header__errors__item">
        {touched
        && hasError('custom')
        && getError('custom')}
      </div>
    </div>

    <Children>
      {children}
    </Children>
  </div>
);

Header.defaultProps = {
  className: '',
};

Header.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  getError: PropTypes.func,
  children: PropTypes.object,
};

export default Header;
