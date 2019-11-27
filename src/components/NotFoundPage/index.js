import React from 'react';
import { Row, Column } from '@datapunt/asc-ui';

const NotFoundPage = () => (
  <div className="container" data-testid="notFoundPage">
    <Row>
      <Column span={12}>
        <article>
          <h1>
            Pagina niet gevonden
          </h1>
        </article>
      </Column>
    </Row>
  </div>
);

export default NotFoundPage;
