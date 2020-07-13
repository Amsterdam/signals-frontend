import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from 'components/Button';

const StyledButton = styled(Button)`
  margin-right: 15px !important;
`;

const NextButton = ({ className, children, onClick }) => (
  <StyledButton
    className={className}
    data-testid="nextButton"
    onClick={onClick}
    taskflow
    type="submit"
    variant="secondary"
  >
    {children}
  </StyledButton>
);

NextButton.defaultProps = {
  className: '',
};

NextButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default NextButton;
