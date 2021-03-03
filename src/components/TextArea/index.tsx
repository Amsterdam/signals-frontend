import type { ReactNode } from 'react';
import React, { Fragment, forwardRef } from 'react';
import styled from 'styled-components';
import type { TextAreaProps as AscTextAreaProps } from '@amsterdam/asc-ui/es/components/TextArea';
import { themeColor, themeSpacing, TextArea as AscTextArea } from '@amsterdam/asc-ui';

import Label from 'components/Label';

import ErrorMessage from '../ErrorMessage';

const lineHeight = 22;

const StyledArea = styled(AscTextArea)<{ rows?: number; maxRows?: number }>`
  font-family: inherit;
  vertical-align: top; /* https://stackoverflow.com/questions/7144843/extra-space-under-textarea-differs-along-browsers */
  min-height: ${({ rows }) => (rows ?? 5) * lineHeight}px;
  resize: vertical;
  max-height: ${({ maxRows = 15 }) => maxRows * lineHeight}px;
  line-height: ${lineHeight}px;
`;

const InfoText = styled.div`
  color: ${themeColor('tint', 'level5')};
  margin-top: ${themeSpacing(2)};
`;

interface TextAreaProps extends AscTextAreaProps {
  id?: string;
  label?: ReactNode;
  infoText?: ReactNode;
  errorMessage?: string;
  rows?: number;
  maxRows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ infoText, errorMessage, label, id = '', className = '', ...props }, ref) => (
    <Fragment>
      {label && (
        <Label inline htmlFor={id}>
          {label}
        </Label>
      )}
      <StyledArea id={id} className={className} {...props} ref={ref} />
      {infoText && <InfoText>{infoText}</InfoText>}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </Fragment>
  )
);

export default TextArea;
