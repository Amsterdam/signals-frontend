import React from 'react';
import { createEvent, fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import FilterItem from '../';

describe('signals/incident-management/containers/MyFilters/components/FilterItem', () => {
  const filter = {
    id: 1234,
    name: 'Foo bar baz',
    options: {
      status: ['m'],
      feedback: '',
      priority: 'normal',
      stadsdeel: ['A', 'T'],
      address_text: '',
      incident_date: '2019-09-17',
      category_slug: ['oever-kade-steiger'],
    },
  };

  it('should render correctly', () => {
    const props = {
      onApplyFilter: () => {},
      onClose: () => {},
      onRemoveFilter: () => {},
      filter,
    };

    const { container, getByText, rerender } = render(
      withAppContext(<FilterItem {...props} />),
    );

    expect(container.querySelectorAll('a')).toHaveLength(3); // interaction buttons
    expect(container.querySelectorAll('span')).toHaveLength(6); // tags
    expect(container.querySelectorAll('svg')).toHaveLength(0);
    expect(getByText('Foo bar baz')).toBeTruthy();

    const withRefresh = Object.assign({}, props, { filter: { ...filter, refresh: true } });

    rerender(
      withAppContext(<FilterItem {...withRefresh} />),
    );
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('should handle apply filter', () => {
    const props = {
      onApplyFilter: jest.fn(),
      onClose: jest.fn(),
      onRemoveFilter: () => {},
      filter,
    };

    const { getByTestId } = render(
      withAppContext(<FilterItem {...props} />),
    );

    const handleApplyFilterButton = getByTestId('handleApplyFilterButton');
    const event = createEvent.click(handleApplyFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    fireEvent(handleApplyFilterButton, event);

    expect(props.onApplyFilter).toHaveBeenCalledWith(filter);
    expect(props.onClose).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle edit filter', () => {
    const dispatchSpy = jest.spyOn(document, 'dispatchEvent');
    const props = {
      onApplyFilter: jest.fn(),
      onClose: jest.fn(),
      onRemoveFilter: () => {},
      filter,
    };

    const { getByTestId } = render(
      withAppContext(<FilterItem {...props} />),
    );

    const handleEditFilterButton = getByTestId('handleEditFilterButton');
    const event = createEvent.click(handleEditFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    fireEvent(handleEditFilterButton, event);

    expect(props.onApplyFilter).toHaveBeenCalledWith(filter);
    expect(props.onClose).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should dispatch event in IE11', () => {
    const Event = global.Event;
    global.Event = null;
    const createEventSpy = jest.spyOn(document, 'createEvent');
    const props = {
      onApplyFilter: () => {},
      onClose: () => {},
      onRemoveFilter: () => {},
      filter,
    };

    const { getByTestId } = render(
      withAppContext(<FilterItem {...props} />),
    );

    const handleEditFilterButton = getByTestId('handleEditFilterButton');
    const event = createEvent.click(handleEditFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    fireEvent(handleEditFilterButton, event);

    expect(createEventSpy).toHaveBeenCalled();

    global.Event = Event;
  });

  it('should handle remove filter', () => {
    const props = {
      onApplyFilter: () => {},
      onClose: jest.fn(),
      onRemoveFilter: jest.fn(),
      filter,
    };

    const { getByTestId } = render(
      withAppContext(<FilterItem {...props} />),
    );

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
      onClose: jest.fn(),
      onRemoveFilter: jest.fn(),
      filter,
    };

    const { getByTestId } = render(
      withAppContext(<FilterItem {...props} />),
    );

    const handleRemoveFilterButton = getByTestId('handleRemoveFilterButton');
    const event = createEvent.click(handleRemoveFilterButton, { button: 1 });
    event.preventDefault = jest.fn();

    window.confirm = jest.fn(() => false);

    fireEvent(handleRemoveFilterButton, event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onRemoveFilter).not.toHaveBeenCalledWith();
  });
});
