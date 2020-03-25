import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import History from './index';


describe('<History />', () => {
  let props;

  beforeEach(() => {
    props = {
      list: [
        {
          identifier: 'UPDATE_STATUS_6686',
          when: '2019-07-31T15:10:28.696413+02:00',
          what: 'UPDATE_STATUS',
          action: 'Update status naar: Gesplitst',
          description: 'Deze melding is opgesplitst.',
          who: 'steve@apple.com',
        },
        {
          identifier: 'UPDATE_PRIORITY_3790',
          when: '2019-07-26T11:51:50.275505+02:00',
          what: 'UPDATE_PRIORITY',
          action: 'Prioriteit update naar: Normal',
          description: null,
          who: 'SIA systeem',
        },
        {
          identifier: 'UPDATE_CATEGORY_ASSIGNMENT_3996',
          when: '2019-07-26T11:51:50.273841+02:00',
          what: 'UPDATE_CATEGORY_ASSIGNMENT',
          action: 'Categorie gewijzigd naar: Geluidsoverlast installaties',
          description: null,
          who: 'Foo bar baz',
        },
      ],
    };
  });

  afterEach(cleanup);

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
