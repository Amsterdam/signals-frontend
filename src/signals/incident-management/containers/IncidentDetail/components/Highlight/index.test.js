import React from 'react';
import { render, wait, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Highlight, { HIGHLIGHT_TIMEOUT_INTERVAL } from './index';

describe('<Highlight />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  it('should render all children that are passed in', async () => {
    const string = 'foo';
    const { findByTestId } = render(
      withAppContext(
        <Highlight subscribeTo={string}>
          <div data-testid="highlight-child">some text</div>
        </Highlight>
      )
    );

    const child = await findByTestId('highlight-child');

    expect(child).toBeInTheDocument();
  });

  it(`should highlight the container when the value has changed and de-highlight after ${HIGHLIGHT_TIMEOUT_INTERVAL} msecs`, async () => {
    const { container, queryByTestId, rerender } = render(
      withAppContext(
        <Highlight subscribeTo="foo">
          <div>some text</div>
        </Highlight>
      )
    );
    expect(queryByTestId('highlight')).not.toHaveClass('active');

    rerender(
      withAppContext(
        <Highlight subscribeTo="changed" valueChanged>
          <div>some text</div>
        </Highlight>
      )
    );

    await wait(() => container.querySelector('.highlight'));

    act(() => {
      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL - 1);
    });

    expect(queryByTestId('highlight')).toHaveClass('active');

    act(() => {
      jest.runTimersToTime(1);
    });

    expect(queryByTestId('highlight')).not.toHaveClass('active');
  });
});
