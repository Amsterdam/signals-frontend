import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import * as modelSelectors from 'models/departments/selectors';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';

import UserForm from '..';

const departments = {
  ...departmentsJson,
  count: departmentsJson.count,
  list: departmentsJson.results,
  results: undefined,
};

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => departments);

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

    expect(container.querySelectorAll('[name="departments"]')).toHaveLength(18);
    expect(container.querySelectorAll('[name="departments"]')[7].checked).toBe(false);
  });

  it('should make fields disabled', () => {
    const { container, rerender, queryByText } = render(withAppContext(<UserForm />));
    // const numFields = container.querySelectorAll('input').length;

    expect(container.querySelectorAll('[disabled]')).toHaveLength(0);
    expect(queryByText('Opslaan')).toBeInTheDocument();

    rerender(withAppContext(<UserForm readOnly />));

    // explicitly setting the number of fields, instead of using numFields
    // tackling that at a later time when user detail page has been refactored
    expect(container.querySelectorAll('[disabled]')).toHaveLength(5);
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
    expect(container.querySelectorAll('[name="departments"]')[0].checked).toBe(true);
    expect(container.querySelectorAll('[name="departments"]')[7].checked).toBe(false);
  });

  it('should call onCancel callback', () => {
    const onCancel = jest.fn();

    const { getByTestId } = render(withAppContext(<UserForm onCancel={onCancel} />));

    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('cancelBtn'));

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

    fireEvent.click(radio2);

    expect(radio1.checked).toBe(false);
    expect(radio2.value).toBe('false');
    expect(radio2.checked).toBe(true);
  });

  it('should check an unchecked checkbox', () => {
    const { getByLabelText } = render(withAppContext(<UserForm />));

    const checkbox = getByLabelText('Actie Service Centrum');

    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
