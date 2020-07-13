import React from 'react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import SiteHeader, { SiteHeaderContainer } from '..';

describe('containers/SiteHeader', () => {
  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SiteHeader />));

    const containerProps = tree.find(SiteHeaderContainer).props();

    expect(containerProps.onLogOut).toBeDefined();
    expect(typeof containerProps.onLogOut).toEqual('function');
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SiteHeader />));

    const props = tree.find(SiteHeaderContainer).props();

    expect(props.userCan).toBeDefined();
    expect(props.userCanAccess).toBeDefined();
  });
});
