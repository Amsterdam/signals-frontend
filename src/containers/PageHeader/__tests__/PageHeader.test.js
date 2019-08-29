import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import PageHeaderComponent from 'components/PageHeader';
import { initialState } from 'models/search/reducer';
import PageHeaderContainer, { PageHeaderContainerComponent } from '../';

describe('containers/PageHeader', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(
      <PageHeaderContainer />
    ));

    const props = tree.find(PageHeaderContainerComponent).props();

    expect(props.activeFilter).toBeDefined();
    expect(props.incidentsCount).toBeNull();
    expect(props.searchModel).toEqual(initialState.toJS());
  });

  it('renders a PageHeader component', () => {
    const tree = mount(withAppContext(
      <PageHeaderContainer />
    ));

    expect(tree.find(PageHeaderComponent)).toBeDefined();
  });

  it('should provide the PageHeader component with a title', () => {
    const activeFilter = { name: '' };

    const { container, rerender } = render(withAppContext(
      <PageHeaderContainerComponent activeFilter={activeFilter} incidentsCount={null} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Meldingen');

    rerender(withAppContext(
      <PageHeaderContainerComponent activeFilter={activeFilter} incidentsCount={10} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Meldingen (10)');

    rerender(withAppContext(
      <PageHeaderContainerComponent activeFilter={{ name: 'Foo bar !!1!' }} incidentsCount={null} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Foo bar !!1!');

    rerender(withAppContext(
      <PageHeaderContainerComponent activeFilter={{ name: 'Foo bar !!1!' }} incidentsCount={99} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Foo bar !!1! (99)');
  });

  it('should provide the PageHeader component with a subtitle', () => {
    const activeFilter = { name: '' };
    const searchModel = { query: 'Foo bar' };

    const { container } = render(withAppContext(
      <PageHeaderContainerComponent activeFilter={activeFilter} incidentsCount={null} searchModel={searchModel} />
    ));

    expect(container.textContent).toEqual(expect.stringMatching(/Foo bar/));
  });
});
