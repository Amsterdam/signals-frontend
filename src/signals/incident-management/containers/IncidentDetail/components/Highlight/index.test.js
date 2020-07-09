import React from 'react';
import { render, cleanup } from '@testing-library/react';

import Highlight, { HIGHLIGHT_TIMEOUT_INTERVAL } from '.';

describe('<Highlight />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    cleanup();
  });

  describe('rendering', () => {
    it('should render all children that are passed in', () => {
      const string = 'foo';
      const { queryAllByTestId } = render(
        <Highlight subscribeTo={string}><div data-testid="highlight-child">some text</div></Highlight>
      );

      expect(queryAllByTestId('highlight-child')).toHaveLength(1);
    });
  });

  describe('events', () => {
    it(`should highlight the container when the value has changed and de-highlight after ${HIGHLIGHT_TIMEOUT_INTERVAL} msecs`, () => {
      const { queryByTestId, rerender } = render(
        <Highlight subscribeTo="foo"><div>some text</div></Highlight>
      );
      expect(queryByTestId('highlight')).not.toHaveClass('highlight--active');

      rerender(
        <Highlight subscribeTo="changed"><div>some text</div></Highlight>
      );

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL - 1);
      expect(queryByTestId('highlight')).toHaveClass('highlight--active');

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL);
      expect(queryByTestId('highlight')).not.toHaveClass('highlight--active');
    });
  });
});
