import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { themeSpacing, Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { userType } from 'shared/types';

import { rolesModelSelector, inputCheckboxRolesSelector } from 'models/roles/selectors';

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

const reducer = (state, { field, value }) => ({ ...state, [field]: value });

const UserForm = ({ data, onCancel, onSubmit, readOnly }) => {
  const inputRoles = useSelector(inputCheckboxRolesSelector);
  const roles = useSelector(rolesModelSelector).list;

  const departments = useSelector(makeSelectDepartments);
  const departmentList = departments.list.map(({ id, name }) => ({ id: String(id), value: name }));

  const userDepartments = data
    ?.profile
    ?.departments
    ?.map(department => departmentList.find(({ value }) => value === department))
    .filter(Boolean) || [];

  const userRoles = data
    ?.roles
    ?.map(role => inputRoles.find(({ name }) => name === role.name))
    .filter(Boolean) || [];

  const [state, dispatch] = React.useReducer(reducer, {
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    note: data.profile && data.profile.note,
    is_active: data.is_active === undefined ? DEFAULT_STATUS_OPTION : `${data.is_active}`,
    departments: userDepartments,
    roles: userRoles,
  });

  const onChangeEvent = useCallback(event => {
    onChange(event.target.name, event.target.value);
  }, [onChange]);

  const onChange = useCallback((field, value) => {
    dispatch({ field, value });
  }, [dispatch]);

  const getFormData = useCallback(() => {
    const form = { ...data, profile: { ...data.profile } };

    form.username = state.username;
    form.first_name = state.first_name;
    form.last_name = state.last_name;
    form.is_active = state.is_active === 'true';
    form.profile.note = state.note;
    form.profile.departments = state.departments.map(({ value }) => value);

    form.roles = state.roles.map(({ name: stateRoleName }) =>
      roles.filter(({ name: dataRoleName }) => dataRoleName === stateRoleName)[0]
    );

    const postPatch = { ...form, profile: { ...form.profile } };

    delete postPatch.profile.departments;
    postPatch.profile.department_ids = Object.values(state.departments).map(({ id }) => id);

    delete postPatch.roles;
    postPatch.role_ids = Object.values(state.roles).map(({ key }) => key);

    return { form, postPatch };
  }, [data, roles, state]);

  const onSubmitForm = useCallback(event => {
    event.preventDefault();
    onSubmit(getFormData());
  }, [getFormData, onSubmit]);

  const onCancelForm = useCallback(event => {
    event.preventDefault();
    onCancel(getFormData());
  }, [getFormData, onCancel]);

  return (
    <Form action="" data-testid="detailUserForm">
      <Row>
        <StyledColumn>
          <FieldGroup>
            <Input
              value={state.username}
              id="username"
              name="username"
              label="E-mailadres"
              disabled={data.username !== undefined || readOnly}
              readOnly={readOnly}
              onChange={onChangeEvent}
            />
          </FieldGroup>

          <FieldGroup>
            <Input
              value={state.first_name}
              id="first_name"
              name="first_name"
              label="Voornaam"
              disabled={readOnly}
              onChange={onChangeEvent}
            />
          </FieldGroup>

          <FieldGroup>
            <Input
              value={state.last_name}
              id="last_name"
              name="last_name"
              label="Achternaam"
              disabled={readOnly}
              onChange={onChangeEvent}
            />
          </FieldGroup>

          <FieldGroup>
            <Label as="span">Status</Label>
            <RadioButtonList
              defaultValue={state.is_active}
              groupName="is_active"
              hasEmptySelectionButton={false}
              options={statusOptions}
              disabled={readOnly}
              onChange={(field, { key: value }) => { onChange(field, value); }}
            />
          </FieldGroup>

          <FieldGroup>
            <Label as="span">Rollen</Label>
            <CheckboxList
              defaultValue={state.roles}
              disabled={readOnly}
              groupName="roles"
              name="roles"
              options={inputRoles}
              onChange={(field, value) => { onChange(field, value); }}
            />
          </FieldGroup>

          <FieldGroup>
            <Label as="span">Afdeling</Label>
            <CheckboxList
              defaultValue={state.departments}
              disabled={readOnly}
              groupName="departments"
              name="departments"
              options={departmentList}
              onChange={(field, value) => { onChange(field, value); }}
            />
          </FieldGroup>
        </StyledColumn>

        <StyledColumn push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}>
          <FieldGroup>
            <Label as="span">Notitie</Label>
            <TextArea
              disabled={readOnly}
              value={state.note}
              id="note"
              name="note"
              rows="8"
              onChange={onChangeEvent}
            />
          </FieldGroup>
        </StyledColumn>

        <Column span={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }} />

        {!readOnly && (
          <StyledFormFooter
            cancelBtnLabel="Annuleren"
            onCancel={onCancelForm}
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
  onSubmit: null,
  readOnly: false,
};

UserForm.propTypes = {
  data: userType,
  /**
   * Callback handler called whenever form is canceled
   * @param {Object} form data
   * @param {Object.form} current form data (used for comparing form changes)
   * @param {Object.postPatch} modified form data for post/patch requests
   */
  onCancel: PropTypes.func,
  /**
   * Callback handler called whenever form is submitted
   * @param {Object} form data
   * @param {Object.form} current form data (used for comparing form changes)
   * @param {Object.postPatch} modified form data for post/patch requests
   */
  onSubmit: PropTypes.func,
  /** When true, none of the fields in the form can be edited */
  readOnly: PropTypes.bool,
};

export default UserForm;
