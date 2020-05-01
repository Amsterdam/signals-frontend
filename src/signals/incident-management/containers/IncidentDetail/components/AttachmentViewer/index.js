import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, themeSpacing, themeColor } from '@datapunt/asc-ui';
import { ChevronRight, ChevronLeft } from '@datapunt/asc-assets';
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

const AttachmentViewer = ({ href, attachments, onShowAttachment }) => {
  const index = attachments.findIndex(item => item.location === href);
  const previous = index > 0 ? attachments[index - 1].location : false;
  const next = index < attachments.length - 1 ? attachments[index + 1].location : false;

  const handleKeyDown = useCallback(
    event => {
      switch (event.key) {
        case 'ArrowLeft':
          if (previous) onShowAttachment(previous);
          break;

        case 'ArrowRight':
          if (next) onShowAttachment(next);
          break;

        default:
          break;
      }
    },
    [next, previous, onShowAttachment]
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
    <Wrapper>
      {previous && (
        <PreviousButton
          data-testid="attachment-viewer-button-previous"
          icon={<ChevronLeft />}
          onClick={() => onShowAttachment(previous)}
        />
      )}

      {next && (
        <NextButton
          data-testid="attachment-viewer-button-next"
          icon={<ChevronRight />}
          onClick={() => onShowAttachment(next)}
        />
      )}

      <Img src={href} data-testid="attachment-viewer-image" alt="uploaded afbeelding" />
    </Wrapper>
  );
};

AttachmentViewer.propTypes = {
  href: PropTypes.string.isRequired,
  attachments: attachmentsType.isRequired,

  onShowAttachment: PropTypes.func.isRequired,
};

export default AttachmentViewer;
