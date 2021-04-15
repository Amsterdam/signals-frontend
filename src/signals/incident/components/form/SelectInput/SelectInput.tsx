// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react';
import React from 'react';

import Select from 'components/Select';

import Header from '../Header';

import type { FormInputProps } from 'types/reactive-form';

export type SelectInputProps = FormInputProps<{ id: string } | undefined>;

// This types will be obsolete when the components/Select will be converted to typescript
type SelectType = React.ForwardRefExoticComponent<React.RefAttributes<any> & Record<string, any>> ;
const TypedSelect = Select as SelectType;
export interface SelectChangeEventType { target: { value: string; selectedIndex: number } & Record<number, { text: string }> }

const SelectInput: FunctionComponent<SelectInputProps> = ({
  handler,
  touched,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) => (meta?.isVisible && (
  <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
    <TypedSelect
      id={meta.name}
      aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
      name={meta.name}
      value={`${(handler().value as { id: string }).id}`}
      onChange={(event: SelectChangeEventType) => {
        parent.meta.updateIncident({
          [meta.name]: {
            id: event.target.value,
            label: event.target[event.target.selectedIndex].text,
          },
        });
      }}
      options={
        (meta.values
          ? (meta.values as Record<string, string>[]).map(value => {
            const [id, label] = Object.entries(value)[0];
            return { key: id, name: label, value: id };
          })
          : []) as any[]
      }
    />
  </Header>
)) ||
  null;

export default SelectInput;
