import React from 'react';
import { mount } from 'enzyme';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const { rerender } = render(withAppContext(<CategoryForm />));

    expect(screen.queryByTestId('history')).not.toBeInTheDocument();

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

    expect(screen.getByTestId('history')).toBeInTheDocument();
  });

  it('should make fields disabled', () => {
    const { container, rerender } = render(withAppContext(<CategoryForm />));
    const numFields = container.querySelectorAll('input, textarea, select').length;

    expect(container.querySelectorAll('input[disabled], textarea[disabled], select[disabled]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Opslaan' })).toBeInTheDocument();

    rerender(withAppContext(<CategoryForm readOnly />));

    expect(container.querySelectorAll('input[disabled], textarea[disabled], select[disabled]')).toHaveLength(numFields);
    expect(screen.queryByRole('button', { name: 'Opslaan' })).not.toBeInTheDocument();
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
      departments: [{
        is_responsible: true,
        code: 'foo',
      }, {
        is_responsible: false,
        code: 'bar',
      }, {
        is_responsible: true,
        code: 'baz',
      }],
    };

    const { container, rerender, unmount } = render(withAppContext(<CategoryForm data={data} />));

    expect(screen.getByTestId('responsible_departments')).toHaveTextContent('foo, baz');
    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(data.name);
    expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(data.description);
    expect(screen.getByRole('textbox', { name: 'Servicebelofte' })).toHaveValue(data.handling_message);
    expect(screen.getByRole('spinbutton')).toHaveValue(data.sla.n_days);
    expect(screen.getByRole('combobox')).toHaveValue('0');
    expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Niet actief' })).not.toBeChecked();

    unmount();

    rerender(withAppContext(<CategoryForm data={{ ...data, sla: { n_days: 10, use_calendar_days: true }, departments: [] }} />));

    expect(screen.queryByTestId('responsible_departments')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('1');
  });

  it('should call onCancel callback', () => {
    const onCancel = jest.fn();

    render(withAppContext(<CategoryForm onCancel={onCancel} />));

    expect(onCancel).not.toHaveBeenCalled();

    userEvent.click(screen.getByRole('button', { name: 'Annuleren' }));

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
