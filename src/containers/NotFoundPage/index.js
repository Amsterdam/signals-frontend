/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from '@datapunt/asc-ui';

import messages from './messages';

export default function NotFound() {
  return (
    <div className="container" data-testid="notFoundPage">
      <Row>
        <Column span={12}>
          <article>
            <h1>
              <FormattedMessage {...messages.header} />
            </h1>
          </article>
        </Column>
      </Row>
    </div>
  );
}
