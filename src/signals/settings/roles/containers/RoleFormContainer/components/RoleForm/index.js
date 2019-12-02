import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Label as FieldLabel,
  Checkbox,
  Button,
  themeSpacing,
} from '@datapunt/asc-ui';

import Input from 'components/Input';

import { ROLES_URL } from '../../../../../routes';

const Label = styled(FieldLabel)`
  display: block;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-bottom: ${themeSpacing(3)};
`;

const StyledInput = styled(Input)`
  margin-bottom: ${themeSpacing(8)};
`;

const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
  margin-right: ${themeSpacing(2)};
`;

export const RoleForm = ({
  role,
  permissions,
  onPatchRole,
  onSaveRole,
}) => {
  const [name, setName] = useState('');
  const history = useHistory();

  useEffect(() => {
    /* istanbul ignore else */
    if (role.id) {
      setName(role.name);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const elements = e.target.elements;
    const permission_ids = [];
    permissions.forEach(permission => {
      if (elements[`permission${permission.id}`].checked) {
        permission_ids.push(permission.id);
      }
    });

    const updatedRole = {
      name: elements.name.value,
      permission_ids,
    };

    if (role.id) {
      onPatchRole({
        id: role.id,
        patch: {
          ...updatedRole,
          id: role.id,
        },
      });
    } else {
      onSaveRole(updatedRole);
    }
  }

  const handleCancel = () => {
    history.push(ROLES_URL);
  };

  const handleChangeName = e => {
    setName(e.target.value);
  }

  return (
    <div data-testid="rolesForm">
      <form
        data-testid="rolesFormForm"
        onSubmit={handleSubmit}
      >
        <StyledInput
          label="Naam"
          name="name"
          type="text"
          id={`role${role.id}`}
          data-testid="rolesFormFieldName"
          onChange={handleChangeName}
          placeholder="Rolnaam"
          defaultValue={role.name}
        />

        <Label label="Rechten" />
        {permissions.map(permission => (
          <div key={permission.id}>
            <FieldLabel htmlFor={`permission${permission.id}`} label={permission.name}>
              <Checkbox id={`permission${permission.id}`} checked={role.permissions.find(item => item.id === permission.id)} />
            </FieldLabel>
          </div>))}

        <div>
          <StyledButton
            variant="secondary"
            data-testid="rolesFormButtonSubmit"
            type="submit"
            disabled={name === ''}
          >
            Opslaan
          </StyledButton>

          <StyledButton
            variant="tertiary"
            data-testid="rolesFormButtonCancel"
            type="button"
            onClick={handleCancel}
          >
            Annuleren
          </StyledButton>
        </div>
      </form>
    </div >
  )
};

RoleForm.defaultProps = {
  role: {
    name: '',
    permissions: [],
  },
};

RoleForm.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,

  onPatchRole: PropTypes.func.isRequired,
  onSaveRole: PropTypes.func.isRequired,
};

export default RoleForm;
