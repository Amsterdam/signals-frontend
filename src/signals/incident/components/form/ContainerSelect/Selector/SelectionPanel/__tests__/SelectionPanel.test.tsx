import { render, screen } from '@testing-library/react';
import React from 'react';
import { withAppContext } from 'test/utils';

import SelectionPanel from '../SelectionPanel';
import type { SelectionPanelProps } from '../SelectionPanel';
import { glas, select, unknown } from 'signals/incident/definitions/wizard-step-2-vulaan/afval-icons';
import userEvent from '@testing-library/user-event';
import { CONTAINER_NOT_ON_MAP_TYPE_NAME } from 'signals/incident/definitions/wizard-step-2-vulaan/afval.constants';

describe('SelectionPanel', () => {
  const GLAS_FEATURE = {
    label: 'Glas',
    description: 'Glas container',
    icon: {
      options: {},
      iconSvg: glas,
      selectedIconSvg: select,
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Glas',
  };
  const NOT_ON_MAP_FEATURE = {
    description: 'De container staat niet op de kaart',
    label: 'Onbekend',
    icon: {
      iconSvg: unknown,
      selectedIconSvg: select,
    },
    idField: 'id',
    typeField: 'type',
    typeValue: CONTAINER_NOT_ON_MAP_TYPE_NAME,
  };
  const NOT_ON_MAP_CONTAINER = { description: 'De container staat niet op de kaart', id: '', type: 'not-on-map' };
  const GLAS_CONTAINER = { id: 'GLAS123', description: 'Glas container', type: 'Glas' };

  const props: SelectionPanelProps = {
    featureTypes: [GLAS_FEATURE, NOT_ON_MAP_FEATURE],
    onChange: jest.fn(),
    onClose: jest.fn(),
    selection: [],
    variant: 'drawer',
  };

  it('renders the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />));

    expect(screen.getByRole('heading', { name: 'Kies de container' })).toBeInTheDocument();
    expect(screen.getByText('Maak een keuze op de kaart')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'De container staat niet op de kaart' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Meld deze container' })).toBeInTheDocument();
  });

  it('renders selected containers', () => {
    render(
      withAppContext(<SelectionPanel {...props} selection={[GLAS_CONTAINER, { ...GLAS_CONTAINER, id: 'GLAS456' }]} />)
    );

    expect(screen.queryByText('Maak een keuze op de kaart')).not.toBeInTheDocument();
    expect(screen.getByText('Glas container - GLAS123')).toBeInTheDocument();
    expect(screen.getByText('Glas container - GLAS456')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });

  it('removes selected container', () => {
    render(withAppContext(<SelectionPanel {...props} selection={[GLAS_CONTAINER]} />));

    const selectedItem = screen.getByRole('listitem');
    const removeButton = selectedItem.querySelector('button');

    if (removeButton) {
      userEvent.click(removeButton);
    }

    expect(props.onChange).toHaveBeenCalledWith([]);
  });

  it('adds container not on map', () => {
    render(withAppContext(<SelectionPanel {...props} />));

    userEvent.click(screen.getByRole('checkbox', { name: 'De container staat niet op de kaart' }));

    expect(props.onChange).toHaveBeenCalledWith([NOT_ON_MAP_CONTAINER]);
  });

  it('updates container not on map', () => {
    render(withAppContext(<SelectionPanel {...props} selection={[NOT_ON_MAP_CONTAINER]} />));

    userEvent.paste(screen.getByLabelText('Wat is het nummer van de container? (Optioneel)'), 'GLAS987');

    expect(props.onChange).toHaveBeenLastCalledWith([{ ...NOT_ON_MAP_CONTAINER, id: 'GLAS987' }]);
  });

  it('removes container not on map', () => {
    render(withAppContext(<SelectionPanel {...props} selection={[NOT_ON_MAP_CONTAINER]} />));

    userEvent.click(screen.getByRole('checkbox', { name: 'De container staat niet op de kaart' }));

    expect(props.onChange).toHaveBeenCalledWith([]);
  });

  it('closes/submits the panel', () => {
    render(withAppContext(<SelectionPanel {...props} />));

    userEvent.click(screen.getByRole('button', { name: 'Meld deze container' }));

    expect(props.onClose).toHaveBeenCalled();
  });
});
