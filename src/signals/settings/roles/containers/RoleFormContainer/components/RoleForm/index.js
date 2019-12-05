import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Label as FieldLabel,
  Checkbox,
  themeSpacing,
} from '@datapunt/asc-ui';

import Input from 'components/Input';
import FormFooter from 'components/FormFooter';

import { ROLES_URL } from 'signals/settings/routes';

const Label = styled(FieldLabel)`
  display: block;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-bottom: ${themeSpacing(3)};
`;

const StyledInput = styled(Input)`
  margin-bottom: ${themeSpacing(8)};
`;

export const RoleForm = ({
  role,
  permissions,
  onPatchRole,
  onSaveRole,
}) => {
  const [name, setName] = useState('');
  const history = useHistory();
  const isValid = name !== '';

  useEffect(() => {
    /* istanbul ignore else */
    if (role.id) {
      setName(role.name);
    }
  }, [role.id, role.name]);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

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
        ...updatedRole,
      });
    } else {
      onSaveRole(updatedRole);
    }
  }, [isValid, onPatchRole, onSaveRole, permissions, role.id]);

  const handleCancel = useCallback(() => {
    history.push(ROLES_URL);
  }, [history]);

  const handleChangeName = useCallback(e => {
    setName(e.target.value);
  }, [setName]);

  return (
    <div data-testid="rolesForm">
      <form
        onSubmit={handleSubmit}
      >
        <StyledInput
          label="Naam"
          name="name"
          type="text"
          error={isValid ? '' : 'Dit veld is verplicht'}
          id={`role${role.id}`}
          data-testid="rolesFormFieldName"
          onBlur={handleChangeName}
          defaultValue={role.name}
        />

        <Label label="Rechten" />
        {permissions.map(permission => (
          <div key={permission.id}>
            <FieldLabel htmlFor={`permission${permission.id}`} label={permission.name}>
              <Checkbox id={`permission${permission.id}`} checked={role.permissions.find(item => item.id === permission.id)} />
            </FieldLabel>
          </div>))}

        <FormFooter
          onSubmitForm={() => { }}
          submitBtnLabel="Opslaan"
          onCancel={handleCancel}
          cancelBtnLabel="Annuleer"
        />
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
    name: PropTypes.string,
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
