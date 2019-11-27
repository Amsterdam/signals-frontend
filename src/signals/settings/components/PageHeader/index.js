import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import BackLinkComponent from 'components/BackLink';

import { Heading, Row, themeSpacing } from '@datapunt/asc-ui';

const StyledSection = styled.section`
  padding-top: ${({ hasBackLink }) => hasBackLink ? themeSpacing(6) : themeSpacing(3)};
  padding-bottom: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(5)};

  ${({ hasBackLink }) => hasBackLink && css`
    h1 {
      margin-top: ${themeSpacing(3)};
    }
  `}
`;

const StyledHeading = styled(Heading)`
  margin: 0;
  line-height: 44px;
`;

const PageHeader = ({ BackLink, className, children, title }) => (
  <StyledSection className={className} hasBackLink={Boolean(BackLink)}>
    <Row>
      <div>
        {BackLink}
        <StyledHeading>{title}</StyledHeading>
      </div>

      {children}
    </Row>
  </StyledSection>
);

PageHeader.defaultProps = {
  BackLink: null,
  className: '',
  children: null,
};

PageHeader.propTypes = {
  BackLink: PropTypes.objectOf(BackLinkComponent),
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.node.isRequired,
};

export default PageHeader;
