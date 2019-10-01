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
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<Filter onSubmit={() => {}} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.dataLists).not.toBeUndefined();
    expect(props.filter).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<Filter onSubmit={() => {}} />));

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
  });

  it('renders a FilterForm component', () => {
    const tree = shallow(withAppContext(<Filter onSubmit={() => {}} />));

    expect(tree.find(FilterForm)).not.toBeUndefined();
  });

  it('handles submitting the form', () => {
    const filter = {
      id: 234234,
      name: 'Foo bar',
      options: {},
      refresh: false,
    };
    const onSubmit = jest.fn();
    const onApplyFilter = jest.fn();
    const onRequestIncidents = jest.fn();
    const tree = mount(
      withAppContext(
        <FilterContainerComponent
          onApplyFilter={onApplyFilter}
          onRequestIncidents={onRequestIncidents}
          onSubmit={onSubmit}
          onClearFilter={() => {}}
          onSaveFilter={() => {}}
          onUpdateFilter={() => {}}
          filter={filter}
          dataLists={dataLists}
          categories={categories}
        />,
      ),
    );

    tree.find('button[type="submit"]').simulate('click');

    expect(onApplyFilter).toHaveBeenCalled();
    expect(onRequestIncidents).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });
});
