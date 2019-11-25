import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';

import UserForm from '..';


describe('signals/settings/users/containers/Detail/components/UserForm', () => {
  it('should render the correct fields', () => {
    const { container } = render(withAppContext(<UserForm />));

    expect(container.querySelector('[name="first_name"]')).toBeInTheDocument();
    expect(container.querySelector('[name="first_name"]').value).toBe('');
    expect(container.querySelector('[name="last_name"]')).toBeInTheDocument();
    expect(container.querySelector('[name="last_name"]').value).toBe('');
    expect(container.querySelector('[name="username"]')).toBeInTheDocument();
    expect(container.querySelector('[name="username"]').value).toBe('');

    expect(container.querySelectorAll('[name="is_active"]')).toHaveLength(2);
    expect(container.querySelectorAll('[name="is_active"]')[0].value).toBe('true');
    expect(container.querySelectorAll('[name="is_active"]')[0].checked).toBe(false);
    expect(container.querySelectorAll('[name="is_active"]')[1].value).toBe('false');
    expect(container.querySelectorAll('[name="is_active"]')[1].checked).toBe(false);
  });

  it('should set field values', () => {
    const data = {
      first_name: 'Foo',
      last_name: 'Bar',
      username: 'foo@bar',
      is_active: true,
    };

    const { container } = render(withAppContext(<UserForm data={data} />));

    expect(container.querySelector('[name="first_name"]').value).toBe(data.first_name);
    expect(container.querySelector('[name="last_name"]').value).toBe(data.last_name);
    expect(container.querySelector('[name="username"]').value).toBe(data.username);
    expect(container.querySelector('[name="is_active"][value="true"]').checked).toBe(true);
    expect(container.querySelector('[name="is_active"][value="false"]').checked).toBe(false);
  });

  it('should call onCancel callback', () => {
    const onCancel = jest.fn();

    const { getByTestId } = render(withAppContext(<UserForm onCancel={onCancel} />));

    fireEvent.click(getByTestId('cancelBtn'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit callback', () => {
    const onSubmit = jest.fn();

    // using enzyme instead of @testing-library; JSDOM hasn't implemented for submit callback and will show a warning
    // when a form's submit() handler is called or when the submit button receives a click event
    const tree = mount(withAppContext(<UserForm onSubmitForm={onSubmit} />));

    tree.find('button[type="submit"]').simulate('click');

    expect(onSubmit).toHaveBeenCalled();
  });
});
