// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Fragment, useCallback } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import { postMessage } from 'containers/App/actions'

import LinkButton from '../LinkButton'
import { Wrapper, StyledButton } from './styled'

export interface Props {
  meta: {
    title: string
    labelCloseButton: string
    labelLinkButton: string
    hrefLinkButton: string
  }
}

/**
 * Button to facilitate closing the application when in 'appMode'.
 */
const AppNavigation = ({ meta }: Props) => {
  const dispatch = useDispatch()

  const linkButtonMeta = {
    label: meta.labelLinkButton,
    href: meta.hrefLinkButton,
  }

  const handleClose = useCallback(() => {
    dispatch(postMessage('close'))
  }, [dispatch])

  return (
    <Fragment>
      <Heading as="h2" styleAs="h3">
        {meta.title}
      </Heading>
      <Wrapper>
        <LinkButton meta={linkButtonMeta} />
        <StyledButton
          variant="primaryInverted"
          onClick={handleClose}
          type="button"
        >
          {meta.labelCloseButton}
        </StyledButton>
      </Wrapper>
    </Fragment>
  )
}

const AppNavigationWrapper = (props: Props) => <AppNavigation {...props} />

export default AppNavigationWrapper
