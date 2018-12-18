import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError, makeSelectCategories } from 'containers/App/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import makeSelectOverviewPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestIncidents, incidentSelected } from './actions';
import Filter from './components/Filter';
import ListComponent from './components/List';
import Pager from './components/Pager';

export class IncidentOverviewPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestIncidents({});
  }

  render() {
    const { incidents, loading, filter, incidentsCount, page, sort, ...rest } = this.props.overviewpage;
    return (
      <div className="overview-page">
        <div className="row">
          <div className="col-3">
            <Filter
              onRequestIncidents={this.props.onRequestIncidents}
              categories={this.props.categories}
              filter={filter}
              {...rest}
            />
          </div>
          <div className="col-9">
            {loading ? (<LoadingIndicator />) : (
              <div>
                <ListComponent
                  incidentSelected={this.props.onIncidentSelected}
                  incidents={incidents}
                  onRequestIncidents={this.props.onRequestIncidents}
                  sort={sort}
                  incidentsCount={incidentsCount}
                  {...rest}
                />

                <Pager
                  incidentsCount={incidentsCount}
                  page={page}
                  onRequestIncidents={this.props.onRequestIncidents}
                />
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}

IncidentOverviewPage.propTypes = {
  overviewpage: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,
  categories: PropTypes.object.isRequired,

  onRequestIncidents: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
  onMainCategoryFilterSelectionChanged: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  categories: makeSelectCategories(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncidents: requestIncidents,
  onIncidentSelected: incidentSelected
}, dispatch);


const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentOverviewPage', reducer });
const withSaga = injectSaga({ key: 'incidentOverviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentOverviewPage);
