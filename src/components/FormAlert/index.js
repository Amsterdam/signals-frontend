import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  themeColor,
  Heading,
  ascDefaultTheme,
  themeSpacing,
} from '@datapunt/asc-ui';

const Div = styled.div`
  background-color: ${themeColor('tint', 'level2')};
  border-left: ${themeSpacing(0.5)} solid;
  margin-bottom: ${themeSpacing(6)};
  padding: ${themeSpacing(4)};
  border-color: ${({ isNotification }) =>
    isNotification ? themeColor('support', 'valid') : themeColor('secondary')};

  @media (min-width: ${ascDefaultTheme.layouts.small.max}px) {
    font-size: 18px;
    padding-left: ${themeSpacing(5)};
    margin-bottom: ${themeSpacing(8)};
  }
`;

const Title = styled(Heading).attrs({
  forwardedAs: 'h4',
})`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  color: ${({ isNotification }) =>
    isNotification ? themeColor('support', 'valid') : themeColor('secondary')};

  ${({ hasMessage }) =>
    !hasMessage &&
    css`
      margin-bottom: 0;
    `}
`;

/**
 * Component that will display a title and, optionally, a message block. Should be used
 * for generic feedback that is not related to individual fields.
 */
const FormAlert = ({ className, message, title, isNotification }) => (
  <Div className={className} isNotification={isNotification} data-testid="formAlert">
    <Title isNotification={isNotification} hasMessage={Boolean(message)}>
      {title}
    </Title>
    {message && <span>{message}</span>}
  </Div>
);

FormAlert.defaultProps = {
  className: '',
  isNotification: false,
  message: null,
};

FormAlert.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** When true, the alert will show title and border in blue, otherwise red */
  isNotification: PropTypes.bool,
  /** Extra text block, explaining the alert */
  message: PropTypes.node,
  /** Concise error or note */
  title: PropTypes.string.isRequired,
};

export default FormAlert;
