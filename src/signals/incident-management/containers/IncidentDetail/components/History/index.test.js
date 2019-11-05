import React from 'react';
import { render, cleanup } from '@testing-library/react';

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
          who: 'SIA systeem',
        },
      ],
    };
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render all items when list is defined', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <History {...props} />
      );

      expect(queryByTestId('history-title')).toHaveTextContent(/^Geschiedenis$/);
      expect(queryAllByTestId('history-list-item')).toHaveLength(3);

      expect(queryAllByTestId('history-list-item-when')[0]).toHaveTextContent(/^31-07-2019 om 15:10$/);
      expect(queryAllByTestId('history-list-item-who')[0]).toHaveTextContent(/^steve@apple.com$/);
      expect(queryAllByTestId('history-list-item-action')[0]).toHaveTextContent(/^Update status naar: Gesplitst$/);
      expect(queryAllByTestId('history-list-item-description')[0]).toHaveTextContent(/^Deze melding is opgesplitst\.$/);
    });

    it('should render empty when no list is defined', () => {
      props.list = [];
      const { queryByTestId, queryAllByTestId } = render(
        <History {...props} />
      );

      expect(queryByTestId('history-title')).toHaveTextContent(/^Geschiedenis$/);
      expect(queryAllByTestId('history-list-item')).toHaveLength(0);
    });
  });
});
