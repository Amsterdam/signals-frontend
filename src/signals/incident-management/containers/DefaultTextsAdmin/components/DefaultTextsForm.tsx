// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { ChangeEvent, FC, SyntheticEvent } from 'react'

import { Button, Label, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { ChevronDown, ChevronUp } from '@amsterdam/asc-assets'
import styled from 'styled-components'
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

type Value = { title: string; text: string; is_active: boolean }

type DefaultTextsFormProps = {
  item: string
  index: number
  itemsLength: number
  value: Value
  nextValue: Value
  setValue: (key: string, value: Value) => void
  changeOrdering: (e: SyntheticEvent, index: number, direction: string) => void
}

const DefaultTextsForm: FC<DefaultTextsFormProps> = ({
  item,
  index,
  value,
  nextValue,
  setValue,
  itemsLength,
  changeOrdering,
}) => {
  const checkedValue = value.is_active
  const setDisabled = !value.text || !value.title
  return (
    <>
      <StyledLeftColumn data-testid={`defaultTextFormForm${index}`}>
        <TextInput
          display={''}
          name={`title${index}`}
          value={value.title}
          placeholder={'Titel'}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(item, { ...value, title: e.target.value })
          }
        />

        <TextAreaInput
          display={''}
          name={`text${index}`}
          value={value.text}
          placeholder="Tekst"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setValue(item, { ...value, text: e.target.value })
          }
        />

        <StyledLabel
          htmlFor={`formis_active${index}`}
          disabled={setDisabled}
          label="Actief"
        >
          <Checkbox
            data-testid={`is_active${index}`}
            checked={checkedValue}
            name={`is_active${index}`}
            id={`formis_active${index}`}
            onChange={() =>
              setValue(item, { ...value, is_active: !value.is_active })
            }
          />
        </StyledLabel>
      </StyledLeftColumn>
      <StyledRightColumn>
        <StyledButton
          size={44}
          variant="blank"
          data-testid={`defaultTextFormItemButton${index}Up`}
          disabled={index === 0 || !value.text}
          iconSize={16}
          icon={<ChevronUp />}
          onClick={(e) => changeOrdering(e, index, 'up')}
        />
        <StyledButton
          size={44}
          variant="blank"
          data-testid={`defaultTextFormItemButton${index}Down`}
          disabled={index === itemsLength - 1 || !nextValue?.text}
          iconSize={16}
          icon={<ChevronDown />}
          onClick={(e) => changeOrdering(e, index, 'down')}
        />
      </StyledRightColumn>
    </>
  )
}

export default DefaultTextsForm
