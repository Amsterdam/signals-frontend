import type { FetchError } from 'hooks/useFetch'

import type { FormData, OptionMapped } from './types'

const mergeAnswers = (
  object: Record<string, string>,
  array: string[]
): string[] => {
  const resultArray = [...array]

  Object.entries(object).forEach(([key, value]) => {
    const index = resultArray.indexOf(key)
    if (index !== -1) {
      resultArray.splice(index + 1, 0, value)
    }
  })

  return resultArray
}

export const getMergedOpenAnswers = (object: FormData): FormData => {
  const openAnswerPairs: Record<string, any> = {}
  const objectWithoutOpenAnswers = {} as FormData

  Object.entries(object).forEach(([key, value]) => {
    if (key.startsWith('open_answer-')) {
      const newKey = key.replace('open_answer-', '')
      openAnswerPairs[newKey] = value
    } else {
      objectWithoutOpenAnswers[key] = value
    }
  })

  const mergedAnswers = mergeAnswers(
    openAnswerPairs,
    objectWithoutOpenAnswers.text_list
  )

  return { ...objectWithoutOpenAnswers, text_list: mergedAnswers }
}

export const sortByTopic = (array: OptionMapped[]) => {
  return array.sort((a, b) => {
    if (a.topic === null && b.topic === null) {
      return 0
    } else if (a.topic === null) {
      return -1
    } else if (b.topic === null) {
      return 1
    } else {
      return 0
    }
  })
}

export const isFetchError = (
  error?: boolean | FetchError
): error is FetchError => {
  return (error as FetchError).detail !== undefined
}
