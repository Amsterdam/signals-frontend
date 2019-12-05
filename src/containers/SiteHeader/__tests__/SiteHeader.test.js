import React from 'react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import SiteHeader, { SiteHeaderContainer } from '../index';

describe('containers/SiteHeader', () => {
  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SiteHeader />));

    const containerProps = tree.find(SiteHeaderContainer).props();

    expect(containerProps.onLogOut).not.toBeUndefined();
    expect(typeof containerProps.onLogOut).toEqual('function');
  });
});
