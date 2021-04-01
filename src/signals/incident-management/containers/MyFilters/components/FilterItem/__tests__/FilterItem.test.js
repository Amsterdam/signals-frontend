// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react';
import { createEvent, fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as definitions from 'signals/incident-management/definitions';
import { parseToAPIData } from 'signals/shared/filter/parse';
import FilterItem from '..';

jest.mock('signals/shared/filter/parse', () => {
  const actual = jest.requireActual('signals/shared/filter/parse');

  return {
    __esModule: true,
    ...actual,
    parseToAPIData: data => data,
  };
});

describe('signals/incident-management/containers/MyFilters/components/FilterItem', () => {
  const filter = {
    id: 1234,
    name: 'Foo bar baz',
    options: {
      status: [definitions.statusList[0]],
      feedback: '',
      priority: [{ key: 'normal', value: 'Normaal' }],
      stadsdeel: [definitions.stadsdeelList[0], definitions.stadsdeelList[1]],
      address_text: '',
      incident_date: '2019-09-17',
      category_slug: [
        {
          key:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca',
          slug: 'overlast-bedrijven-en-horeca',
          value: 'Overlast Bedrijven en Horeca',
        },
      ],
    },
  };

  it('should render correctly', () => {
    const props = {
      onApplyFilter: () => {},
      onEditFilter: () => {},
      onClose: () => {},
      onRemoveFilter: () => {},
      filter,
    };

    const { container, getByText, rerender } = render(
      withAppContext(<FilterItem {...props} />)
    );

    expect(container.querySelectorAll('a')).toHaveLength(3); // interaction buttons
    expect(container.querySelectorAll('svg')).toHaveLength(0);
    expect(getByText('Foo bar baz')).toBeTruthy();

    const withRefresh = { ...props, filter: { ...filter, refresh: true } };

    rerender(withAppContext(<FilterItem {...withRefresh} />));
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('should handle apply filter', () => {
    const props = {
      onApplyFilter: jest.fn(),
      onEditFilter: jest.fn(),
      onClose: jest.fn(),
      onRemoveFilter: () => {},
      filter,
    };

    const { getByTestId } = render(withAppContext(<FilterItem {...props} />));

    const handleApplyFilterButton = getByTestId('handleApplyFilterButton');
    const event = createEvent.click(handleApplyFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    fireEvent(handleApplyFilterButton, event);

    expect(props.onApplyFilter).toHaveBeenCalledWith(parseToAPIData(filter));
    expect(props.onClose).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle edit filter', () => {
    const props = {
      onEditFilter: jest.fn(),
      onApplyFilter: jest.fn(),
      onClose: jest.fn(),
      onRemoveFilter: () => {},
      filter,
    };

    const { getByTestId } = render(withAppContext(<FilterItem {...props} />));

    const handleEditFilterButton = getByTestId('handleEditFilterButton');
    const event = createEvent.click(handleEditFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    fireEvent(handleEditFilterButton, event);

    expect(props.onEditFilter).toHaveBeenCalledWith(parseToAPIData(filter));
    expect(props.onClose).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle remove filter', () => {
    const props = {
      onApplyFilter: () => {},
      onEditFilter: () => {},
      onClose: jest.fn(),
      onRemoveFilter: jest.fn(),
      filter,
    };

    const { getByTestId } = render(withAppContext(<FilterItem {...props} />));

    const handleRemoveFilterButton = getByTestId('handleRemoveFilterButton');
    const event = createEvent.click(handleRemoveFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    window.confirm = jest.fn(() => true);

    fireEvent(handleRemoveFilterButton, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onRemoveFilter).toHaveBeenCalledWith(filter.id);
  });

  it('should handle remove filter when not confirmed', () => {
    const props = {
      onApplyFilter: () => {},
      onEditFilter: () => {},
      onClose: jest.fn(),
      onRemoveFilter: jest.fn(),
      filter,
    };

    const { getByTestId } = render(withAppContext(<FilterItem {...props} />));

    const handleRemoveFilterButton = getByTestId('handleRemoveFilterButton');
    const event = createEvent.click(handleRemoveFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    window.confirm = jest.fn(() => false);

    fireEvent(handleRemoveFilterButton, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onRemoveFilter).not.toHaveBeenCalledWith();
  });
});
