import React from 'react';
import { Row, Column, Heading } from '@datapunt/asc-ui';

const NotFound = () => (
  <div className="container" data-testid="notFoundPage>
    <Row>
      <Column span={12}>
        <article>
          <Heading>Pagina niet gevonden</Heading>
        </article>
      </Column>
    </Row>
  </div>
);

export default NotFound;
