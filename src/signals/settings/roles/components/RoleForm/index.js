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

import PageHeader from 'signals/settings/components/PageHeader';
import Input from 'components/Input';

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
}) => {
  const [name, setName] = useState('');
  const history = useHistory();

  useEffect(() => {
    /* istanbul ignore else */
    if (role) {
      setName(role.name);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const permission_ids = [];
    permissions.forEach(permission => {
      if (e.target.elements[`permission${permission.id}`].checked) {
        permission_ids.push(permission.id);
      }
    });

    const payload = {
      id: role.id,
      patch: {
        id: role.id,
        name: e.target.elements.name.value,
        permission_ids,
      },
    };

    onPatchRole(payload);
    history.push('/instellingen/rollen');
  }

  const handleCancel = () => {
    history.push('/instellingen/rollen');
  };

  const handleChangeName = e => {
    setName(e.target.value);
  }

  return (
    <div data-testid="rolesForm">
      <PageHeader title="Rol instellingen" />

      {role &&
        (
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
        )
      }
    </div >
  )
};

RoleForm.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number.isRequired,
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
};

export default RoleForm;
