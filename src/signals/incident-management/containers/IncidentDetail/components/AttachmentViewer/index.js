import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, themeSpacing, themeColor } from '@amsterdam/asc-ui';
import { ChevronRight, ChevronLeft } from '@amsterdam/asc-assets';
import { attachmentsType } from 'shared/types';

const IconButton = styled(Button).attrs({
  size: 32,
  iconSize: 16,
  variant: 'application',
})``;

const PreviousButton = styled(IconButton)`
  position: absolute;
  left: 10px;
  top: calc(50% - ${themeSpacing(4)});
`;

const NextButton = styled(IconButton)`
  position: absolute;
  right: 10px;
  top: calc(50% - ${themeSpacing(4)});
`;

const Wrapper = styled.div`
  position: relative;
  text-align: center;
  background-color: ${themeColor('tint', 'level2')};
  height: 722px;
  display: flex;
`;

const Img = styled.img`
  max-height: 722px;
  max-width: 100%;
  align-self: center;
  margin: 0 auto;
`;

const AttachmentViewer = ({ href, attachments }) => {
  const wrapperRef = useRef(null);
  const [currentHref, setCurrentHref] = useState(href);
  const index = attachments.findIndex(item => item.location === currentHref);
  const previous = index > 0 ? attachments[index - 1].location : false;
  const next = index < attachments.length - 1 ? attachments[index + 1].location : false;

  const handleKeyDown = useCallback(
    event => {
      const refInTarget = event.target.contains(wrapperRef.current);

      if (!refInTarget) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (previous) {
            setCurrentHref(previous);
          }

          break;

        case 'ArrowRight':
          if (next) {
            setCurrentHref(next);
          }

          break;

        default:
          break;
      }
    },
    [next, previous]
  );

  /**
   * Register and unregister listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Wrapper ref={wrapperRef}>
      {previous && (
        <PreviousButton
          data-testid="attachment-viewer-button-previous"
          icon={<ChevronLeft />}
          onClick={() => setCurrentHref(previous)}
        />
      )}

      {next && (
        <NextButton
          data-testid="attachment-viewer-button-next"
          icon={<ChevronRight />}
          onClick={() => setCurrentHref(next)}
        />
      )}

      <Img src={currentHref} data-testid="attachment-viewer-image" alt={attachments[index]._display} />
    </Wrapper>
  );
};

AttachmentViewer.propTypes = {
  /** Current image's href */
  href: PropTypes.string.isRequired,
  /** List of attachments */
  attachments: attachmentsType.isRequired,
};

export default AttachmentViewer;
