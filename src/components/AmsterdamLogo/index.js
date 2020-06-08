import React from 'react';
import { LogoShort } from '@datapunt/asc-assets';
import styled, { css } from 'styled-components';
import { breakpoint, themeSpacing, themeColor } from '@datapunt/asc-ui';

export const LogoStyle = styled(LogoShort)`
  display: block;
  height: 100%;
  width: 100%;
`;

const AmsterdamLogoStyle = styled.a`
  display: inline-block;
  height: 30px;
  width: 68px;
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
  </AmsterdamLogoStyle>
);

export default AmsterdamLogo;
