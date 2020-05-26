import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox as AscCheckbox, themeSpacing } from '@datapunt/asc-ui';

const Wrapper = styled.span`
  display: inline-block;
  background: white;
  padding-right: ${themeSpacing(2)};
  background-clip: content-box;
`;

const StyledBox = styled(AscCheckbox)`
  padding: 0;
`;

const Checkbox = ({ className, ...props }) => (
  <Wrapper className={className}>
    <StyledBox {...props } />
  </Wrapper>
);

Checkbox.defaultProps = {
  className: '',
};

Checkbox.propTypes = {
  className: PropTypes.string,
};

export default Checkbox;
