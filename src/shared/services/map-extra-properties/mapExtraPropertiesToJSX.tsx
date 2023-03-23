import type {
  Answer,
  CheckboxInput,
  ContainerMapInput,
  LegacyAnswer,
  MultiCheckboxInput,
} from 'shared/types/extraProperties'
import { NEARBY_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

export const mapExtraPropertiesToJSX = (
  answer: Answer | LegacyAnswer
): string | JSX.Element[] => {
  if (Array.isArray(answer)) {
    const cleanAnswer = answer.filter((i) => i)
    return cleanAnswer.map((item) => {
      if (typeof item === 'string') {
        return <div key={item}>{item}</div>
      }

      if ((item as ContainerMapInput)?.type) {
        const containerAnswer = item as ContainerMapInput

        if (containerAnswer.type === NEARBY_TYPE) {
          return <></>
        }

        return (
          <div key={containerAnswer.id}>
            {[containerAnswer.description, containerAnswer.id]
              .filter(Boolean)
              .join(' - ')}
          </div>
        )
      }

      const multiCheckboxAnswer = item as MultiCheckboxInput

      return <div key={multiCheckboxAnswer.id}>{multiCheckboxAnswer.label}</div>
    })
  }

  if (typeof answer !== 'string') {
    if (answer === null || answer === undefined) {
      return ''
    }

    if (typeof (answer as CheckboxInput).value === 'boolean') {
      return (answer as CheckboxInput).value ? answer.label : 'Nee'
    }

    return answer.label
  }

  return answer
}
