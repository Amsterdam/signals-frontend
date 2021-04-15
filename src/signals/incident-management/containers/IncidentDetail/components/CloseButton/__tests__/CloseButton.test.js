// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import 'jest-styled-components';

import { withAppContext } from 'test/utils';

import IncidentDetailContext from '../../../context';
import CloseButton from '..';

const close = jest.fn();

const renderWithContext = () =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ close }}>
      <CloseButton />
    </IncidentDetailContext.Provider>
  );

describe('incident-management/containers/IncidentDetail/components/CloseButton', () => {
  beforeEach(() => {
    close.mockReset();
  });

  it('is positioned absolute', () => {
    const { container } = render(renderWithContext());

    expect(container.firstChild).toHaveStyleRule('position', 'absolute');
  });

  it('should execute callback', () => {
    const { container } = render(renderWithContext());

    expect(close).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.firstChild);
    });

    expect(close).toHaveBeenCalled();
  });
});
