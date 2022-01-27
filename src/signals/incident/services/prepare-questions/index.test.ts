import { QuestionFieldType } from 'types/question'
import locatie from '../../definitions/wizard-step-2-vulaan/locatie'
import { prepareQuestions } from '.'

const returnValue = 'returnValue'
const expandQuestions = jest.fn().mockReturnValue(returnValue)
const category = 'category'
const subcategory = 'subcategory'

describe('The prepare questions service', () => {
  beforeEach(() => {
    expandQuestions.mockClear()
  })

  it('should work with questions undefined', () => {
    const questions = undefined
    expect(
      prepareQuestions({
        category,
        expandQuestions,
        questions,
        subcategory,
      })
    ).toEqual(returnValue)
    expect(expandQuestions).toHaveBeenCalledTimes(1)
    expect(expandQuestions).toHaveBeenCalledWith({ locatie })
  })

  it('should call fn with location only when no questions given', () => {
    const questions = {}
    expect(
      prepareQuestions({
        category,
        expandQuestions,
        questions,
        subcategory,
      })
    ).toEqual(returnValue)
    expect(expandQuestions).toHaveBeenCalledTimes(1)
    expect(expandQuestions).toHaveBeenCalledWith({ locatie })
  })

  it('should call fn with location and questions when no asset select questions given', () => {
    const questions = {
      key1: {
        meta: { label: 'Label' },
        render: QuestionFieldType.TextInput,
        required: true,
      },
    }
    expect(
      prepareQuestions({
        category,
        expandQuestions,
        questions,
        subcategory,
      })
    ).toEqual(returnValue)
    expect(expandQuestions).toHaveBeenCalledTimes(1)
    expect(expandQuestions).toHaveBeenCalledWith(
      { locatie, ...questions },
      category,
      subcategory
    )
  })

  it('should call fn with only questions when asset select questions given', () => {
    const questions = {
      key1: {
        meta: { label: 'Label' },
        render: QuestionFieldType.AssetSelect,
        required: true,
      },
    }
    expect(
      prepareQuestions({
        category,
        expandQuestions,
        questions,
        subcategory,
      })
    ).toEqual(returnValue)
    expect(expandQuestions).toHaveBeenCalledTimes(1)
    expect(expandQuestions).toHaveBeenCalledWith(
      questions,
      category,
      subcategory
    )
  })
})
