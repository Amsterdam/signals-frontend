import React from 'react';
import { shallow, mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import FilterForm from 'signals/incident-management/components/FilterForm';
import * as definitions from 'signals/incident-management/definitions';
import categories from 'utils/__tests__/fixtures/categories.json';
import Filter, { FilterContainerComponent } from '../';

const dataLists = {
  priority: definitions.priorityList,
  status: definitions.statusList,
  feedback: definitions.feedbackList,
  stadsdeel: definitions.stadsdeelList,
};

describe('signals/incident-management/containers/Filter', () => {
  const handlers = {
    onSubmit: () => {},
    onCancel: () => {},
    onFilterEditCancel: () => {},
  };

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<Filter {...handlers} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.dataLists).not.toBeUndefined();
    expect(props.filter).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<Filter {...handlers} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.onApplyFilter).not.toBeUndefined();
    expect(typeof props.onApplyFilter).toEqual('function');

    expect(props.onClearFilter).not.toBeUndefined();
    expect(typeof props.onClearFilter).toEqual('function');

    expect(props.onIncidentSelected).not.toBeUndefined();
    expect(typeof props.onIncidentSelected).toEqual('function');

    expect(props.onRequestIncidents).not.toBeUndefined();
    expect(typeof props.onRequestIncidents).toEqual('function');

    expect(props.onSaveFilter).not.toBeUndefined();
    expect(typeof props.onSaveFilter).toEqual('function');

    expect(props.onUpdateFilter).not.toBeUndefined();
    expect(typeof props.onUpdateFilter).toEqual('function');

    expect(props.onFilterEditCancel).not.toBeUndefined();
    expect(typeof props.onFilterEditCancel).toEqual('function');

    expect(props.onEditFilter).not.toBeUndefined();
    expect(typeof props.onEditFilter).toEqual('function');
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
    const onEditFilter = jest.fn();
    const onRequestIncidents = jest.fn();

    it('handles submitting the form', () => {
      const tree = mount(
        withAppContext(
          <FilterContainerComponent
            onApplyFilter={onApplyFilter}
            onEditFilter={onEditFilter}
            onRequestIncidents={onRequestIncidents}
            onClearFilter={() => {}}
            onSaveFilter={() => {}}
            onUpdateFilter={() => {}}
            filter={filter}
            dataLists={dataLists}
            categories={categories}
            {...handlers}
            onSubmit={onSubmit}
          />,
        ),
      );

      tree.find('button[type="submit"]').simulate('click');

      expect(onApplyFilter).toHaveBeenCalled();
      expect(onEditFilter).toHaveBeenCalled();
      expect(onRequestIncidents).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalled();
    });

    it('handles canceling edit', () => {
      const onFilterEditCancel = jest.fn();
      const onCancel = jest.fn();
      const tree = mount(
        withAppContext(
          <FilterContainerComponent
            onApplyFilter={onApplyFilter}
            onRequestIncidents={onRequestIncidents}
            onClearFilter={() => {}}
            onSaveFilter={() => {}}
            onUpdateFilter={() => {}}
            filter={filter}
            dataLists={dataLists}
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onFilterEditCancel={onFilterEditCancel}
          />,
        ),
      );

      tree.find('button[type="button"]').simulate('click');

      expect(onCancel).toHaveBeenCalled();
      expect(onFilterEditCancel).toHaveBeenCalled();
    });
  });
});
