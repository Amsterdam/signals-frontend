/**
*
* AdminComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import OverviewPage from '../containers/OverviewPage/Loadable';
import IncidentDetailPage from '../containers/IncidentDetailPage/Loadable';
// import NotFoundPage from '../../../containers/NotFoundPage';

import './style.scss';

const AdminComponent = ({ match }) => {
  const baseUrl = match.url;
  const IncidentDetailPageWrapper = ({ match }) => (<IncidentDetailPage id={match.params.id} baseUrl={baseUrl} />);
  const OverviewPageWrapper = () => (<OverviewPage baseUrl={baseUrl} />);

  return (
    <div className="admin-component">
      <FormattedMessage {...messages.header} />
      <Link to={`${baseUrl}/incident/185`}>Test open incident with link</Link>
      <div>
        {/* <Route
          exact
          path={`${baseUrl}`}
          render={<Redirect to={`${baseUrl}/incidents`} />}
        ></Route>*/}

        <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
        <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
        {/* <Route path="" component={NotFoundPage} /> */}
      </div>
      {/* </BrowserRouter> */}
    </div>
  );
};

AdminComponent.propTypes = {
  match: PropTypes.object
};


export default AdminComponent;
