// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ChevronLeft } from '@amsterdam/asc-assets'
import { themeColor } from '@amsterdam/asc-ui'

import Button from 'components/Button'

const StyledButton = styled(Button)`
  height: 44px;
  align-self: auto;
`

const Chevron = styled(ChevronLeft)`
  fill: ${themeColor('primary')};
`

const PreviousButton = ({ className, children, onClick }) => (
  <StyledButton
    className={className}
    data-testid="previousButton"
    iconLeft={<Chevron aria-hidden="true" />}
    iconSize={14}
    onClick={onClick}
    type="button"
    variant="textButton"
  >
    {children}
  </StyledButton>
)

PreviousButton.defaultProps = {
  className: '',
}

PreviousButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
}

export default PreviousButton
