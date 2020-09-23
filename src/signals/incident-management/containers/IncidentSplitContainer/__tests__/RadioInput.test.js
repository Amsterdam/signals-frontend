import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';
import { register } from 'react-hook-form';

import RadioInput from '../RadioInput';

describe('<RadioInput />', () => {
  const props = {
    name: 'priority',
    display: 'Urgentie',
    id: 'priority',
    initialValue: 'null',
    options: priorityList,
    register,
  };

  it('should render a list of radio buttons', () => {
    const { container } = render(withAppContext(<RadioInput {...props} />));

    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(priorityList.length);
  });

  it('should display info text', () => {
    const { key: initialValue, info } = priorityList[0];
    const { getByText } = render(withAppContext(<RadioInput {...props} initialValue={initialValue} />));

    expect(getByText(new RegExp(info))).toBeInTheDocument();
  });

  it('should not display info text', () => {
    const { key: initialValue } = priorityList[0];
    const { queryByText } = render(withAppContext(<RadioInput {...props} initialValue={initialValue} />));

    expect(queryByText(new RegExp(initialValue))).not.toBeInTheDocument();
  });

  it('should display a label', () => {
    const { container } = render(withAppContext(<RadioInput {...props} />));

    expect(container.querySelectorAll(`label[for="${props.name}"]`)).toHaveLength(1);
  });
});
