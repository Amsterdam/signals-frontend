import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Heading, Row, Paragraph } from '@datapunt/asc-ui';

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: 14px;
  padding-bottom: 10px;
  margin-bottom: 40px;
`;

const StyledHeading = styled(Heading)`
  margin: 0;
  line-height: 44px;
`;

const PageHeader = ({ className, children, subTitle, title }) => (
  <StyledSection className={className}>
    <Row>
      <div>
        <StyledHeading styleAs="h3">{title}</StyledHeading>
        {subTitle && <Paragraph>{subTitle}</Paragraph>}
      </div>

      {children}
    </Row>
  </StyledSection>
);

PageHeader.defaultProps = {
  className: '',
  children: null,
  subTitle: '',
};

PageHeader.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.node.isRequired,
};

export default PageHeader;
