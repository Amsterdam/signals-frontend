import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import CategoryForm from '..';

describe('signals/settings/categories/Detail/components/CategoryForm', () => {
  it('should render the correct fields', () => {
    const { container } = render(withAppContext(<CategoryForm />));

    expect(container.querySelector('[name="name"]')).toBeInTheDocument();
    expect(container.querySelector('[name="name"]').value).toBe('');
    expect(container.querySelector('[name="description"]')).toBeInTheDocument();
    expect(container.querySelector('[name="description"]').value).toBe('');
    expect(container.querySelector('[name="n_days"]')).toBeInTheDocument();
    expect(container.querySelector('[name="n_days"]').value).toBe('');
    expect(container.querySelector('[name="use_calendar_days"]')).toBeInTheDocument();
    expect(container.querySelector('[name="use_calendar_days"]').value).toBe('0');

    expect(container.querySelectorAll('[name="is_active"]')).toHaveLength(2);
    expect(container.querySelectorAll('[name="is_active"]')[0].value).toBe('true');
    expect(container.querySelectorAll('[name="is_active"]')[0].checked).toBe(true);
    expect(container.querySelectorAll('[name="is_active"]')[1].value).toBe('false');
    expect(container.querySelectorAll('[name="is_active"]')[1].checked).toBe(false);
  });

  it('should render category history', () => {
    const { queryByTestId, getByTestId, rerender } = render(withAppContext(<CategoryForm />));

    expect(queryByTestId('history')).not.toBeInTheDocument();

    const history = [
      {
        identifier: 'UPDATE_STATUS_6686',
        when: '2019-07-31T15:10:28.696413+02:00',
        what: 'UPDATE_STATUS',
        action: 'Update status naar: Gesplitst',
        description: 'Deze melding is opgesplitst.',
        who: 'steve@apple.com',
      },
    ];
    rerender(withAppContext(<CategoryForm history={history} />));

    expect(getByTestId('history')).toBeInTheDocument();
  });

  it('should make fields disabled', () => {
    const { container, rerender, queryByText } = render(withAppContext(<CategoryForm />));
    const numFields = container.querySelectorAll('input, textarea, select').length;

    expect(container.querySelectorAll('input[disabled], textarea[disabled], select[disabled]')).toHaveLength(0);
    expect(queryByText('Opslaan')).toBeInTheDocument();

    rerender(withAppContext(<CategoryForm readOnly />));

    expect(container.querySelectorAll('input[disabled], textarea[disabled], select[disabled]')).toHaveLength(numFields);
    expect(queryByText('Opslaan')).not.toBeInTheDocument();
  });

  it('should set field values', () => {
    const data = {
      name: 'Foo',
      description: 'Bar',
      handling_message: 'foo@bar',
      is_active: true,
      sla: {
        n_days: 10,
        use_calendar_days: false,
      },
    };

    const { container, rerender } = render(withAppContext(<CategoryForm data={data} />));

    expect(container.querySelector('[name="name"]').value).toBe(data.name);
    expect(container.querySelector('[name="description"]').value).toBe(data.description);
    expect(container.querySelector('[name="handling_message"]').value).toBe(data.handling_message);
    expect(container.querySelector('[name="n_days"]').value).toBe(`${data.sla.n_days}`);
    expect(container.querySelector('[name="use_calendar_days"]').value).toBe('0');
    expect(container.querySelector('[name="is_active"][value="true"]').checked).toBe(true);
    expect(container.querySelector('[name="is_active"][value="false"]').checked).toBe(false);

    cleanup();

    rerender(withAppContext(<CategoryForm data={{ ...data, sla: { n_days: 10, use_calendar_days: true } }} />));

    expect(container.querySelector('[name="use_calendar_days"]').value).toBe('1');
  });

  it('should call onCancel callback', () => {
    const onCancel = jest.fn();

    const { getByTestId } = render(withAppContext(<CategoryForm onCancel={onCancel} />));

    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('cancelBtn'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit callback', () => {
    const onSubmit = jest.fn();

    // using enzyme instead of @testing-library; JSDOM hasn't implemented for submit callback and will show a warning
    // when a form's submit() handler is called or when the submit button receives a click event
    const tree = mount(withAppContext(<CategoryForm onSubmitForm={onSubmit} />));

    expect(onSubmit).not.toHaveBeenCalled();

    tree.find('button[type="submit"]').simulate('click');

    expect(onSubmit).toHaveBeenCalled();
  });
});
