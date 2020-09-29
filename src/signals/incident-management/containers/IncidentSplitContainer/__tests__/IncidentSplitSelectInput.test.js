import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';

import IncidentSplitSelectInput from '../IncidentSplitSelectInput';

import subcategoriesFixture from './departmentsFixture.json';

describe('<IncidentSplitSelectInput />', () => {
  const props = {
    name: 'subcategory',
    display: 'Subcategorie',
    id: 'subcategory',
    initialValue: subcategoriesFixture[0].key,
    options: subcategoriesFixture,
    register: jest.fn(),
  };

  it('should render a select input element', () => {
    const { container } = render(withAppContext(<IncidentSplitSelectInput {...props} />));

    expect(container.querySelectorAll('option')).toHaveLength(priorityList.length);
  });

  it('should display description', () => {
    const { key: initialValue, description } = subcategoriesFixture[0];
    const { getByText } = render(withAppContext(<IncidentSplitSelectInput {...props} initialValue={initialValue} />));

    expect(getByText(new RegExp(description))).toBeInTheDocument();
  });

  it('should not display description', () => {
    const { key: initialValue } = subcategoriesFixture[0];
    const { queryByText } = render(withAppContext(<IncidentSplitSelectInput {...props} initialValue={initialValue} />));

    expect(queryByText(new RegExp(initialValue))).not.toBeInTheDocument();
  });

  it('should display a label', () => {
    const { container } = render(withAppContext(<IncidentSplitSelectInput {...props} />));

    expect(container.querySelectorAll('label')).toHaveLength(1);
  });

  it('should select an option and update the info text', async () => {
    const { key, description } = subcategoriesFixture[1];
    const { findByText, getByTestId } = render(withAppContext(<IncidentSplitSelectInput {...props} />));

    fireEvent.change(getByTestId('selectInput-subcategory'), { target: { value: key } });
    expect(await findByText(new RegExp(description))).toBeInTheDocument();
  });
});
