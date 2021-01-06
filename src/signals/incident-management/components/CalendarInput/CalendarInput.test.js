import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { dateToString } from 'shared/services/date-utils';
import { withAppContext } from 'test/utils';

import CalendarInput from '.';

describe('signals/incident-management/components/CalendarInput', () => {
  const calendarInputProps = {
    id: 'foo',
    label: 'Here be dragons',
    name: 'my_date_field',
    onSelect: () => {},
  };
  const id = 'bar';

  it('renders a datepicker component', () => {
    render(withAppContext(<CalendarInput {...calendarInputProps} />));

    expect(document.querySelectorAll('[class*=react-datepicker]').length).toBeGreaterThan(0);
  });

  it('renders a CustomInput component', () => {
    render(withAppContext(<CalendarInput {...calendarInputProps} />));

    expect(screen.getByTestId('calendarCustomInputElement')).toBeInTheDocument();
  });

  it('renders the selected date in the input field', () => {
    const { rerender } = render(withAppContext(<CalendarInput {...calendarInputProps} />));

    const element = screen.getByTestId('calendarCustomInputElement');
    expect(element.querySelector('input').value).toEqual('');

    const selectedDate = new Date();

    rerender(withAppContext(<CalendarInput {...calendarInputProps} selectedDate={selectedDate} />));

    const elementWithDate = screen.getByTestId('calendarCustomInputElement');
    expect(element.querySelector('input').value).toEqual(dateToString(selectedDate));
  });

  it('should call onSelect', () => {
    const onSelect = jest.fn();

    render(withAppContext(<CalendarInput {...calendarInputProps} id={id} onSelect={onSelect} />));

    const inputElement = screen.getByRole('textbox', { name: calendarInputProps.label });

    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.change(inputElement, { target: { value: '18-12-2018' } });

    expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should focus on the input when a value is selected', () => {
    const onSelect = jest.fn();
    const selectedDate = new Date();

    render(withAppContext(<CalendarInput {...calendarInputProps} id={id} onSelect={onSelect} />));

    const inputElement = screen.getByRole('textbox', { name: calendarInputProps.label });
    inputElement.focus();

    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(inputElement);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 13, keyCode: 13 });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 13, keyCode: 13 });

    expect(onSelect).toHaveBeenCalledWith(expect.any(Date));

    expect(screen.getByTestId('selectedDate')).toEqual(document.activeElement);
  });
});
