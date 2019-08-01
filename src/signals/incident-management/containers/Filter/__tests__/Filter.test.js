import React from 'react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import FilterComponent from 'signals/incident-management/components/Filter';
import Filter, { FiltersContainerComponent } from '../';

describe('signals/incident-management/containers/Filter', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(
      <Filter />
    ));

    const props = tree.find(FiltersContainerComponent).props();

    expect(props.overviewpage).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(
      <Filter />
    ));

    const props = tree.find(FiltersContainerComponent).props();

    expect(props.onIncidentSelected).not.toBeUndefined();
    expect(typeof props.onIncidentSelected).toEqual('function');

    expect(props.onMainCategoryFilterSelectionChanged).not.toBeUndefined();
    expect(typeof props.onMainCategoryFilterSelectionChanged).toEqual('function');

    expect(props.onRequestIncidents).not.toBeUndefined();
    expect(typeof props.onRequestIncidents).toEqual('function');
  });

  it('renders a Filter component', () => {
    const tree = mount(withAppContext(
      <Filter />
    ));

    expect(tree.find(FilterComponent)).not.toBeUndefined();
  });
});
