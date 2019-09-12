import React from 'react';
import { shallow, mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import FilterForm from 'signals/incident-management/components/FilterForm';
import Filter, { FilterContainerComponent } from '../';

describe.skip('signals/incident-management/containers/Filter', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<Filter onSubmit={() => {}} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.overviewpage).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<Filter onSubmit={() => {}} />));

    const props = tree.find(FilterContainerComponent).props();

    expect(props.onIncidentSelected).not.toBeUndefined();
    expect(typeof props.onIncidentSelected).toEqual('function');

    expect(props.onMainCategoryFilterSelectionChanged).not.toBeUndefined();
    expect(typeof props.onMainCategoryFilterSelectionChanged).toEqual(
      'function',
    );

    expect(props.onRequestIncidents).not.toBeUndefined();
    expect(typeof props.onRequestIncidents).toEqual('function');

    expect(props.onClearFilter).not.toBeUndefined();
    expect(typeof props.onClearFilter).toEqual('function');

    expect(props.onSaveFilter).not.toBeUndefined();
    expect(typeof props.onSaveFilter).toEqual('function');

    expect(props.onUpdateFilter).not.toBeUndefined();
    expect(typeof props.onUpdateFilter).toEqual('function');
  });

  it('renders a FilterForm component', () => {
    const tree = shallow(withAppContext(<Filter onSubmit={() => {}} />));

    expect(tree.find(FilterForm)).not.toBeUndefined();
  });
});
