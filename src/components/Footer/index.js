import React from 'react';
import { Row, Column, Heading, Link, Paragraph } from '@datapunt/asc-ui';
import styled from 'styled-components';

const Disclaimer = styled.div`
  background-color: #666;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 20px;

  * {
    color: white;
  }
`;

const Privacy = styled.div`
  padding: 10px 0;
`;

const Footer = () => (
  <div className="footer no-print">
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
  </div>
);

export default Footer;
