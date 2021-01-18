import { render, screen } from '@testing-library/react';
import React from 'react';
import { withAppContext } from 'test/utils';

import LegendPanel from './LegendPanel';
import type { LegendPanelProps } from './LegendPanel';

describe('LegendPanel', () => {
  const props: LegendPanelProps = {
    title: 'Title',
    variant: 'drawer',
    items: [{
      iconUrl: 'url',
      id: 'id',
      label: 'label',
    }],
  };
  it('should render', () => {
    render(withAppContext(<LegendPanel {...props} />));

    expect(screen.getByRole('list')).toBeInTheDocument();
    props.items?.forEach(({ id }) => expect(screen.getByTestId(`legend-item-${id}`)));
    expect(screen.getAllByRole('listitem').length).toBe(props.items?.length);
  });
});
