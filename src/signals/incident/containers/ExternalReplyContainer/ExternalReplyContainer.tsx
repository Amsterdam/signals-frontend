// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Vereniging van Nederlandse Gemeenten
import { useState } from 'react'

import { Column } from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'

import AttachmentViewer from 'components/AttachmentViewer'
import CloseButton from 'components/CloseButton'
import LoadingIndicator from 'components/LoadingIndicator'

import ExplanationSection from './components/ExplanationSection'
import Location from './components/Location'
import {
  StyledHeading,
  Wrapper,
  Map,
  MapRow,
  QuestionnaireRow,
  StyledExplanationSection,
} from './styled'
import useExternalReplyQuestionnaire from './useExternalReplyQuestionnaire'
import Notice from '../../components/ReplyForm/Notice'
import QuestionnaireComponent from '../../components/ReplyForm/Questionnaire'

type Params = {
  /** Questionnaire session id  */
  id: string
}

const ExternalReplyContainer = () => {
  const { id } = useParams<Params>()
  const [showMap, setShowMap] = useState(false)
  const [selectedAttachmentViewerImage, setSelectedAttachmentViewerImage] =
    useState('')

  const {
    explanation,
    isFetchingQuestionnaire,
    isSubmittingForm,
    location,
    questions,
    questionnaireErrorMessage,
    submitQuestionnaireSuccessMessage,
    submit,
    attachments,
  } = useExternalReplyQuestionnaire(id as string)

  if (questionnaireErrorMessage) {
    return (
      <Notice
        title={questionnaireErrorMessage.title}
        content={questionnaireErrorMessage.content}
      />
    )
  }

  if (submitQuestionnaireSuccessMessage) {
    return (
      <Notice
        title={submitQuestionnaireSuccessMessage.title}
        content={submitQuestionnaireSuccessMessage.content}
      />
    )
  }

  if (isFetchingQuestionnaire || isSubmittingForm) return <LoadingIndicator />
  if (!explanation || !questions) return null

  return (
    <>
      <QuestionnaireRow hidden={showMap}>
        <Column span={8}>
          <Wrapper>
            <StyledHeading>{explanation.title}</StyledHeading>

            <StyledExplanationSection
              title={explanation.sections[0].header}
              text={explanation.sections[0].text}
            />

            {/* show location between first and second explanation section */}
            {location && (
              <Location location={location} onClick={() => setShowMap(true)} />
            )}

            {explanation.sections.slice(1).map((section) => (
              <ExplanationSection
                key={section.header}
                title={section.header}
                text={section.text}
                files={section.files}
                onSelectFile={({ file }) =>
                  setSelectedAttachmentViewerImage(file)
                }
              />
            ))}

            <QuestionnaireComponent onSubmit={submit} questions={questions} />
          </Wrapper>
        </Column>
      </QuestionnaireRow>

      {showMap && location && (
        <MapRow data-testid="interactive-map">
          <Map value={{ geometrie: location.geometrie }} />
          <CloseButton close={() => setShowMap(false)} />
        </MapRow>
      )}

      {selectedAttachmentViewerImage && (
        <AttachmentViewer
          attachments={attachments}
          href={selectedAttachmentViewerImage}
          onClose={() => setSelectedAttachmentViewerImage('')}
        />
      )}
    </>
  )
}

export default ExternalReplyContainer
