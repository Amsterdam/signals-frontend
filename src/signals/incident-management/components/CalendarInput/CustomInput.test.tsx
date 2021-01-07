import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import CustomInput from './CustomInput';

const label = 'Here be dragons';
const id = 'input_date_created_before';

describe('signals/incident-management/components/CalendarInput/CustomInput', () => {
  it('renders correctly', () => {
    const { getByLabelText } = render(withAppContext(
      <CustomInput label={label} id={id} />
    ));

    expect(document.getElementById(id)).toBeInTheDocument();
    expect(getByLabelText(label)).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should accept extra props', () => {
    const name = 'date_created_before';
    render(withAppContext(
      <CustomInput label={label} id={id} name={name} readOnly />
    ));

    expect(document.querySelector(`input[name=${name}]`)).toBeInTheDocument();
    expect(document.querySelector('input[readonly]')).toBeInTheDocument();
  });
});
