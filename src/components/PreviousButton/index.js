import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChevronLeft } from '@datapunt/asc-assets';

import Button from 'components/Button';

const StyledButton = styled(Button)`
  height: 44px;
  align-self: auto;
`;

const PreviousButton = ({ className, children, onClick }) => (
  <StyledButton
    className={className}
    data-testid="previousButton"
    iconLeft={<ChevronLeft />}
    iconSize={14}
    onClick={onClick}
    type="button"
    variant="textButton"
  >
    {children}
  </StyledButton>
);

PreviousButton.defaultProps = {
  className: '',
};

PreviousButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default PreviousButton;
