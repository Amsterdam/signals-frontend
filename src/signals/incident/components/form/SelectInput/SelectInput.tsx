// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type {
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
} from 'react'

import FormField from 'components/FormField'
import Select from 'components/Select'
import type { FormInputProps } from 'types/reactive-form'

export type SelectInputProps = FormInputProps<{ id: string } | undefined>

// This types will be obsolete when the components/Select will be converted to typescript
type SelectType = ForwardRefExoticComponent<
  RefAttributes<any> & Record<string, any>
>
const TypedSelect = Select as SelectType
export interface SelectChangeEventType {
  target: { value: string; selectedIndex: number } & Record<
    number,
    { text: string }
  >
}

const SelectInput: FunctionComponent<SelectInputProps> = ({
  handler,
  hasError,
  meta,
  parent,
  getError,
  validatorsOrOpts,
}) =>
  (meta?.isVisible && (
    <FormField
      meta={meta}
      options={validatorsOrOpts}
      hasError={hasError}
      getError={getError}
    >
      <TypedSelect
        id={meta.name}
        aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
        name={meta.name}
        value={`${(handler().value as { id: string }).id}`}
        onChange={(event: SelectChangeEventType) => {
          meta.name &&
            parent.meta.updateIncident({
              [meta.name]: {
                id: event.target.value,
                label: event.target[event.target.selectedIndex].text,
              },
            })
        }}
        options={
          (meta.values
            ? (meta.values as Record<string, string>[]).map((value) => {
                const [id, label] = Object.entries(value)[0]
                return { key: id, name: label, value: id }
              })
            : []) as any[]
        }
      />
    </FormField>
  )) ||
  null

export default SelectInput
