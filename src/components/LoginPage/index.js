import React from 'react';

import { login } from 'shared/services/auth/auth';

import './style.scss';


const LoginPage = () => (
  <div className="login-page">
    <div className="notification notification-red margin-top-bottom">
      <div className="col-12">
        <p>
          Om deze pagina te zien dient u ingelogd te zijn.
        </p>
        <button className="action primary" onClick={() => { login('datapunt'); }}>
          <span className="value">Inloggen</span>
        </button>
        <button className="action primary" onClick={() => { login('grip'); }}>
          <span className="value">Inloggen ADW</span>
        </button>
      </div>
    </div>
  </div>
);

export default LoginPage;
