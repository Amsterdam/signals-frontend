// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { themeSpacing, Button } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`

const EditButton = ({ className, disabled, onClick, ...rest }) => (
  <StyledButton
    className={className}
    data-testid={rest['data-testid'] || 'editButton'}
    disabled={disabled}
    icon={
      <img
        src={
          disabled
            ? '/assets/images/icon-edit-disabled.svg'
            : '/assets/images/icon-edit.svg'
        }
        alt="Bewerken"
      />
    }
    iconSize={disabled ? 20 : 18}
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
