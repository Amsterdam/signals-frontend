import React from 'react';
import { render } from '@testing-library/react';
import { run } from 'test/utils';

import Highlight, { HIGHLIGHT_TIMEOUT_INTERVAL } from './index';


describe('<Highlight />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  describe('rendering', () => {
    it('should render all children that are passed in', () => {
      const string = 'foo';
      const { queryByTestId, queryAllByTestId } = render(
        <Highlight subscribeTo={string}><div data-testid="highlight-child">some text</div></Highlight>
      );

      expect(queryAllByTestId('highlight-child')).toHaveLength(1);
      expect(queryByTestId('highlight')).not.toHaveClass('highlight--active');
    });
  });

  describe('events', () => {
    it('should highlight the container when the value has changed and de-highlight after 3 seconds', () => {
      const { container } = render(
        <Highlight subscribeTo="foo"><div>some text</div></Highlight>
      );

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL - 1);
      run(() => {
        const { queryByTestId } = render(<Highlight subscribeTo="bar"><div>some text</div></Highlight>, { container });

        expect(queryByTestId('highlight')).toHaveClass('highlight--active');
      });

      jest.runTimersToTime(HIGHLIGHT_TIMEOUT_INTERVAL);
      run(() => {
        const { queryByTestId } = render(<Highlight subscribeTo="bar"><div>some text</div></Highlight>, { container });
        expect(queryByTestId('highlight')).not.toHaveClass('highlight--active');
      });
    });
  });
});
