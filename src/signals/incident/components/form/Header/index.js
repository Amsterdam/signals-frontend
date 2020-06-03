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

const Header = ({ className, meta, options, touched, hasError, getError, children }) => {
  const containsErrors =
    touched && (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom'));

  return (
    <div className={className}>
      {meta.label && (
        <div className="header__label">
          {meta.label}

          {!options ||
            !options.validators ||
            (options && options.validators && !options.validators.includes(Validators.required) && (
              <span className="header--not-required">(optioneel)</span>
            ))}
        </div>
      )}

      {meta?.subtitle && <div className="header__subtitle">{meta.subtitle}</div>}

      {containsErrors && (
        <div className="header__errors">
          {touched && hasError('required') && <div className="header__errors__item">Dit is een verplicht veld</div>}

          {touched && hasError('email') && (
            <div className="header__errors__item">Het moet een geldig e-mailadres zijn</div>
          )}

          {touched && hasError('maxLength') && (
            <div className="header__errors__item">
              U kunt maximaal ${getError('maxLength').requiredLength} tekens invoeren.
            </div>
          )}

          {touched && hasError('custom') && <div className="header__errors__item">{getError('custom')}</div>}
        </div>
      )}

      <Children>{children}</Children>
    </div>
  );
};

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
  children: PropTypes.node,
};

export default Header;
