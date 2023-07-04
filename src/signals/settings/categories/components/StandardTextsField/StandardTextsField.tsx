// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { ChevronDown, ChevronUp } from '@amsterdam/asc-assets'
import { useParams } from 'react-router-dom'

import Select from 'components/Select'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type { StandardText } from 'types/api/standard-texts'

import {
  ButtonWrapper,
  DefaultTextBody,
  StyledButton,
  TextWrapper,
  Wrapper,
} from './styled'
import { changeStatusOptionList } from '../../../../incident-management/definitions/statusList'
import { Direction } from '../../types'
import { orderStandardTexts } from '../utils'

type Props = {
  name: string
  onChange: (standardTexts: StandardText[]) => void
}

export const StandardTextsField = ({ name, onChange }: Props) => {
  const params = useParams<{ categoryId: string }>()
  const { get, data } = useFetch<{ results: StandardText[] }>()
  const [selectedStatus, setSelectedStatus] = useState<string>(
    changeStatusOptionList[0].value
  )
  const [orderedStandardTexts, setOrderedStandardTexts] = useState<
    StandardText[]
  >([])

  useEffect(() => {
    get(
      `${configuration.STANDARD_TEXTS_ENDPOINT}?ordering=statusmessagecategory__position&category_id=10&category_id=${params.categoryId}`
    )
  }, [get, params.categoryId])

  const updatePosition = useCallback(
    (index: number, direction: Direction) => {
      const orderedTexts = orderStandardTexts(
        direction,
        index,
        orderedStandardTexts
      )

      if (orderedTexts) {
        setOrderedStandardTexts([...orderedTexts])
        onChange(orderedTexts)
      }
    },
    [onChange, orderedStandardTexts]
  )
  useEffect(() => {
    if (data?.results) {
      const state = changeStatusOptionList.find(
        (status) => status.value === selectedStatus
      )?.key

      const orderedStandardTexts = data.results.filter(
        (result) => result.state === state
      )
      setOrderedStandardTexts(orderedStandardTexts)
    }
  }, [data, selectedStatus])

  const options = changeStatusOptionList.map((status) => ({
    name: status.value,
    value: status.value,
    key: status.key,
  }))

  return (
    <div>
      <Select
        name={name}
        id="standardTexts"
        data-testid="standardTexts"
        onChange={(e: FormEvent<HTMLSelectElement>) =>
          setSelectedStatus(e.currentTarget.value)
        }
        options={options}
        value={selectedStatus}
      />

      {orderedStandardTexts.map((standardText, index) => {
        return (
          <Wrapper key={standardText.id}>
            <TextWrapper>
              <span data-testid="text-title">{index + 1}</span>
              <div>
                <span>{standardText.title}</span>
                <DefaultTextBody>{standardText.text}</DefaultTextBody>
              </div>
            </TextWrapper>
            <ButtonWrapper>
              <StyledButton
                type="button"
                data-testid="up-button"
                size={44}
                variant="blank"
                disabled={index === 0}
                iconSize={16}
                icon={<ChevronUp />}
                onClick={() => updatePosition(index, Direction.Up)}
              />
              <StyledButton
                type="button"
                data-testid="down-button"
                size={44}
                variant="blank"
                disabled={index === orderedStandardTexts.length - 1}
                iconSize={16}
                icon={<ChevronDown />}
                onClick={() => updatePosition(index, Direction.Down)}
              />
            </ButtonWrapper>
          </Wrapper>
        )
      })}
    </div>
  )
}
