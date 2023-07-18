import { useCallback } from 'react'
import type { SyntheticEvent } from 'react'

import type { DefaultTexts as DefaultTextsType } from 'types/api/default-text'

import DefaultTexts from './DefaultTexts'
import type { State } from '../../reducer'
import { StandardTextsButton } from '../../styled'

interface Props {
  closeStandardTextModal: () => void
  defaultTexts: DefaultTextsType
  modalStandardTextIsOpen: boolean
  openStandardTextModal: (event: SyntheticEvent) => void
  state: State
  useDefaultText: (event: SyntheticEvent, text: string) => void
}

const DefaultTextsContainer = ({
  openStandardTextModal,
  state,
  modalStandardTextIsOpen,
  useDefaultText,
  closeStandardTextModal,
  defaultTexts,
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
        (text) => text.state === state.status.key
      )
      return statusDefaultTexts[0] ? statusDefaultTexts[0].templates?.length : 0
    },
    [state.status.key]
  )

  return (
    <>
      <StandardTextsButton
        data-testid="standard-text-button"
        variant="primaryInverted"
        onClick={openStandardTextModal}
        templatesAvailable={defaultTextTemplatesLength(activeDefaultTexts) > 0}
      >
        <div>{`Standaardtekst (${defaultTextTemplatesLength(
          activeDefaultTexts
        )})`}</div>
      </StandardTextsButton>

      {modalStandardTextIsOpen && (
        <DefaultTexts
          defaultTexts={activeDefaultTexts}
          onHandleUseDefaultText={useDefaultText}
          status={state.status.key}
          onClose={closeStandardTextModal}
        />
      )}
    </>
  )
}

export default DefaultTextsContainer
