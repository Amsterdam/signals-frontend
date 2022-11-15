import type { ReactElement } from 'react'
import { Fragment } from 'react'

import TopicLabel from '../../signals/incident-management/components/TopicLabel'
import type { Option } from '../../types/form'

type Props = {
  options: Option[]
  option: Option
  index: number
  children: ReactElement
}

export const WithTopic = ({ options, option, index, children }: Props) => {
  if (options.some((option) => option.topic)) {
    return (
      <Fragment key={option.key || option.name + '-fragment'}>
        {options.findIndex((option2) => option2.topic === option.topic) ===
          index && <TopicLabel>{option.topic}</TopicLabel>}
        {children}
      </Fragment>
    )
  }
  return children
}
