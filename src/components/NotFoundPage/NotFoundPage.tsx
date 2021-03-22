import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import { Row, Column, Heading, themeSpacing } from '@amsterdam/asc-ui';

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(5)} 0;
`;

export const DEFAULT_MESSAGE = 'Pagina niet gevonden';

interface NotFoundPageProps {
  message?: string;
}

const NotFoundPage: FunctionComponent<NotFoundPageProps> = ({ message = DEFAULT_MESSAGE }) =>
  (<div className="container" data-testid="notFoundPage">
    <Row>
      <Column span={12}>
        <article>
          <StyledHeading>
            {message}
          </StyledHeading>
        </article>
      </Column>
    </Row>
  </div>
  );

export default NotFoundPage;
