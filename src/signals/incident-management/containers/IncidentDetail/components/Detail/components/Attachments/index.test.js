import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Attachments from '.';

describe('<Attachments />', () => {
  let props;

  beforeEach(() => {
    props = {
      attachments: [
        {
          location: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape_3.jpg?temp_url_sig=96364a8c62ff29d18135b929c86533bea63179b0&temp_url_expires=1564671767',
        },
        {
          location: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape_2.jpg?temp_url_sig=fb4dd645ead47becc77e521e651fc3a5c4a2adb5&temp_url_expires=1564671767',
        },
        {
          location: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape.jpg?temp_url_sig=fcc774586a87496aec433c61eea802f27df45664&temp_url_expires=1564671767',
        },
      ],
      onShowAttachment: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render all attachments when they are defined', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <Attachments {...props} />
      );

      expect(queryByTestId('attachmentsDefinition')).toHaveTextContent(/^Foto$/);
      expect(queryAllByTestId('attachmentsValueButton')).toHaveLength(3);

      expect(queryAllByTestId('attachmentsValueButton')[0]).toHaveStyle(`background-image: url(${props.attachments[0].location})`);
    });

    it('should render empty list when no attachments are defined', () => {
      props.attachments = [];
      const { queryByTestId, queryAllByTestId } = render(
        <Attachments {...props} />
      );

      expect(queryByTestId('attachmentsDefinition')).toBeNull();
      expect(queryAllByTestId('attachmentsValueButton')).toHaveLength(0);
    });
  });

  describe('events', () => {
    it('should trigger opening the attachment', () => {
      const { queryAllByTestId } = render(
        <Attachments {...props} />
      );
      fireEvent.click(queryAllByTestId('attachmentsValueButton')[0]);

      expect(props.onShowAttachment).toHaveBeenCalledWith(props.attachments[0].location);
    });
  });
});
