import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';

import { validateRequired } from '../../../services/custom-validators';
import { Validators } from 'react-reactive-form';

const customRequiredFnName = validateRequired().name;

const Children = styled.div`
  display: flex;
  flex-flow: column;
`;

const Wrapper = styled.div`
  ${({ invalid }) =>
    invalid &&
    css`
      border-left: ${themeColor('support', 'invalid')} 2px solid;
      padding-left: ${themeSpacing(3)};
    `}
`;

const Label = styled.div`
  font-family: Avenir Next LT W01 Demi;
  margin-bottom: ${themeSpacing(2)};
`;

const Optional = styled.span`
  font-family: Avenir Next LT W01-Regular;
  margin-left: ${themeSpacing(2)};
`;

const ErrorItem = styled.div`
  color: ${themeColor('support', 'invalid')};
  font-size: 14px;
  margin-bottom: ${themeSpacing(1)};
`;

const SubTitle = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(-1)};
  margin-bottom: ${themeSpacing(2)};
`;

const Header = ({ className, meta, options, touched, hasError, getError, children }) => {
  const containsErrors =
    touched && (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom'));
  const isOptional =
    !options?.validators?.includes(Validators.required) &&
    Boolean(!options?.validators?.find(fn => fn.name === customRequiredFnName));

  return (
    <Wrapper className={className} invalid={containsErrors}>
      {meta?.label && (
        <Label>
          {meta.label}

          {isOptional && <Optional>(optioneel)</Optional>}
        </Label>
      )}

      {meta?.subtitle && <SubTitle>{meta.subtitle}</SubTitle>}

      {touched && containsErrors && (
        <Fragment>
          {hasError('required') && <ErrorItem>Dit is een verplicht veld</ErrorItem>}

          {hasError('email') && (
            <ErrorItem>
              Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl
            </ErrorItem>
          )}

          {hasError('maxLength') && (
            <ErrorItem>U heeft meer dan de maximale {getError('maxLength').requiredLength} tekens ingevoerd</ErrorItem>
          )}

          {hasError('custom') && <ErrorItem>{getError('custom')}</ErrorItem>}
        </Fragment>
      )}

      <Children>{children}</Children>
    </Wrapper>
  );
};

Header.defaultProps = {
  className: '',
};

Header.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.shape({
    label: PropTypes.string,
    subtitle: PropTypes.string,
    requiredErrorMessage: PropTypes.string,
  }),
  options: PropTypes.shape({
    validators: PropTypes.arrayOf(PropTypes.any),
  }),
  touched: PropTypes.bool,
  hasError: PropTypes.func.isRequired,
  getError: PropTypes.func,
  children: PropTypes.node,
};

export default Header;
