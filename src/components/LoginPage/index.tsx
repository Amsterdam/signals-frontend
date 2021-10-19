// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  Row,
  Column,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'

import Button from 'components/Button'
import ButtonBar from 'components/ButtonBar'
import { useDispatch } from 'react-redux'
import { doLogin } from 'containers/App/actions'

const Notification = styled.div`
  border-left: 3px solid ${themeColor('secondary')};
  margin: ${themeSpacing(6)} 0;
  padding-left: ${themeSpacing(5)};
`

const LoginPage = () => {
  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(doLogin())
  }

  return (
    <Row data-testid="loginPage">
      <Column span={12}>
        <Notification>
          <Paragraph>
            Om deze pagina te zien dient u ingelogd te zijn.
          </Paragraph>

          <ButtonBar>
            <Button
              variant="secondary"
              data-testid="loginButton"
              onClick={handleLogin}
              type="button"
            >
              <span>Inloggen</span>
            </Button>
          </ButtonBar>
        </Notification>
      </Column>
    </Row>
  )
}

export default LoginPage
