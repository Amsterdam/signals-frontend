import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import messages from './messages';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header-component">
        <h1>Signalen</h1>
        <Link to="/">
          <FormattedMessage {...messages.home} />
        </Link>
        <Link to="/features">
          <FormattedMessage {...messages.features} />
        </Link>
        <Link to="/admin">
          <FormattedMessage {...messages.admin} />
        </Link>
      </div>
    );
  }
}

export default Header;
