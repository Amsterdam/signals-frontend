import React from 'react';
import { FormattedMessage } from 'react-intl';

import LocaleToggle from 'containers/LocaleToggle';
import messages from './messages';

function Footer() {
  return (
    <div className="footer-component">
      <section>
        <FormattedMessage {...messages.licenseMessage} />
      </section>
      <section>
        <LocaleToggle />
      </section>
      <section>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            author: <a href="https://data.amsterdam.nl/">Amsterdam City Data (Datapunt)</a>,
          }}
        />
      </section>
    </div>
  );
}

export default Footer;
