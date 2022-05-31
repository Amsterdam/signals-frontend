// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose, bindActionCreators } from 'redux'
import { Row, Column } from '@amsterdam/asc-ui'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'

import { useLocation } from 'react-router-dom'
import wizardDefinition from '../../definitions/wizard'
import IncidentClassification from '../../components/IncidentClassification'
import {
  getClassification,
  updateIncident,
  createIncident,
  removeQuestionData,
  addToSelection,
  removeFromSelection,
} from './actions'
import { makeSelectIncidentContainer } from './selectors'
import reducer from './reducer'
import saga from './saga'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const IncidentWizard = lazy(() => import('../../components/IncidentWizard'))

export const IncidentContainerComponent = ({
  createIncidentAction,
  getClassificationAction,
  incidentContainer,
  updateIncidentAction,
  addToSelectionAction,
  removeFromSelectionAction,
  removeQuestionDataAction,
}) => {
  const { pathname } = useLocation()
  const presetClassification = pathname.startsWith('/categorie')

  return (
    <Row>
      <Column span={12}>
        {presetClassification ? (
          <IncidentClassification />
        ) : (
          <Suspense>
            <IncidentWizard
              wizardDefinition={wizardDefinition}
              getClassification={getClassificationAction}
              updateIncident={updateIncidentAction}
              addToSelection={addToSelectionAction}
              removeFromSelection={removeFromSelectionAction}
              createIncident={createIncidentAction}
              incidentContainer={incidentContainer}
              removeQuestionData={removeQuestionDataAction}
              getIsAuthenticated={getIsAuthenticated()}
            />
          </Suspense>
        )}
      </Column>
    </Row>
  )
}

IncidentContainerComponent.propTypes = {
  createIncidentAction: PropTypes.func.isRequired,
  getClassificationAction: PropTypes.func.isRequired,
  incidentContainer: PropTypes.object.isRequired,
  updateIncidentAction: PropTypes.func.isRequired,
  addToSelectionAction: PropTypes.func.isRequired,
  removeFromSelectionAction: PropTypes.func.isRequired,
  removeQuestionDataAction: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createIncidentAction: createIncident,
      getClassificationAction: getClassification,
      updateIncidentAction: updateIncident,
      addToSelectionAction: addToSelection,
      removeFromSelectionAction: removeFromSelection,
      removeQuestionDataAction: removeQuestionData,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

const withReducer = injectReducer({ key: 'incidentContainer', reducer })
const withSaga = injectSaga({ key: 'incidentContainer', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(IncidentContainerComponent)
