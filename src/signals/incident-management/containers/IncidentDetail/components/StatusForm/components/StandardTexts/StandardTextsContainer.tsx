import type { SyntheticEvent } from 'react'

import type { StandardText as StandardTextType } from 'types/api/standard-texts'

import { StandardTexts } from './StandardTexts'
import type { State } from '../../reducer'
import { StandardTextsButton } from '../../styled'

export interface Props {
  closeStandardTextModal: () => void
  modalStandardTextIsOpen: boolean
  openStandardTextModal: (event: SyntheticEvent) => void
  state: State
  standardTexts: {
    results: StandardTextType[]
  }
  useStandardText: (event: SyntheticEvent, text: string) => void
}

const StandardTextsContainer = ({
  openStandardTextModal,
  state,
  modalStandardTextIsOpen,
  useStandardText,
  closeStandardTextModal,
  standardTexts,
}: Props) => {
  if (!standardTexts) return null

  const activeTexts = standardTexts.results.filter((text) => text.active)

  const textByStatus = activeTexts.filter(
    (text) => text.state === state.status.key
  )

  return (
    <>
      <StandardTextsButton
        data-testid="standard-text-button"
        variant="primaryInverted"
        onClick={openStandardTextModal}
        templatesAvailable={!!textByStatus.length}
      >
        <div>{`Standaardtekst (${textByStatus.length})`}</div>
      </StandardTextsButton>

      {modalStandardTextIsOpen && (
        <StandardTexts
          standardTexts={textByStatus}
          onHandleUseStandardText={useStandardText}
          status={state.status.key}
          onClose={closeStandardTextModal}
        />
      )}
    </>
  )
}

export default StandardTextsContainer
