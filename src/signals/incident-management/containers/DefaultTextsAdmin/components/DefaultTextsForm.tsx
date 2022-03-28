// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { FC, SyntheticEvent } from 'react'
import type { FormArray } from 'react-reactive-form'

import { Button, Label, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { ChevronDown, ChevronUp } from '@amsterdam/asc-assets'
import styled from 'styled-components'

import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper'
import TextInput from 'signals/incident-management/components/TextInput'
import TextAreaInput from 'signals/incident-management/components/TextAreaInput'

import Checkbox from 'components/Checkbox'

const StyledLeftColumn = styled.div`
  display: inline-block;
  width: 70%;
  margin-right: 5%;
  vertical-align: top;
  padding-bottom: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(6)};
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
`

const StyledRightColumn = styled.div`
  display: inline-block;
  width: 10%;
  vertical-align: top;
`

const StyledButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level7')};

  & + button:not([disabled]) {
    margin-top: -1px;
  }
`

const StyledLabel = styled(Label)`
  font-weight: 400;
`

type DefaultTextsFormProps = {
  item: string
  index: number
  itemsLength: number
  form: FormArray
  onCheck: (item: string, checkedValue: boolean) => void
  changeOrdering: (e: SyntheticEvent, index: number, direction: string) => void
}

const DefaultTextsForm: FC<DefaultTextsFormProps> = ({
  item,
  index,
  itemsLength,
  form,
  onCheck,
  changeOrdering,
}) => {
  const checkedValue = form.get(`${item}.is_active`).value
  return (
    <>
      <StyledLeftColumn data-testid={`defaultTextFormForm${index}`}>
        <FieldControlWrapper
          placeholder="Titel"
          render={TextInput}
          name={`title${index}`}
          control={form.get(`${item}.title`)}
        />

        <FieldControlWrapper
          placeholder="Tekst"
          render={TextAreaInput}
          name={`text${index}`}
          control={form.get(`${item}.text`)}
        />

        <StyledLabel
          htmlFor={`formis_active${index}`}
          label="Actief"
          data-testid={`is_active${index}`}
        >
          <Checkbox
            checked={checkedValue}
            name={`is_active${index}`}
            id={`formis_active${index}`}
            onChange={() => onCheck(item, checkedValue)}
            value={checkedValue}
          />
        </StyledLabel>
      </StyledLeftColumn>
      <StyledRightColumn>
        <StyledButton
          size={44}
          variant="blank"
          data-testid={`defaultTextFormItemButton${index}Up`}
          disabled={index === 0 || !form.get(`${item}.text`).value}
          iconSize={16}
          icon={<ChevronUp />}
          onClick={(e) => changeOrdering(e, index, 'up')}
        />
        <StyledButton
          size={44}
          variant="blank"
          data-testid={`defaultTextFormItemButton${index}Down`}
          disabled={
            index === itemsLength - 1 ||
            !form.get(`item${index + 1}.text`).value
          }
          iconSize={16}
          icon={<ChevronDown />}
          onClick={(e) => changeOrdering(e, index, 'down')}
        />
      </StyledRightColumn>
    </>
  )
}

export default DefaultTextsForm
