import type { FunctionComponent } from 'react';
import React from 'react';
import TextArea from 'components/TextArea';

import type { FormMeta, FormOptions, ReactiveFormMeta } from 'types/reactive-form';
import Header from '../Header';


type PickedProps = 'handler' | 'touched' | 'hasError' | 'getError';
export interface TextAreaInputProps<T=string> extends Pick<ReactiveFormMeta, PickedProps> {
  meta?: FormMeta;
  validatorsOrOpts?: FormOptions;
  parent: {
    meta: {
      updateIncident: (data: any) => void;
    };
  };
  value: T;
}

const TextareaInput: FunctionComponent<TextAreaInputProps> = ({
  handler,
  touched,
  value,
  hasError,
  getError,
  meta,
  parent,
  validatorsOrOpts,
}) =>
  (meta?.isVisible && (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <TextArea
        id={meta.name}
        aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={event => {
          parent.meta.updateIncident({
            [meta.name]: meta.autoRemove ? event.target.value.replace(meta.autoRemove, '') : event.target.value,
          });
        }}
        infoText={meta.maxLength && `${value ? value.length : '0'}/${meta.maxLength} tekens`}
      />
    </Header>
  )) ||
  null;
export default TextareaInput;
