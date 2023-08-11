// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useReducer, useCallback } from 'react'

import { themeSpacing, Row, Column } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import CheckboxList from 'components/CheckboxList'
import FormFooter from 'components/FormFooter'
import History from 'components/History'
import Input from 'components/Input'
import Label from 'components/Label'
import RadioButtonList from 'components/RadioButtonList'
import TextArea from 'components/TextArea'
import { makeSelectDepartments } from 'models/departments/selectors'
import {
  rolesModelSelector,
  inputCheckboxRolesSelector,
} from 'models/roles/selectors'
import configuration from 'shared/services/configuration/configuration'
import { userType, historyType } from 'shared/types'

const Form = styled.form`
  width: 100%;
`

const StyledColumn = styled(Column).attrs({
  span: { small: 12, medium: 12, big: 12, large: 5, xLarge: 5 },
})`
  contain: content;
  flex-direction: column;
`

const FieldGroup = styled.div`
  @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
    margin-top: ${themeSpacing(8)};
  }

  & + & {
    margin-top: ${themeSpacing(8)};
  }
`

const StyledFormFooter = styled(FormFooter)`
  position: fixed;
`

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
]

const StyledHistory = styled(History)`
  h2 {
    font-size: 1rem;
  }
`

const DEFAULT_STATUS_OPTION = 'true'

const reducer = (state, { field, value }) => ({ ...state, [field]: value })

const UserForm = ({ data, history, onCancel, onSubmit, readOnly }) => {
  const inputRoles = useSelector(inputCheckboxRolesSelector)
  const roles = useSelector(rolesModelSelector).list
  const departments = useSelector(makeSelectDepartments)
  const departmentList = departments.list.map(({ id, name }) => ({
    id: String(id),
    value: name,
  }))

  const userDepartments =
    data?.profile?.departments
      ?.map((department) =>
        departmentList.find(({ value }) => value === department)
      )
      .filter(Boolean) || []

  const userRoles =
    data?.roles
      ?.map((role) => inputRoles.find(({ name }) => name === role.name))
      .filter(Boolean) || []

  const notificationOptions = [
    ...(configuration.featureFlags.assignSignalToDepartment
      ? [
          {
            key: 'notification_on_department_assignment',
            value:
              'Stuur mij een e-mail als een melding aan mijn afdeling is gekoppeld',
          },
        ]
      : []),
    ...(configuration.featureFlags.assignSignalToEmployee
      ? [
          {
            key: 'notification_on_user_assignment',
            value: 'Stuur mij een e-mail als een melding aan mij is toegewezen',
          },
        ]
      : []),
  ]

  const userNotifications =
    notificationOptions.filter(
      (notificationOption) => data?.profile?.[notificationOption.key]
    ) || []

  const [state, dispatch] = useReducer(reducer, {
    username: data.username || '',
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    note: data.profile && data.profile.note,
    is_active:
      data.is_active === undefined
        ? DEFAULT_STATUS_OPTION
        : `${data.is_active}`,
    departments: userDepartments,
    roles: userRoles,
    notifications: userNotifications,
  })

  const onChange = useCallback(
    (field, value) => {
      dispatch({ field, value })
    },
    [dispatch]
  )

  const onChangeEvent = useCallback(
    (event) => {
      onChange(event.target.name, event.target.value)
    },
    [onChange]
  )

  const getFormData = useCallback(() => {
    const form = { ...data, profile: { ...data.profile } }

    form.username = state.username
    form.first_name = state.first_name
    form.last_name = state.last_name
    form.is_active = state.is_active === 'true'
    form.profile.note = state.note
    form.profile.departments = state.departments.map(({ value }) => value)

    const enabledNotifications = state.notifications.map(({ key }) => key)
    form.profile.notification_on_department_assignment =
      enabledNotifications.includes('notification_on_department_assignment')
    form.profile.notification_on_user_assignment =
      enabledNotifications.includes('notification_on_user_assignment')

    form.roles = state.roles.map(({ name: stateRoleName }) =>
      roles.find(({ name: dataRoleName }) => dataRoleName === stateRoleName)
    )

    const postPatch = { ...form, profile: { ...form.profile } }

    delete postPatch.profile.departments
    postPatch.profile.department_ids = Object.values(state.departments).map(
      ({ id }) => id
    )

    delete postPatch.roles
    postPatch.role_ids = Object.values(state.roles).map(({ key }) => key)

    return { form, postPatch }
  }, [data, roles, state])

  const onSubmitForm = useCallback(
    (event) => {
      event.preventDefault()
      onSubmit(getFormData())
    },
    [getFormData, onSubmit]
  )

  const onCancelForm = useCallback(
    (event) => {
      event.preventDefault()
      onCancel(getFormData())
    },
    [getFormData, onCancel]
  )

  return (
    <Form action="" data-testid="detail-user-form">
      <Row>
        <StyledColumn>
          <div>
            <FieldGroup>
              <Input
                disabled={data.username !== undefined || readOnly}
                id="username"
                label="E-mailadres"
                name="username"
                onChange={onChangeEvent}
                readOnly={readOnly}
                type="text"
                value={state.username}
              />
            </FieldGroup>

            <FieldGroup>
              <Input
                disabled={readOnly}
                id="first_name"
                label="Voornaam"
                name="first_name"
                onChange={onChangeEvent}
                type="text"
                value={state.first_name}
              />
            </FieldGroup>

            <FieldGroup>
              <Input
                disabled={readOnly}
                id="last_name"
                label="Achternaam"
                name="last_name"
                onChange={onChangeEvent}
                type="text"
                value={state.last_name}
              />
            </FieldGroup>

            {(configuration.featureFlags.assignSignalToDepartment ||
              configuration.featureFlags.assignSignalToEmployee) && (
              <FieldGroup>
                <Label as="span">Notificatie</Label>
                <CheckboxList
                  defaultValue={state.notifications}
                  disabled={readOnly}
                  groupName="notifications"
                  name="notifications"
                  options={notificationOptions}
                  onChange={(field, value) => {
                    onChange(field, value)
                  }}
                />
              </FieldGroup>
            )}

            <FieldGroup>
              <Label as="span">Status</Label>
              <RadioButtonList
                defaultValue={state.is_active}
                groupName="is_active"
                hasEmptySelectionButton={false}
                options={statusOptions}
                disabled={readOnly}
                onChange={(field, { key: value }) => {
                  onChange(field, value)
                }}
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
                onChange={(field, value) => {
                  onChange(field, value)
                }}
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
                onChange={(field, value) => {
                  onChange(field, value)
                }}
              />
            </FieldGroup>
          </div>
        </StyledColumn>

        <StyledColumn
          push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
        >
          <div>
            <FieldGroup>
              <Label as="span" htmlFor="note">
                Notitie
              </Label>
              <TextArea
                disabled={readOnly}
                value={state.note}
                id="note"
                name="note"
                rows="8"
                onChange={onChangeEvent}
              />
            </FieldGroup>

            <FieldGroup>
              {history && <StyledHistory list={history} />}
            </FieldGroup>
          </div>
        </StyledColumn>

        {!readOnly && (
          <StyledFormFooter
            cancelBtnLabel="Annuleer"
            onCancel={onCancelForm}
            submitBtnLabel="Opslaan"
            onSubmitForm={onSubmitForm}
          />
        )}
      </Row>
    </Form>
  )
}

UserForm.defaultProps = {
  data: {},
  onCancel: null,
  onSubmit: null,
  readOnly: false,
}

UserForm.propTypes = {
  data: userType,
  history: historyType,
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
}

export default UserForm
