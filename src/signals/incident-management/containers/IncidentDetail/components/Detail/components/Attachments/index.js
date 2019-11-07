import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui';

import { attachmentsType } from 'shared/types';

const StyledDL = styled.dl`
  margin: 0;
`;

const StyledDefinition = styled.dt`
  font-weight: normal;
  width: 25%;
  display: inline-block;
  color: ${themeColor('tint', 'level5')};

  margin: 0;
  vertical-align: top;
  padding: ${themeSpacing(2)} 0;
`;

const StyledValue = styled.dd`
  width: 75%;
  display: inline-block;

  margin: 0;
  vertical-align: top;
  padding: ${themeSpacing(2)} 0;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  margin-right: 10px;
  background-size: cover;
  border: 1px solid ${themeColor('tint', 'level3')} !important;
`;

const Attachments = ({ attachments, onShowAttachment }) => (
  <StyledDL>
    {attachments.length
      ? (
        <dl>
          <StyledDefinition
            data-testid="attachmentsDefinition"
          >Foto</StyledDefinition>
          <StyledValue>
            {attachments.map(attachment => (
              <StyledButton
                key={attachment.location}
                size={80}
                variant="blank"
                data-testid="attachmentsValueButton"
                onClick={() => onShowAttachment(attachment.location)}
                style={{ backgroundImage: `url(${attachment.location})` }}
              />
            ))}
          </StyledValue>
        </dl>
      )
      : ''}

  </StyledDL>
);

Attachments.propTypes = {
  attachments: attachmentsType.isRequired,
  onShowAttachment: PropTypes.func.isRequired,
};

export default Attachments;
