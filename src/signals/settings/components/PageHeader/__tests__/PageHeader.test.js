import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';
import PageHeader from 'components/PageHeader';
import PageHeaderComponent from '..';

describe('containers/PageHeader', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(
      <PageHeaderComponent />
    ));

    const props = tree.find(PageHeader).props();

    expect(props.filter).toBeDefined();
    expect(props.userCount).toBeDefined();
  });

  it('renders a PageHeader component', () => {
    const tree = mount(withAppContext(
      <PageHeaderComponent />
    ));

    expect(tree.find(PageHeaderComponent)).toBeDefined();
  });

  it('should provide the PageHeader component with a title', () => {
    const { container, rerender } = render(withAppContext(
      <PageHeaderComponent userCount={null} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Gebruikers');

    rerender(withAppContext(
      <PageHeaderComponent userCount={10} />
    ));

    expect(container.firstChild.querySelector('h1').textContent).toEqual('Gebruikers (10)');
  });
});
