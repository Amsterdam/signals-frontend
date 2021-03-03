import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';
import Label from 'components/Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${({ invalid }) =>
    invalid &&
    css`
      border-left: ${themeColor('support', 'invalid')} 2px solid;
      padding-left: ${themeSpacing(3)};
    `}

  /* keep a 3 units margin above the last element/control  */
  & > :last-child :not(& > :first-child) {
    margin-top: ${themeSpacing(3)};
  }
`;

const StyledLabel = styled(Label)`
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`;

const Optional = styled.span`
  font-family: Avenir Next LT W01-Regular, arial, sans-serif;
  margin-left: ${themeSpacing(2)};
`;

const ErrorItem = styled.p`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-top: 0;
  margin-bottom: 0;
  color: ${themeColor('support', 'invalid')};
  line-height: ${themeSpacing(6)};
`;

const SubTitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin-top: 0;
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`;

const Header = ({ className, meta, options, touched, hasError, getError, children }) => {
  const containsErrors =
    touched && (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom'));
  const isOptional = !options?.validators?.some(validator => validator.name === 'required');

  return (
    <Wrapper className={className} invalid={containsErrors}>
      {meta?.label && (
        <StyledLabel htmlFor={meta.name}>
          {meta.label}

          {isOptional && <Optional>(optioneel)</Optional>}
        </StyledLabel>
      )}

      {meta?.subtitle && <SubTitle id={`subtitle-${meta.name}`}>{meta.subtitle}</SubTitle>}

      {touched && containsErrors && (
        <Fragment>
          {hasError('required') && (
            <ErrorItem>{getError('required') === true ? 'Dit is een verplicht veld' : getError('required')}</ErrorItem>
          )}

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

      {children}
    </Wrapper>
  );
};

Header.defaultProps = {
  className: '',
};

Header.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    subtitle: PropTypes.string,
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
