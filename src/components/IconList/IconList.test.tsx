import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import IconList from './IconList';
import type { IconListProps } from './IconList';

describe('IconList', () => {
  const props: IconListProps = {
    id: 'list',
    items: [{
      iconUrl: 'url1',
      id: 'listItem1',
      label: 'label1',
    }, {
      iconUrl: 'url2',
      id: 'listItem2',
      label: 'label2',
    }],
    size: 40,
  };

  it('should render', () => {
    render(withAppContext(<IconList {...props} size={30} />));

    expect(screen.getByRole('list')).toBeInTheDocument();
    props.items.forEach(({ id }) => expect(screen.getByTestId(`${props.id}-item-${id}`)));
    expect(screen.getAllByRole('listitem').length).toBe(props.items.length);
  });

  it('should render an empty list', () => {
    render(withAppContext(<IconList {...props} items={[]} />));

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });
});
