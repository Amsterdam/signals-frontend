import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import historyJSON from 'utils/__tests__/fixtures/history.json';
import History from '.';


describe('<History />', () => {
  let props;

  beforeEach(() => {
    props = {
      list: historyJSON,
    };
  });

  describe('rendering', () => {
    it('should render all items when list is defined', () => {
      const { getByText } = render(
        withAppContext(<History {...props} />)
      );

      props.list.forEach(item => {
        expect(getByText(item.who)).toBeInTheDocument();
        expect(getByText(item.action)).toBeInTheDocument();

        if (item.description) {
          expect(getByText(item.description)).toBeInTheDocument();
        }
      });
    });

    it('should render empty when no list is defined', () => {
      props.list = [];
      const { container } = render(
        withAppContext(<History {...props} />)
      );

      expect(container.firstChild).not.toBeInTheDocument();
    });
  });
});
