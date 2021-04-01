// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';

import IncidentSplitSelectInput from '..';

import subcategoriesFixture from '../../../__tests__/subcategoriesFixture.json';

describe('IncidentSplitSelectInput', () => {
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

  it('should render a label', () => {
    const { container } = render(withAppContext(<IncidentSplitSelectInput {...props} />));

    expect(container.querySelectorAll('label')).toHaveLength(1);
  });

  it('should select options and display info text when available', async () => {
    const { key: emptyDescriptionKey } = subcategoriesFixture[0];
    const { key, description } = subcategoriesFixture[1];
    const { findByText, getByTestId, queryByText } = render(withAppContext(<IncidentSplitSelectInput {...props} />));

    const descriptionTextRegex = new RegExp(description);

    fireEvent.change(getByTestId('subcategory'), { target: { value: emptyDescriptionKey } });
    expect(queryByText(descriptionTextRegex)).not.toBeInTheDocument();

    fireEvent.change(getByTestId('subcategory'), { target: { value: key } });
    expect(await findByText(descriptionTextRegex)).toBeInTheDocument();
  });
});
