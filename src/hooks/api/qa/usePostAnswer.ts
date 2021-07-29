import useFetch from 'hooks/useFetch'
import { Answer } from 'types/api/qa/answer'

export const usePostAnswer = () => useFetch<Answer>()
