import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@datapunt/asc-ui';
import { Close as CloseIcon } from '@datapunt/asc-assets';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  position: absolute;
  top: 10px;
  z-index: 1;
  right: ${({ theme }) => theme.layouts.small.margin}px;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    right: ${({ theme }) => theme.layouts.medium.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.big.max}px) {
    right: ${({ theme }) => theme.layouts.big.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    right: ${({ theme }) => theme.layouts.large.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.xLarge.min}px) {
    right: ${({ theme }) => theme.layouts.xLarge.margin}px;
  }
`;

const CloseButton = ({ className, onClick }) => (
  <StyledButton
    className={className}
    icon={<CloseIcon />}
    iconSize={16}
    onClick={onClick}
    size={32}
    variant="application"
  />
);

CloseButton.defaultProps = {
  className: '',
};

CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;
