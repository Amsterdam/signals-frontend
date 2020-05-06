import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import AttachmentViewer from './index';

describe('<AttachmentViewer />', () => {
  const props = {
    attachments: [
      {
        _display: 'Attachment object (678)',
        location: 'https://objectstore.eu/mock/image/1',
        is_image: true,
        created_at: '2019-08-05T08:19:16.372476+02:00',
      },
      {
        _display: 'Attachment object (679)',
        location: 'https://objectstore.eu/mock/image/2',
        is_image: true,
        created_at: '2019-08-05T08:19:17.205236+02:00',
      },
      {
        _display: 'Attachment object (680)',
        location: 'https://objectstore.eu/mock/image/3',
        is_image: true,
        created_at: '2019-08-05T08:19:18.389461+02:00',
      },
    ],
  };

  describe('rendering', () => {
    it('on page 1 it should render the correct image and only next button', () => {
      const href = 'https://objectstore.eu/mock/image/1';
      const { queryByTestId, queryAllByTestId } = render(<AttachmentViewer {...props} href={href} />);

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(0);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(1);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });

    it('on page 2 it should render the correct image and both previous and next button', () => {
      const href = 'https://objectstore.eu/mock/image/2';
      const { queryByTestId, queryAllByTestId } = render(<AttachmentViewer {...props} href={href} />);

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(1);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(1);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });

    it('on page 3 it should render the correct image and only previous button', () => {
      const href = 'https://objectstore.eu/mock/image/3';
      const { queryByTestId, queryAllByTestId } = render(<AttachmentViewer {...props} href={href} />);

      expect(queryAllByTestId('attachment-viewer-button-previous')).toHaveLength(1);
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(0);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', href);
    });
  });

  describe('events', () => {
    it('should navigate on click', () => {
      const { queryByTestId } = render(<AttachmentViewer {...props} href={props.attachments[1].location} />);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[1].location);

      act(() => {
        fireEvent.click(queryByTestId('attachment-viewer-button-previous'));
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[0].location);

      expect(queryByTestId('attachment-viewer-button-previous')).not.toBeInTheDocument();

      act(() => {
        fireEvent.click(queryByTestId('attachment-viewer-button-next'));
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[1].location);

      act(() => {
        fireEvent.click(queryByTestId('attachment-viewer-button-next'));
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[2].location);

      expect(queryByTestId('attachment-viewer-button-next')).not.toBeInTheDocument();
    });

    it('should navigate on key press', () => {
      const { queryByTestId } = render(<AttachmentViewer {...props} href={props.attachments[1].location} />);

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[1].location);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft', code: 37, keyCode: 37 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[0].location);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft', code: 37, keyCode: 37 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[0].location);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowRight', code: 39, keyCode: 39 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[1].location);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowRight', code: 39, keyCode: 39 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[2].location);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowRight', code: 39, keyCode: 39 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', props.attachments[2].location);
    });

    it('should not navigate on keypress ', () => {
      const { queryByTestId } = render(<AttachmentViewer {...props} href={props.attachments[1].location} />);

      const initialSrc = props.attachments[1].location;

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', initialSrc);

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowUp', code: 38, keyCode: 38 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', initialSrc);
    });

    it('should not navigate on keypress when another element in the tree has the focus', () => {
      const { queryByTestId } = render(
        <div>
          <input data-testid="input" />
          <AttachmentViewer {...props} href={props.attachments[1].location} />
        </div>
      );

      const initialSrc = props.attachments[1].location;

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', initialSrc);

      act(() => {
        fireEvent.keyDown(queryByTestId('input'), { key: 'ArrowLeft', code: 37, keyCode: 37 });
      });

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute('src', initialSrc);
    });
  });
});
