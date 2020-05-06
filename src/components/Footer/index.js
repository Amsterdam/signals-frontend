import React from 'react';
import { Row, Column, Heading, Link, themeColor, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import CONFIGURATION from 'shared/services/configuration/configuration';

const Disclaimer = styled.div`
  background-color: ${themeColor('tint', 'level5')};
  padding-top: ${themeSpacing(7)};
  padding-bottom: ${themeSpacing(7)};

  * {
    color: ${themeColor('bright', 'main')};
  }
`;

const StyledLink = styled(Link)`
  font-size: 16px;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;

  span {
    align-self: center;
  }
`;

const Privacy = styled.div`
  background: ${themeColor('bright', 'main')};
  padding-top: 10px;
  padding-bottom: 10px;
`;

const StyledHeading = styled(Heading)`
  margin: 0 0 ${themeSpacing(3)} 0;
`;

const FooterWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto !important;
    padding-bottom: 0 !important;
  }
`;

const Footer = () => {
  const config = CONFIGURATION.all;

  return (
    <FooterWrapper className="app-container no-print" data-testid="siteFooter">
      <Disclaimer data-testid="disclaimer">
        <Row>
          <Column span={12}>
            <StyledHeading forwardedAs="h2">Lukt het niet om een melding te doen?</StyledHeading>
          </Column>

          <Column span={12}>
            {config.language.footer1} <br />
            {config.language.footer2}
          </Column>
        </Row>
      </Disclaimer>

      <Privacy>
        <Row>
          <Column span={12}>
            <StyledLink href={config.links.privacy} variant="with-chevron">
              Privacy
            </StyledLink>
          </Column>
        </Row>
      </Privacy>
    </FooterWrapper>
  );
};

export default Footer;
