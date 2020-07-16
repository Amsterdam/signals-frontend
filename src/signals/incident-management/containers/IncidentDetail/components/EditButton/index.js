import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';

import IconEdit from '../../../../../../shared/images/icon-edit.svg';

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`;

const EditButton = ({ className, disabled, onClick, ...rest }) => (
  <StyledButton
    className={className}
    data-testid={rest['data-testid'] || 'editButton'}
    disabled={disabled}
    icon={<IconEdit />}
    iconSize={18}
    onClick={onClick}
    variant="application"
  />
);

EditButton.defaultProps = {
  className: '',
  disabled: false,
};

EditButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default EditButton;
