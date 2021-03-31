// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import NotFoundPage, { DEFAULT_MESSAGE } from '../NotFoundPage';

describe('components/NotFoundPage', () => {
  it('Renders default message', () => {
    render(withAppContext(<NotFoundPage />));

    expect(screen.getByText(DEFAULT_MESSAGE)).toBeInTheDocument();
  });

  it('Renders custom message', () => {
    const message = 'Test message';
    render(withAppContext(<NotFoundPage message={message} />));

    expect(screen.queryByText(DEFAULT_MESSAGE)).not.toBeInTheDocument();
    expect(screen.queryByText(message)).toBeInTheDocument();
  });
});
