import React from 'react';
import {
  Row, Column, Heading, Link, Paragraph,
} from '@datapunt/asc-ui';
import styled from 'styled-components';

const Disclaimer = styled.div`
  background-color: #666;
  padding-top: 20px;
  padding-bottom: 20px;

  * {
    color: white;
  }
`;

const Privacy = styled.div`
  background: white;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const FooterWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto !important;
    padding-bottom: 0 !important;
  }
`;

const Footer = () => (
  <FooterWrapper className="app-container no-print" data-testid="siteFooter">
    <Disclaimer>
      <Row>
        <Column span={12}>
          <Heading as="h2">Lukt het niet om een melding te doen?</Heading>
          <Paragraph>&nbsp;</Paragraph>
        </Column>

        <Column span={12}>
          <Paragraph>
            Bel het Gemeentelijk informatienummer: 14 020 <br />
            op werkdagen van 08.00 tot 18.00 uur.
          </Paragraph>
        </Column>
      </Row>
    </Disclaimer>

    <Privacy>
      <Row>
        <Column span={12}>
          <Link href="https://www.amsterdam.nl/privacy/">Privacy</Link>
        </Column>
      </Row>
    </Privacy>
  </FooterWrapper>
);

export default Footer;
