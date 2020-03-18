import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { themeSpacing, Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { makeSelectDepartments } from 'models/departments/selectors';
import RadioButtonList from 'signals/incident-management/components/RadioButtonList';
import CheckboxList from 'signals/incident-management/components/CheckboxList';

import Input from 'components/Input';
import Label from 'components/Label';
import TextArea from 'components/TextArea';
import FormFooter from 'components/FormFooter';

const Form = styled.form`
  width: 100%;
`;

const StyledColumn = styled(Column).attrs({
  span: { small: 12, medium: 12, big: 12, large: 5, xLarge: 5 },
})`
  flex-direction: column;
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

const UserForm = ({ data, onCancel, onSubmitForm, readOnly }) => {
  const departments = useSelector(makeSelectDepartments);
  const departmentList = departments.list.map(({ id, name }) => ({ id, value: name }));
  const userDepartments = data?.profile?.departments
    .map(department => departmentList.find(({ value }) => value === department))
    .filter(Boolean) || [];

  return (
    <Form action="" data-testid="detailUserForm">
      <Row>
        <StyledColumn>
          <FieldGroup>
            <Input
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
              defaultValue={data.is_active === undefined ? DEFAULT_STATUS_OPTION : `${data.is_active}`}
              groupName="is_active"
              hasEmptySelectionButton={false}
              options={statusOptions}
              disabled={readOnly}
            />
          </FieldGroup>

          <FieldGroup>
            <Label as="span">Afdeling</Label>
            <CheckboxList
              defaultValue={userDepartments}
              groupName="departments"
              name="department"
              options={departmentList}
              disabled={readOnly}
            />
          </FieldGroup>
        </StyledColumn>

        <StyledColumn push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}>
          <FieldGroup>
            <Label as="span">Notitie</Label>
            <TextArea id="note" name="note" rows="8" defaultValue={data.profile && data.profile.note} />
          </FieldGroup>
        </StyledColumn>

        <Column span={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }} />

        {!readOnly && (
          <StyledFormFooter
            cancelBtnLabel="Annuleren"
            onCancel={onCancel}
            submitBtnLabel="Opslaan"
            onSubmitForm={onSubmitForm}
          />
        )}
      </Row>
    </Form>
  );
};

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
    profile: PropTypes.shape({
      departments: PropTypes.arrayOf(PropTypes.string),
      note: PropTypes.string,
    }),
  }),
  onCancel: PropTypes.func,
  onSubmitForm: PropTypes.func,
  /** When true, none of the fields in the form can be edited */
  readOnly: PropTypes.bool,
};

export default UserForm;
