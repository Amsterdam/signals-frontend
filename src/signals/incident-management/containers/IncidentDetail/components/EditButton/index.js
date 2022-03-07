// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing, Button } from '@amsterdam/asc-ui'

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`

const EditIcon = styled.img`
  ${({ disabled }) => (disabled ? 'filter: invert(0.5);' : '')};
`

const EditButton = ({ className, disabled, onClick, ...rest }) => (
  <StyledButton
    className={className}
    data-testid={rest['data-testid'] || 'editButton'}
    disabled={disabled}
    icon={
      <EditIcon
        disabled={disabled}
        src="/assets/images/icon-edit.svg"
        alt="Bewerken"
      />
    }
    iconSize={18}
    onClick={onClick}
    variant="application"
  />
)

EditButton.defaultProps = {
  className: '',
  disabled: false,
}

EditButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default EditButton
