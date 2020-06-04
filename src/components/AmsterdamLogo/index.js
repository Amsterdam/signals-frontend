import React from 'react';
import { LogoShort } from '@datapunt/asc-assets';
import styled, { css } from 'styled-components';
import { breakpoint, themeSpacing, themeColor } from '@datapunt/asc-ui';

export const srOnlyStyle = () => ({ srOnly }) =>
  srOnly
    ? css`
        border-width: 0;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      `
    : '';

export const LogoStyle = styled(LogoShort)`
  display: block;
  height: 100%;
  width: 100%;
`;

export const LogoTitleStyle = styled.span`
  ${srOnlyStyle()}
`;

const AmsterdamLogoStyle = styled.a`
  display: inline-block;
  height: 30px;
  width: 68px;
  flex-shrink: 0;
  margin-right: ${themeSpacing(3)};

  &&:focus {
    outline-color: ${themeColor('support', 'focus')};
    outline-style: solid;
    outline-offset: 0px;
    outline-width: 3px;
  }

  ${({ tall }) =>
    tall &&
    css`
      @media screen and ${breakpoint('min-width', 'laptopM')} {
        margin-right: ${themeSpacing(10)};
      }
    `};
`;

const AmsterdamLogo = ({ ...otherProps }) => (
  <AmsterdamLogoStyle {...otherProps}>
    <LogoStyle />
    <LogoTitleStyle srOnly>Gemeente Amsterdam</LogoTitleStyle>
  </AmsterdamLogoStyle>
);

export default AmsterdamLogo;
