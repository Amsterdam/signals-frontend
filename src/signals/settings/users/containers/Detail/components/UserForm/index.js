import React from 'react';
import PropTypes from 'prop-types';
import { themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';

import Input from 'components/Input';
import Label from 'components/Label';
import FormFooter from 'components/FormFooter';

const Form = styled.form`
  width: 100%;
`;

const FieldGroup = styled.div`
  & + & {
    margin-top: ${themeSpacing(8)};
  }
`;

const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`;

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
];

const DEFAULT_STATUS_OPTION = 'true';

const UserForm = ({ data, onCancel, onSubmitForm, readOnly }) => (
  <Form action="" data-testid="detailUserForm">
    <FieldGroup>
      <Input
        hint="Vul hier een geldig e-mailadres in"
        defaultValue={data.username}
        id="username"
        name="username"
        label="E-mailadres"
        disabled={data.username !== undefined || readOnly}
        readOnly={readOnly}
      />
    </FieldGroup>

    <FieldGroup>
      <Input
        defaultValue={data.first_name}
        id="first_name"
        name="first_name"
        label="Voornaam"
        disabled={readOnly}
      />
    </FieldGroup>

    <FieldGroup>
      <Input
        defaultValue={data.last_name}
        id="last_name"
        name="last_name"
        label="Achternaam"
        disabled={readOnly}
      />
    </FieldGroup>

    <FieldGroup>
      <Label as="span">Status</Label>
      <RadioButtonList
        defaultValue={
          data.is_active === undefined
            ? DEFAULT_STATUS_OPTION
            : `${data.is_active}`
        }
        groupName="is_active"
        hasEmptySelectionButton={false}
        options={statusOptions}
        disabled={readOnly}
      />
    </FieldGroup>

    {!readOnly && (
      <StyledFormFooter
        cancelBtnLabel="Annuleren"
        onCancel={onCancel}
        submitBtnLabel="Opslaan"
        onSubmitForm={onSubmitForm}
      />
    )}
  </Form>
);

UserForm.defaultProps = {
  data: {},
  onCancel: null,
  onSubmitForm: null,
  readOnly: false,
};

UserForm.propTypes = {
  data: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onCancel: PropTypes.func,
  onSubmitForm: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default UserForm;
