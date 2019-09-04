import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Row } from '@datapunt/asc-ui';

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: 14px;
  padding-bottom: 10px;
  margin-bottom: 40px;
`;

const PageHeader = ({ className, children, title }) => (
  <StyledSection className={className}>
    <Row>
      <Heading as="h1">{title}</Heading>
      {children}
    </Row>
  </StyledSection>
);

PageHeader.defaultProps = {
  className: '',
  children: null,
};

PageHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageHeader;
