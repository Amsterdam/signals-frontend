import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label as FieldLabel, Button, themeSpacing } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import Input from 'components/Input';

export const Label = styled(FieldLabel)`
  display: block;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  margin-bottom: ${themeSpacing(3)};
  `;

export const RolesForm = ({
  id,
  list,
  permissions,
}) => {
  const role = list.find(item => item.id === id * 1);

  const handleSubmit = e => {
    e.preventDefault();
    console.log('handleSubmit', e.currentTarget);
  }

  return (
    <div>
      <PageHeader title="Rol instellingen" />

      {role &&
        (
          <form
            onSubmit={handleSubmit}
          >

            <Input name="name" type="text" defaultValue={role.name} label="Naam" />

            <Label label="Rechten" />
            {permissions.map(permission =>
              <div key={permission.id} className="antwoord">
                <input
                  name={permission.codename}
                  id={permission.codename}
                  type="checkbox"
                  checked={role.permissions.find(item => item.id === permission.id)}
                />
                <label htmlFor={permission.codename}>{permission._display}</label>
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
