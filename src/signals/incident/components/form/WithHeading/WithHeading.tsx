import type { FC } from 'react'
import type { FormMeta, FormOptions } from 'types/reactive-form'

import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

type WrapMeta = FormMeta & {
  heading?: string
  wrappedComponent?: FC
}

type WithHeadingProps = FormOptions & {
  meta: WrapMeta
  _parent?: any
  parent?: any
}

const StyledHeading = styled(Heading)`
  font-weight: 500;
  margin: ${themeSpacing(2, 0, 5)};
`

const WithHeading: FC<WithHeadingProps> = (props) => {
  const { wrappedComponent, heading } = props.meta

  if (!wrappedComponent || !heading) return null

  const Component = wrappedComponent

  const propsWithParent = {
    ...props,
    parent: props._parent ? props._parent : props.parent,
  }

  return (
    <div>
      <StyledHeading as="h2">{heading}</StyledHeading>
      <Component {...propsWithParent} />
    </div>
  )
}

export default WithHeading
