import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';

import departmentsJson from 'utils/__tests__/fixtures/departments.json';
import inputCheckboxRolesSelectorJson from
  'utils/__tests__/fixtures/inputCheckboxRolesSelector.json';

import * as modelSelectors from 'models/departments/selectors';
import * as rolesSelectors from 'models/roles/selectors';

import UserForm from '..';

const departments = {
  ...departmentsJson,
  list: departmentsJson.results,
  results: undefined,
};

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

jest.mock('models/roles/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/roles/selectors'),
}));

jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => departments);

jest.spyOn(rolesSelectors, 'inputCheckboxRolesSelector').mockImplementation(() => inputCheckboxRolesSelectorJson);

describe('signals/settings/users/containers/Detail/components/UserForm', () => {
  it('should render the correct fields', () => {
    const { container } = render(withAppContext(<UserForm />));

    expect(container.querySelector('[name="first_name"]')).toBeInTheDocument();
    expect(container.querySelector('[name="first_name"]').value).toBe('');
    expect(container.querySelector('[name="last_name"]')).toBeInTheDocument();
    expect(container.querySelector('[name="last_name"]').value).toBe('');
    expect(container.querySelector('[name="username"]')).toBeInTheDocument();
    expect(container.querySelector('[name="username"]').value).toBe('');
    expect(container.querySelector('[name="note"]').value).toBe('');

    expect(container.querySelectorAll('[name="is_active"]')).toHaveLength(2);
    expect(container.querySelectorAll('[name="is_active"]')[0].value).toBe('true');
    expect(container.querySelectorAll('[name="is_active"]')[0].checked).toBe(true);
    expect(container.querySelectorAll('[name="is_active"]')[1].value).toBe('false');
    expect(container.querySelectorAll('[name="is_active"]')[1].checked).toBe(false);

    expect(container.querySelectorAll('[name="departments"]')).toHaveLength(departmentsJson.count);

    const uncheckedDepartmentIndex = departmentsJson.results.indexOf(
      departmentsJson.results.find(({ name }) => name === 'Port of Amsterdam')
    );

    expect(container.querySelectorAll('[name="departments"]')[uncheckedDepartmentIndex].checked)
      .toBe(false);

    expect(container.querySelectorAll('[name="roles"]'))
      .toHaveLength(inputCheckboxRolesSelectorJson.length);

    const uncheckedRoleIndex = inputCheckboxRolesSelectorJson.indexOf(
      inputCheckboxRolesSelectorJson.find(({ name }) => name === 'Behandelaar')
    );

    expect(container.querySelectorAll('[name="roles"]')[uncheckedRoleIndex].checked).toBe(false);
  });

  it('should check all role checkboxes and submit them', () => {
    jest.useFakeTimers();

    const onSubmit = jest.fn();

    const { container, getByTestId } = render(withAppContext(<UserForm onSubmit={onSubmit} />));

    expect(container.querySelectorAll('[name="roles"]'))
      .toHaveLength(inputCheckboxRolesSelectorJson.length);

    const uncheckedRoleIndex = inputCheckboxRolesSelectorJson.indexOf(
      inputCheckboxRolesSelectorJson.find(({ name }) => name === 'Behandelaar')
    );

    expect(container.querySelectorAll('[name="roles"]')[uncheckedRoleIndex].checked).toBe(false);

    container.querySelectorAll('[name="roles"]').forEach(checkbox => {
      act(() => { fireEvent.click(checkbox); });
      act(() => { jest.runOnlyPendingTimers(); });
    });

    expect(container.querySelectorAll('input[type="checkbox"]:checked'))
      .toHaveLength(inputCheckboxRolesSelectorJson.length);

    expect(onSubmit).not.toHaveBeenCalled();

    act(() => { fireEvent.click(getByTestId('submitBtn')); });

    const submittedRoleIds = onSubmit.mock.calls[0][0].postPatch.role_ids;
    expect(submittedRoleIds).toHaveLength(inputCheckboxRolesSelectorJson.length);
  });

  it('should make fields disabled', () => {
    const { container, rerender, queryByText } = render(withAppContext(<UserForm />));

    expect(container.querySelectorAll('[disabled]')).toHaveLength(0);
    expect(queryByText('Opslaan')).toBeInTheDocument();

    rerender(withAppContext(<UserForm readOnly />));

    // explicitly setting the number of fields, instead of using numFields
    // tackling that at a later time when user detail page has been refactored
    expect(container.querySelectorAll('input[disabled]')).toHaveLength(5);
    expect(queryByText('Opslaan')).not.toBeInTheDocument();
  });

  it('should set field values', () => {
    const data = {
      first_name: 'Foo',
      last_name: 'Bar',
      username: 'foo@bar',
      is_active: true,
      profile: {
        note: 'abc',
        departments: ['Actie Service Centrum', 'Afval en Grondstoffen', 'CCA', 'FB'],
      },
    };

    const { container } = render(withAppContext(<UserForm data={data} />));

    expect(container.querySelector('[name="first_name"]').value).toBe(data.first_name);
    expect(container.querySelector('[name="last_name"]').value).toBe(data.last_name);
    expect(container.querySelector('[name="username"]').value).toBe(data.username);
    expect(container.querySelector('[name="is_active"][value="true"]').checked).toBe(true);
    expect(container.querySelector('[name="is_active"][value="false"]').checked).toBe(false);
    expect(container.querySelector('[name="note"]').value).toBe(data.profile.note);

    const checkedDepartmentIndex = departmentsJson.results.indexOf(
      departmentsJson.results.find(({ name }) => name === 'Actie Service Centrum')
    );
    expect(container.querySelectorAll('[name="departments"]')[checkedDepartmentIndex].checked).toBe(true);

    const uncheckedDepartmentIndex = departmentsJson.results.indexOf(
      departmentsJson.results.find(({ name }) => name === 'Port of Amsterdam')
    );
    expect(container.querySelectorAll('[name="departments"]')[uncheckedDepartmentIndex].checked).toBe(false);
  });

  it('should call onCancel callback', () => {
    const onCancel = jest.fn();

    const { getByTestId } = render(withAppContext(<UserForm onCancel={onCancel} />));

    expect(onCancel).not.toHaveBeenCalled();

    act(() => { fireEvent.click(getByTestId('cancelBtn')); });

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit callback', () => {
    const onSubmit = jest.fn();

    // using enzyme instead of @testing-library; JSDOM hasn't implemented for submit callback and will show a warning
    // when a form's submit() handler is called or when the submit button receives a click event
    const tree = mount(withAppContext(<UserForm onSubmit={onSubmit} />));

    expect(onSubmit).not.toHaveBeenCalled();

    tree.find('button[type="submit"]').simulate('click');

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should select the "Niet Actief" radio button', () => {
    const { container } = render(withAppContext(<UserForm />));

    const radio1 = container.querySelectorAll('[name="is_active"]')[0];
    const radio2 = container.querySelectorAll('[name="is_active"]')[1];

    expect(radio1.value).toBe('true');
    expect(radio1.checked).toBe(true);

    act(() => { fireEvent.click(radio2); });

    expect(radio1.checked).toBe(false);
    expect(radio2.value).toBe('false');
    expect(radio2.checked).toBe(true);
  });

  it('should check an unchecked role checkbox', () => {
    jest.useFakeTimers();

    const { getByLabelText } = render(withAppContext(<UserForm />));

    const checkbox = getByLabelText('Regievoerder');

    expect(checkbox.checked).toBe(false);

    act(() => { fireEvent.click(checkbox); });
    act(() => { jest.runOnlyPendingTimers(); });

    expect(checkbox.checked).toBe(true);
  });

  it('should check an unchecked department checkbox', () => {
    jest.useFakeTimers();

    const { getByLabelText } = render(withAppContext(<UserForm />));

    const checkbox = getByLabelText('Actie Service Centrum');

    expect(checkbox.checked).toBe(false);

    act(() => { fireEvent.click(checkbox); });
    act(() => { jest.runOnlyPendingTimers(); });

    expect(checkbox.checked).toBe(true);
  });
});
