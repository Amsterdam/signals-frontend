import { render, screen } from '@testing-library/react';
import React from 'react';
import { withAppContext } from 'test/utils';

import LegendPanel from '../../..';
import type { LegendPanelProps } from '../LegendPanel';

describe('LegendPanel', () => {
  const props: LegendPanelProps = {
    onClose: () => {},
    title: 'Title',
    variant: 'drawer',
    items: [
      {
        iconUrl: 'url',
        id: 'id',
        label: 'label',
      },
    ],
  };
  it('should render', () => {
    render(withAppContext(<LegendPanel {...props} />));

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByTestId(`legendPanelListItem-${props.items[0].id}`)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBe(props.items?.length);
  });

  it('should render with empty items', () => {
    render(
      withAppContext(<LegendPanel items={[]} onClose={props.onClose} title={props.title} variant={props.variant} />)
    );

    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });
});
