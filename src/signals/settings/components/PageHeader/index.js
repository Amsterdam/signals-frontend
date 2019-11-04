import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PageHeader from 'components/PageHeader';

const StyledPageHeader = styled(PageHeader)`
  background-color: transparent;
`;

export const PageHeaderComponent = ({
  title,
}) => (
  <StyledPageHeader title={title} />
);

PageHeaderComponent.propTypes = {
  title: PropTypes.string.isRequired,
};


export default PageHeaderComponent;
