import React, { useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Column } from '@datapunt/asc-ui';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import { useDispatch } from 'react-redux';

import { PATCH_TYPE_LOCATION } from 'models/incident/constants';
import MapContext from 'containers/MapContext';
import { patchIncident } from 'models/incident/actions';

import { mapLocation } from 'shared/services/map-location';
import LocationInput from './components/LocationInput';
import IncidentDetailContext from '../../context';

const StyledColumn = styled(Column)`
  display: block;
  background: white;
  position: relative;
`;

const LocationForm = ({ onClose }) => {
  const {
    incident: { id, location },
  } = useContext(IncidentDetailContext);
  const dispatch = useDispatch();

  const form = useMemo(
    () =>
      FormBuilder.group({
        location,
      }),
    [location]
  );

  const onQueryResult = useCallback(
    value => {
      const newLocation = mapLocation(value);

      form.controls.location.setValue(newLocation);
    },
    [form.controls.location]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      dispatch(
        patchIncident({
          id,
          type: PATCH_TYPE_LOCATION,
          patch: { location: form.value.location },
        })
      );

      onClose();
    },
    [dispatch, form.value, id, onClose]
  );

  return (
    <Row>
      <StyledColumn span={12}>
        <FieldGroup
          control={form}
          render={() => (
            <MapContext>
              <LocationInput
                locationControl={form.get('location')}
                onClose={onClose}
                onQueryResult={onQueryResult}
                handleSubmit={handleSubmit}
              />
            </MapContext>
          )}
        />
      </StyledColumn>
    </Row>
  );
};

LocationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LocationForm;
