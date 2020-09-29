import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';

import IncidentSplitRadioInput from '../IncidentSplitRadioInput';

describe('<IncidentSplitRadioInput />', () => {
  const props = {
    name: 'priority',
    display: 'Urgentie',
    id: 'priority',
    initialValue: 'null',
    options: priorityList,
    register: jest.fn(),
  };

  it('should render a list of radio buttons', () => {
    const { container } = render(withAppContext(<IncidentSplitRadioInput {...props} />));

    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(priorityList.length);
  });

  it('should display info text', () => {
    const { key: initialValue, info } = priorityList[0];
    const { getByText } = render(withAppContext(<IncidentSplitRadioInput {...props} initialValue={initialValue} />));

    expect(getByText(new RegExp(info))).toBeInTheDocument();
  });

  it('should not display info text', () => {
    const { key: initialValue } = priorityList[0];
    const { queryByText } = render(withAppContext(<IncidentSplitRadioInput {...props} initialValue={initialValue} />));

    expect(queryByText(new RegExp(initialValue))).not.toBeInTheDocument();
  });

  it('should display a label', () => {
    const { container } = render(withAppContext(<IncidentSplitRadioInput {...props} />));

    expect(container.querySelectorAll(`label[for="${props.name}"]`)).toHaveLength(1);
  });

  it('should select radio button and update info text', async () => {
    const { key, info, value } = priorityList[2];
    const { getByTestId, getByLabelText, getByText } = render(withAppContext(<IncidentSplitRadioInput {...props} />));

    fireEvent.click(getByTestId(`incidentSplitRadioInput-priority-${key}`));

    expect(getByLabelText(value).checked).toBe(true);
    expect(getByText(new RegExp(info))).toBeInTheDocument();
  });
});
