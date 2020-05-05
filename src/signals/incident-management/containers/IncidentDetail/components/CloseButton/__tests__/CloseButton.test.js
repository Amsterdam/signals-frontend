import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import 'jest-styled-components';

import { withAppContext } from 'test/utils';

import CloseButton from '..';

describe('incident-management/containers/IncidentDetail/components/CloseButton', () => {
  it('is positioned absolute', () => {
    const { container } = render(withAppContext(<CloseButton onClick={() => {}} />));

    expect(container.firstChild).toHaveStyleRule('position', 'absolute');
  });

  it('should execute callback', () => {
    const onClick = jest.fn();
    const { container } = render(withAppContext(<CloseButton onClick={onClick} />));

    expect(onClick).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.firstChild);
    });

    expect(onClick).toHaveBeenCalled();
  });
});
