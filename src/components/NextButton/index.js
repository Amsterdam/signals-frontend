// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from 'components/Button'

const StyledButton = styled(Button)`
  margin-right: 15px !important;
`

const NextButton = ({ className, children, onClick }) => (
  <StyledButton
    className={className}
    data-testid="next-button"
    onClick={onClick}
    taskflow
    type="submit"
    variant="secondary"
  >
    {children}
  </StyledButton>
)

NextButton.defaultProps = {
  className: '',
}

NextButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
}

export default NextButton
