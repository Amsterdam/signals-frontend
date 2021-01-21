import React from 'react';
import { render, screen } from '@testing-library/react';
import ContainerList from './ContainerList';
import type { ContainerListProps } from './ContainerList';

import { withAppContext } from 'test/utils';

describe('signals/incident/components/form/ContainerSelect/ContainerList', () => {
  const selection: ContainerListProps['selection'] = [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
      iconUrl: '',
    },
    {
      id: 'GLA00137',
      type: 'glas',
      description: 'Glas container',
      iconUrl: '',
    },
    {
      id: 'BR0234',
      type: 'brood',
      description: 'Brood container',
      iconUrl: '',
    },
    {
      id: 'PP0234',
      type: 'papier',
      description: 'Papier container',
      iconUrl: '',
    },
  ];

  it('should render', () => {
    render(withAppContext(<ContainerList selection={selection}></ContainerList>));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    selection.forEach(({ id }) => {
      expect(screen.getByTestId(`containerList-item-${id}`)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem').length).toBe(selection.length);
  });

  it('should render an empty list', () => {
    render(withAppContext(<ContainerList selection={[]}></ContainerList>));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });
});
