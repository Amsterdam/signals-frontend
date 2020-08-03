import React from 'react';
import { shallow, mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import FilterForm from 'signals/incident-management/components/FilterForm';
import categories from 'utils/__tests__/fixtures/categories_structured.json';
import Filter, { FilterContainerComponent } from '..';

jest.mock('models/categories/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/categories/selectors'),
  // eslint-disable-next-line global-require
  makeSelectStructuredCategories: () => require('utils/__tests__/fixtures/categories_structured.json'),
}));

describe('signals/incident-management/containers/Filter', () => {
  const handlers = {
    onSubmit: () => {},
    onCancel: () => {},
    onFilterEditCancel: () => {},
  };

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<Filter {...handlers} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.filter).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<Filter {...handlers} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.onApplyFilter).not.toBeUndefined();
    expect(typeof props.onApplyFilter).toEqual('function');

    expect(props.onClearFilter).not.toBeUndefined();
    expect(typeof props.onClearFilter).toEqual('function');

    expect(props.onSaveFilter).not.toBeUndefined();
    expect(typeof props.onSaveFilter).toEqual('function');

    expect(props.onUpdateFilter).not.toBeUndefined();
    expect(typeof props.onUpdateFilter).toEqual('function');

    expect(props.onFilterEditCancel).not.toBeUndefined();
    expect(typeof props.onFilterEditCancel).toEqual('function');
  });

  it('renders a FilterForm component', () => {
    const tree = shallow(withAppContext(<Filter {...handlers} />));

    expect(tree.find(FilterForm)).not.toBeUndefined();
  });

  describe('interaction handling', () => {
    const filter = {
      id: 234234,
      name: 'Foo bar',
      options: {},
      refresh: false,
    };
    const onSubmit = jest.fn();
    const onApplyFilter = jest.fn();

    it('handles submitting the form', () => {
      const tree = mount(
        withAppContext(
          <FilterContainerComponent
            onApplyFilter={onApplyFilter}
            onClearFilter={() => {}}
            onSaveFilter={() => {}}
            onUpdateFilter={() => {}}
            filter={filter}
            categories={categories}
            {...handlers}
            onSubmit={onSubmit}
          />
        )
      );

      tree.find('button[type="submit"]').simulate('click');

      expect(onApplyFilter).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalled();
    });

    it('handles canceling edit', () => {
      const onFilterEditCancel = jest.fn();
      const onCancel = jest.fn();

      const tree = mount(
        withAppContext(
          <FilterContainerComponent
            onApplyFilter={onApplyFilter}
            onClearFilter={() => {}}
            onSaveFilter={() => {}}
            onUpdateFilter={() => {}}
            filter={filter}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onFilterEditCancel={onFilterEditCancel}
          />
        )
      );

      tree.find('button[type="button"]').simulate('click');

      expect(onCancel).toHaveBeenCalled();
      expect(onFilterEditCancel).toHaveBeenCalled();
    });
  });
});
