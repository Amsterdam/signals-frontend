import { useCallback } from 'react'
import type { SyntheticEvent } from 'react'

import type { DefaultTexts as DefaultTextsType } from 'types/api/default-text'
import type { StatusCode } from 'types/status-code'

import DefaultTexts from './DefaultTexts'
import { StandardTextsButton } from '../../styled'

export interface Props {
  closeDefaultTextModal: () => void
  defaultTexts: DefaultTextsType
  modalDefaultTextIsOpen: boolean
  openDefaultTextModal: (event: SyntheticEvent) => void
  status: StatusCode
  useDefaultText: (event: SyntheticEvent, text: string) => void
}

const DefaultTextsContainer = ({
  closeDefaultTextModal,
  defaultTexts,
  modalDefaultTextIsOpen,
  openDefaultTextModal,
  status,
  useDefaultText,
}: Props) => {
  const activeDefaultTexts = defaultTexts?.map((defaultText) => {
    const templates = defaultText.templates.filter(
      (template) => template.is_active
    )
    return {
      ...defaultText,
      templates,
    }
  })

  const defaultTextTemplatesLength = useCallback(
    (defaultTexts: DefaultTextsType) => {
      if (!defaultTexts || defaultTexts.length === 0) {
        return 0
      }
      const statusDefaultTexts = defaultTexts.filter(
        (text) => text.state === status
      )
      return statusDefaultTexts[0] ? statusDefaultTexts[0].templates?.length : 0
    },
    [status]
  )

  return (
    <>
      <StandardTextsButton
        data-testid="standard-text-button-v1"
        variant="primaryInverted"
        onClick={openDefaultTextModal}
        templatesAvailable={defaultTextTemplatesLength(activeDefaultTexts) > 0}
      >
        <div>{`Standaardtekst (${defaultTextTemplatesLength(
          activeDefaultTexts
        )})`}</div>
      </StandardTextsButton>

      {modalDefaultTextIsOpen && (
        <DefaultTexts
          defaultTexts={activeDefaultTexts}
          onHandleUseDefaultText={useDefaultText}
          status={status}
          onClose={closeDefaultTextModal}
        />
      )}
    </>
  )
}

export default DefaultTextsContainer
