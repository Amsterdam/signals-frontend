import React from 'react';
import { Row, Column, Heading, Link, Paragraph } from '@datapunt/asc-ui';
import styled from 'styled-components';

const Disclaimer = styled(Row)`
  background-color: #666;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;

  * {
    color: white;
  }
`;

const Privacy = styled(Row)`
  background: white;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
`;

const Footer = () => (
  <FooterWrapper className="footer no-print">
    <Disclaimer>
      <Column span={12}>
        <Heading $as="h2">Lukt het niet om een melding te doen?</Heading>
        <Paragraph>&nbsp;</Paragraph>
      </Column>

      <Column span={12}>
        <Paragraph>
          Bel het Gemeentelijk informatienummer: 14 020 <br />
          op werkdagen van 08.00 tot 18.00 uur.
        </Paragraph>
      </Column>
    </Disclaimer>

    <Privacy>
      <Column span={12}>
        <Link href="https://www.amsterdam.nl/privacy/">Privacy</Link>
      </Column>
    </Privacy>
  </FooterWrapper>
);

export default Footer;
