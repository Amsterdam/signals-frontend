import React from 'react';
import { Row, Column } from '@datapunt/asc-ui';

import { login } from 'shared/services/auth/auth';

import Button from 'components/Button';
import ButtonBar from 'components/ButtonBar';

const LoginPage = () => (
  <Row data-testid="loginPage">
    <Column span={12}>
      <div className="notification notification-red margin-top-bottom">
        <p>Om deze pagina te zien dient u ingelogd te zijn.</p>
        <ButtonBar>
          <Button
            variant="secondary"
            onClick={() => {
              login('datapunt');
            }}
            type="button"
          >
            <span className="value">Inloggen</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              login('grip');
            }}
            type="button"
          >
            <span className="value">Inloggen ADW</span>
          </Button>
        </ButtonBar>
      </div>
    </Column>
  </Row>
);

export default LoginPage;
