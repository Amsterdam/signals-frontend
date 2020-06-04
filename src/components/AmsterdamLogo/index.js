import React from 'react';
import { LogoShort } from '@datapunt/asc-assets';
import styled, { css } from 'styled-components';
import { srOnlyStyle, breakpoint, themeSpacing, focusStyleOutline } from '@datapunt/asc-ui/lib/utils';

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
  ${focusStyleOutline()}
  ${({ tall }) => tall && css`
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
