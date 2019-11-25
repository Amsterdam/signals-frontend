import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import BackLinkComponent from 'components/BackLink';

import { Heading, Row } from '@datapunt/asc-ui';

const StyledSection = styled.section`
  padding-top: ${({ hasBackLink }) => hasBackLink ? 24 : 12}px;
  padding-bottom: 10px;
  margin-bottom: 40px;

  ${({ hasBackLink }) => hasBackLink && css`
    h1 {
      margin-top: 12px;
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
