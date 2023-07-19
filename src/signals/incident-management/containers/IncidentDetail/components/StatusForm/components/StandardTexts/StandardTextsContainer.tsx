import type { SyntheticEvent } from 'react'

import type { StandardText as StandardTextType } from 'types/api/standard-texts'
import type { StatusCode } from 'types/status-code'

import { StandardTexts } from './StandardTexts'
import { StandardTextsButton } from '../../styled'

export interface Props {
  closeStandardTextModal: () => void
  modalStandardTextIsOpen: boolean
  openStandardTextModal: (event: SyntheticEvent) => void
  status: StatusCode
  standardTexts: {
    results: StandardTextType[]
  }
  useStandardText: (event: SyntheticEvent, text: string) => void
}

const StandardTextsContainer = ({
  openStandardTextModal,
  status,
  modalStandardTextIsOpen,
  useStandardText,
  closeStandardTextModal,
  standardTexts,
}: Props) => {
  const activeTexts = standardTexts.results.filter((text) => text.active)

  const textsByStatus = activeTexts.filter((text) => text.state === status)

  return (
    <>
      <StandardTextsButton
        data-testid="standard-text-button-v2"
        variant="primaryInverted"
        onClick={openStandardTextModal}
        templatesAvailable={!!textsByStatus.length}
      >
        <div>{`Standaardtekst (${textsByStatus.length})`}</div>
      </StandardTextsButton>

      {modalStandardTextIsOpen && (
        <StandardTexts
          standardTexts={textsByStatus}
          onHandleUseStandardText={useStandardText}
          status={status}
          onClose={closeStandardTextModal}
        />
      )}
    </>
  )
}

export default StandardTextsContainer
