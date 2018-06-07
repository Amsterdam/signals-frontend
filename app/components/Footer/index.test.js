import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import Footer from './index';
import './style.scss';

describe('<Footer />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent.contains(
      <section>
        <FormattedMessage {...messages.licenseMessage} />
      </section>
    )).toBe(true);
  });

  it('should render the credits', () => {
    const renderedComponent = shallow(<Footer />);
    expect(renderedComponent.contains(
      <section>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            author: <a href="https://data.amsterdam.nl/">Amsterdam City Data (Datapunt)</a>,
          }}
        />
      </section>
    )).toBe(true);
  });
});
