import React from 'react';

import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import LegendToggleButton from '..';
import type { LegendToggleButtonProps } from '..';
import { MapPanelProvider } from '@amsterdam/arm-core';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';

describe('LegendToggleButton', () => {
  const props: LegendToggleButtonProps = {
    onClick: jest.fn(),
    isRenderingLegendPanel: true,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render panel variant', () => {
    render(
      withAppContext(
        <MapPanelProvider variant="panel" initialPosition={SnapPoint.Closed}>
          <LegendToggleButton {...props} />
        </MapPanelProvider>
      )
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button').textContent).not.toBe('Legenda');
  });

  it('should render drawer variant', () => {
    render(
      withAppContext(
        <MapPanelProvider variant="drawer" initialPosition={SnapPoint.Closed}>
          <LegendToggleButton {...props} />
        </MapPanelProvider>
      )
    );

    expect(screen.getByRole('button').textContent).toBe('Legenda');
  });

  it('should handle click when panel is closed', () => {
    render(
      withAppContext(
        <MapPanelProvider variant="drawer" initialPosition={SnapPoint.Closed}>
          <LegendToggleButton {...props} />
        </MapPanelProvider>
      )
    );

    userEvent.click(screen.getByRole('button'));

    expect(props.onClick).toHaveBeenCalled();
  });

  it('should handle click when panel is open', () => {
    render(
      withAppContext(
        <MapPanelProvider variant="drawer" initialPosition={SnapPoint.Halfway}>
          <LegendToggleButton {...props} />
        </MapPanelProvider>
      )
    );

    userEvent.click(screen.getByRole('button'));

    expect(props.onClick).toHaveBeenCalled();
  });
});
