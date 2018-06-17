import React from 'react';
import './style.scss';

import LogoSvg from '../../../node_modules/stijl/dist/images/logos/andreas.svg';
import LogoPng from '../../../node_modules/stijl/dist/images/logos/andreas.png';
import LogoPrint from '../../../node_modules/stijl/dist/images/logos/andreas-print.png';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header-component">
<<<<<<< HEAD
        <div className="row">
          <div className="col-6">
            <h1 className="sitelogo">
              <a className="mainlogo" href="https://www.amsterdam.nl">
                <span className="logoset">
                  <img src={LogoSvg} className="screen-logo" alt="Gemeente Amsterdam" />
                  <img src={LogoPng} className="alt-logo" alt="Gemeente Amsterdam" />
                  <img src={LogoPrint} className="print-logo" alt="Gemeente Amsterdam" />
                </span>
                <span className="logotexts">
                  <span className="logotext red">Gemeente</span>
                  <span className="logotext red">Amsterdam</span>
                </span>
              </a>
            </h1>
          </div>
          <div className="col-6 type-nav-secundair ">
            <nav>
              <ul className="links horizontal right ">
                <li>
                </li>
              </ul>
            </nav>
          </div>
        </div>
=======
        <h1>Signalen</h1>
        <Link to="/">
          <FormattedMessage {...messages.home} />
        </Link>
        <Link to="/features">
          <FormattedMessage {...messages.features} />
        </Link>
        <Link to="/incident">
          <FormattedMessage {...messages.incident} />
        </Link>
        <Link to="/admin/incidents">
          <FormattedMessage {...messages.admin} />
        </Link>
>>>>>>> add: navigation to incident detail
      </div>
    );
  }
}

export default Header;
