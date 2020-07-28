import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import CalendarInput from '..';

const calendarInputProps = {
  id: 'foo',
  label: 'Here be dragons',
  name: 'my_date_field',
  onSelect: () => {},
};

describe('signals/incident-management/components/CalendarInput', () => {
  it('renders a datepicker component', () => {
    render(withAppContext(<CalendarInput {...calendarInputProps} />));

    expect(
      document.querySelectorAll('[class*=react-datepicker]').length
    ).toBeGreaterThan(0);
  });

  it('renders a CustomInput component', () => {
    const { getByTestId } = render(
      withAppContext(<CalendarInput {...calendarInputProps} />)
    );

    expect(getByTestId('calendarCustomInputElement')).toBeInTheDocument();
  });

  it('renders a hidden input field', () => {
    const { rerender } = render(
      withAppContext(<CalendarInput {...calendarInputProps} />)
    );

    expect(
      document.querySelector('input[type=hidden]')
    ).not.toBeInTheDocument();

    const selectedDate = new Date();

    rerender(
      withAppContext(
        <CalendarInput {...calendarInputProps} selectedDate={selectedDate} />
      )
    );

    expect(document.querySelector('input[type=hidden]')).toBeInTheDocument();
  });

  it('should call onSelect', () => {
    const onSelect = jest.fn();
    const id = 'qux';

    render(
      withAppContext(
        <CalendarInput {...calendarInputProps} id={id} onSelect={onSelect} />
      )
    );

    const inputElement = document.getElementById(id);

    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.change(inputElement, { target: { value: '18-12-2018' } });

    expect(onSelect).toHaveBeenCalledWith(
      expect.any(Date),
      expect.any(Object)
    );
  });
});
