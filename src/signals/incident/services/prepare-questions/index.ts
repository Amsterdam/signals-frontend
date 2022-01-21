import type { Question } from 'types/question'
import { QuestionFieldType } from 'types/question'

interface PrepareQuestionsParams {
  category: string
  expandQuestions: (
    questions: Record<string, Question>,
    category?: string,
    subcategory?: string
  ) => Record<string, unknown>
  locatie: Question
  questions?: Record<string, Question>
  subcategory: string
}

export const prepareQuestions = ({
  category,
  expandQuestions,
  locatie,
  questions,
  subcategory,
}: PrepareQuestionsParams) => {
  const backendQuestions = questions || {}
  const hasQuestions = Object.keys(backendQuestions).length > 0
  const hasAssetSelect =
    hasQuestions &&
    Object.values(backendQuestions).some(
      (question) => question.render === QuestionFieldType.AssetSelect
    )
  const backendQuestionsToExpand =
    hasQuestions && hasAssetSelect
      ? questions
      : {
          locatie,
          ...questions,
        }

  return hasQuestions
    ? expandQuestions(backendQuestionsToExpand, category, subcategory)
    : expandQuestions({ locatie })
}
