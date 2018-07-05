/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import Map from 'components/Map';

import messages from './messages';
import reducer from './reducer';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      latlng: {}
    };

    this.onMapAction = this.onMapAction.bind(this);
  }

  onMapAction(location, latlng) {
    this.setState({
      location,
      latlng
    });
  }

  render() {
    return (
      <article>
        <div>
          <h2>
            <FormattedMessage {...messages.startProjectHeader} />
          </h2>
          <p>
            <FormattedMessage {...messages.startProjectMessage} />
          </p>
        </div>
        <div>
          <Map onLocationChange={this.onMapAction} location={this.state.location} latlng={this.state.latlng} />
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
};

export function mapDispatchToProps() {
  return {
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(
  withReducer,
  withConnect,
)(HomePage);
