import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Item } from 'signals/incident/components/form/ContainerSelect/types';
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval';
import { withAppContext } from 'test/utils';

import ContainerList from '..';

describe('signals/incident/components/form/ContainerSelect/ContainerList', () => {
  const selection: Item[] = [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
    },
    {
      id: 'GLA00137',
      type: 'glas',
      description: 'Glas container',
    },
    {
      id: 'BR0234',
      type: 'brood',
      description: 'Brood container',
    },
    {
      id: 'PP0234',
      type: 'papier',
      description: 'Papier container',
    },
  ];
  const { featureTypes } = controls.extra_container.meta;

  it('should render', () => {
    render(withAppContext(<ContainerList selection={selection} featureTypes={featureTypes}></ContainerList>));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    selection.forEach(({ id }) => {
      expect(screen.getByTestId(`containerList-item-${id}`)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem').length).toBe(selection.length);
  });

  it('should render an empty list', () => {
    render(withAppContext(<ContainerList selection={[]} featureTypes={featureTypes}></ContainerList>));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });
});
