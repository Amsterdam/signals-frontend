/**
 *
 * MapContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import AMaps from 'components/AMaps';
import { getGeoName } from './actions';
import makeSelectMapContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';


export class MapContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getGeo = this.getGeo.bind(this);
  }

  getGeo(data) {
    this.props.getGeoName(data.latlng);
    this.interval = setInterval(() => {
      if (!this.props.mapcontainer.isLoading) {
        clearInterval(this.interval);
        this.props.onLocationChange(this.props.mapcontainer.location, this.props.mapcontainer.latlng);
      }
    }, 30);
  }


  render() {
    return (
      <AMaps getGeo={this.getGeo} isLoading={this.props.mapcontainer.isLoading} {...this.props} />
    );
  }
}

MapContainer.propTypes = {
  getGeoName: PropTypes.func.isRequired,
  mapcontainer: PropTypes.shape({
    isLoading: PropTypes.bool,
    location: PropTypes.string,
    latlng: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    })
  }),
  onLocationChange: PropTypes.func,
};

export const mapStateToProps = createStructuredSelector({
  mapcontainer: makeSelectMapContainer(),
});

export function mapDispatchToProps(dispatch) {
  return {
    getGeoName: (latlng) => dispatch(getGeoName(latlng)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'mapContainer', reducer });
const withSaga = injectSaga({ key: 'mapContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MapContainer);
