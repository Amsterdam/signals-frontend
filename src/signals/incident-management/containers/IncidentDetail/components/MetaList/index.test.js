import React from 'react';
import { render } from '@testing-library/react';

import MetaList from './index';

jest.mock('../../components/Highlight', () => () => <div data-testid="meta-list-highlight" />);

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: {
        created_at: '',
        state: {
          status: 'm'
        }
      },
      subcategories: [],
      priorityList: [],
      onPatchIncident: jest.fn(),
      onEditStatus: jest.fn(),
      onShowAttachment: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render all attachments when they are defined', () => {
      const { queryByTestId } = render(
        <MetaList {...props} />
      );

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      // expect(queryAllByTestId('attachments-value-button')).toHaveLength(3);
//
      // expect(queryAllByTestId('attachments-value-button')[0]).toHaveStyle(`background-image: url(${props.attachments[0].location})`);
    });
  });

  describe('events', () => {
    it('should trigger opening the attachment', () => {
      // const { queryAllByTestId } = render(
        // <MetaList {...props} />
      // );
      // fireEvent.click(queryAllByTestId('attachments-value-button')[0]);
//
      // expect(props.onShowAttachment).toHaveBeenCalledWith(props.attachments[0].location);
    });
  });
});
