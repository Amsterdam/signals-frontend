import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AttachmentViewer from './index';

describe('<AttachmentViewer />', () => {
  const props = {
    attachments: [
      {
        _display: 'Attachment object (678)',
        _links: {
          self: {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3087/attachments'
          }
        },
        location: 'https://objectstore.eu/mock/image/1',
        is_image: true,
        created_at: '2019-08-05T08:19:16.372476+02:00'
      },
      {
        _display: 'Attachment object (679)',
        _links: {
          self: {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3087/attachments'
          }
        },
        location: 'https://objectstore.eu/mock/image/2',
        is_image: true,
        created_at: '2019-08-05T08:19:17.205236+02:00'
      },
      {
        _display: 'Attachment object (680)',
        _links: {
          self: {
            href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3087/attachments'
          }
        },
        location: 'https://objectstore.eu/mock/image/3',
        is_image: true,
        created_at: '2019-08-05T08:19:18.389461+02:00'
      }
    ],
    onShowAttachment: jest.fn()
  };

  describe('rendering', () => {
    it('on page 1 it should render the correct image and only next button', () => {
      const href = 'https://objectstore.eu/mock/image/1';
      const { queryByTestId, queryAllByTestId } = render(
        <AttachmentViewer {...props} href={href} />
      );

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(0);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(1);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });

    it('on page 2 it should render the correct image and both previous and next button', () => {
      const href = 'https://objectstore.eu/mock/image/2';
      const { queryByTestId, queryAllByTestId } = render(
        <AttachmentViewer {...props} href={href} />
      );

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(1);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(1);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });

    it('on page 3 it should render the correct image and only previous button', () => {
      const href = 'https://objectstore.eu/mock/image/3';
      const { queryByTestId, queryAllByTestId } = render(
        <AttachmentViewer {...props} href={href} />
      );

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(1);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(0);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });
  });

  describe('events', () => {
    it('should trigger opening previous image', () => {
      const { queryByTestId } = render(
        <AttachmentViewer {...props} href="https://objectstore.eu/mock/image/2" />
      );
      fireEvent.click(queryByTestId('attachment-viewer-button-previous'));

      expect(props.onShowAttachment).toHaveBeenCalledWith('https://objectstore.eu/mock/image/1');
    });

    it('should trigger opening next image', () => {
      const { queryByTestId } = render(
        <AttachmentViewer {...props} href="https://objectstore.eu/mock/image/2" />
      );
      fireEvent.click(queryByTestId('attachment-viewer-button-next'));

      expect(props.onShowAttachment).toHaveBeenCalledWith('https://objectstore.eu/mock/image/3');
    });
  });
});
