import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui';

import { attachmentsType } from 'shared/types';

const StyledDefinition = styled.dt`
  font-weight: normal;
  color: ${themeColor('tint', 'level5')};

  margin: 0;
  vertical-align: top;
  padding: ${themeSpacing(2)} 0;
`;

const StyledValue = styled.dd`
  margin: 0;
  vertical-align: top;
  padding: ${themeSpacing(2)} 0;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  margin-right: 10px;
  background-size: cover;
  border: 1px solid ${themeColor('tint', 'level3')} !important;
  background-image: url(${({ url }) => url});
`;

const Attachments = ({ attachments, onShowAttachment }) =>
  attachments?.length > 0 && (
    <Fragment>
      <StyledDefinition data-testid="attachmentsDefinition">Foto</StyledDefinition>
      <StyledValue>
        {attachments.map(attachment => (
          <StyledButton
            data-testid="attachmentsValueButton"
            key={attachment.location}
            onClick={() => onShowAttachment(attachment.location)}
            size={80}
            url={attachment.location}
            variant="blank"
            type="image"
          />
        ))}
      </StyledValue>
    </Fragment>
  );

Attachments.propTypes = {
  attachments: attachmentsType.isRequired,
  onShowAttachment: PropTypes.func.isRequired,
};

export default Attachments;
