import React from 'react';
import { withAppContext } from 'test/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval';
import type { ContainerListProps } from '../ContainerList';
import ContainerList from '../ContainerList';

describe('ContainerList', () => {
  const props: ContainerListProps = {
    onRemove: jest.fn(),
    featureTypes: controls.extra_container.meta.featureTypes,
    selection: [{ description: 'Description', id: 'id', type: 'Rest' }],
  };

  it('should render an empty selection', () => {
    render(withAppContext(<ContainerList {...props} selection={[]} />));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });

  it('should render a selection of containers', () => {
    render(withAppContext(<ContainerList {...props} />));

    expect(screen.getByTestId('containerList')).toBeInTheDocument();
    props.selection.forEach(({ id }) => {
      expect(screen.getByTestId(`containerListItem-${id}`)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem').length).toBe(props.selection.length);
  });

  it('should allow user to remove item', () => {
    render(withAppContext(<ContainerList {...props} />));

    const item = props.selection[0];

    const button = screen.getByRole('button');
    userEvent.click(button);

    expect(props.onRemove).toHaveBeenCalledWith(item.id);
  });
});
