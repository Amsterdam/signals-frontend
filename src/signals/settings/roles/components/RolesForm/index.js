import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Label as FieldLabel,
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
  margin-bottom: ${themeSpacing(6)};
`;

export const RolesForm = ({
  id,
  list,
  permissions,
}) => {
  const role = list.find(item => item.id === id * 1);

  const handleSubmit = e => {
    e.preventDefault();
    const patch = {
      name: e.target.elements.name.value,
      permissions: [],
    };

    permissions.forEach(permission => {
      if (e.target.elements[`permission${permission.id}`].checked) {
        patch.permissions.push(permission.id);
      }
    });

    console.log('handleSubmit patch', patch);
  }

  return (
    <div>
      <PageHeader title="Rol instellingen" />

      {role &&
        (
          <form
            onSubmit={handleSubmit}
          >

            <StyledInput
              label="Naam"
              name="name"
              type="text"
              defaultValue={role.name}
            />

            <Label label="Rechten" />
            {permissions.map(permission =>
              <div key={permission.id} className="antwoord">
                <input
                  name={`permission${permission.id}`}
                  id={`permission${permission.id}`}
                  type="checkbox"
                  defaultChecked={role.permissions.find(item => item.id === permission.id)}
                />
                <label htmlFor={`permission${permission.id}`}>{permission._display}</label>
              </div>)}

            <div>
              <Button
                variant="secondary"
                type="submit"
              >
                Opslaan
              </Button>

              <Button
                variant="tertiary"
                type="button"
              >
                Annuleren
              </Button>
            </div>
          </form>

        )
      }

    </div>
  )
};

RolesForm.defaultProps = {
  list: [],
  permissions: [],
};

RolesForm.propTypes = {
  id: PropTypes.string.isRequired,
  list: PropTypes.array,
  permissions: PropTypes.array,
};

export default RolesForm;
