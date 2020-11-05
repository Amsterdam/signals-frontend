import React from 'react';
import { render, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import IncidentSplitTextAreaInput from '..';

describe('IncidentSplitTextAreaInput', () => {
  const props = {
    id: 'note',
    display: 'Notitie',
    name: 'note',
    register: jest.fn(),
  };

  it('should render a text area input element', () => {
    render(withAppContext(<IncidentSplitTextAreaInput {...props} />));

    expect(screen.getByRole('textbox', { name: 'Notitie' })).toBeVisible();
  });

  it('should render a label', () => {
    render(withAppContext(<IncidentSplitTextAreaInput {...props} />));

    expect(screen.getByText('Notitie')).toBeVisible();
  });
});
