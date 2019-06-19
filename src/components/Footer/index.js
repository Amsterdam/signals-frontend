import React from 'react';

import './style.scss';

function Footer() {
  return (
    <div className="footer-wrapper no-print">
      <div className="row bg-darkgrey footer">
        <footer className="container footer-component">
          <div className="row">
            <div className="col-12">
              <h2>
                Lukt het niet om een melding te doen?
              </h2>
              <p>
                Bel het Gemeentelijk informatienummer: 14 020 <br />
                op werkdagen van 08.00 tot 18.00 uur.
              </p>
            </div>
          </div>
        </footer>
      </div>
      <div className="container grid-below-footer">
        <div className="row">
          <div className="col-12">
            <nav>
              <ul className="links horizontal left">
                <li>
                  <a href="https://www.amsterdam.nl/privacy/">
                    <span className="linklabel">
                      Privacy
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
