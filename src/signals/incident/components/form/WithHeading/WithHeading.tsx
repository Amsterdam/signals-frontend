import type { FC } from 'react'
import type { FormMeta, FormOptions } from 'types/reactive-form'

import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

type WrapMeta = FormMeta & {
  heading?: string
  wrap?: FC
}

type WithHeadingProps = FormOptions & { meta: WrapMeta }

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(2, 0, 5)};
`

const WithHeading: FC<WithHeadingProps> = (props) => {
  const { wrap, heading } = props.meta

  if (!wrap || !heading) return null

  const InputComponent = wrap

  return (
    <>
      <StyledHeading as="h2">{heading}</StyledHeading>
      <InputComponent {...props} />
    </>
  )
}

export default WithHeading
