import React from 'react';
import styled from 'styled-components';
import { Row, Column, Heading, themeSpacing } from '@amsterdam/asc-ui';

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(5)} 0;
`;

const NotFoundPage = () => (
  <div className="container" data-testid="notFoundPage">
    <Row>
      <Column span={12}>
        <article>
          <StyledHeading>
            Pagina niet gevonden
          </StyledHeading>
        </article>
      </Column>
    </Row>
  </div>
);

export default NotFoundPage;
