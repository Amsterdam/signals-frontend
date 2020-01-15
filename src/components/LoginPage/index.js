import React from 'react';
import { Row, Column } from '@datapunt/asc-ui';
import { login } from 'shared/services/auth/auth';

const LoginPage = () => (
  <Row data-testid="loginPage">
    <Column span={12}>
      <div className="notification notification-red margin-top-bottom">
        <p>Om deze pagina te zien dient u ingelogd te zijn.</p>
        <button
          className="action primary"
          onClick={() => {
            login('datapunt');
          }}
          type="button"
        >
          <span className="value">Inloggen</span>
        </button>
        <button
          className="action primary"
          onClick={() => {
            login('grip');
          }}
          type="button"
        >
          <span className="value">Inloggen ADW</span>
        </button>
      </div>
    </Column>
  </Row>
);

export default LoginPage;
