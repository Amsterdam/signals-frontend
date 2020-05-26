import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';

import { locationType } from 'shared/types';
import { PATCH_TYPE_LOCATION } from 'models/incident/constants';
import MapContext from 'containers/MapContext';

import { mapLocation } from 'shared/services/map-location';
import LocationInput from './components/LocationInput';

const LocationForm = ({ incidentId, location, onPatchIncident, onClose }) => {
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

      onPatchIncident({
        id: incidentId,
        type: PATCH_TYPE_LOCATION,
        patch: { location: form.value.location },
      });

      onClose();
    },
    [onPatchIncident, form.value, incidentId, onClose]
  );

  return (
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
  );
};

LocationForm.propTypes = {
  incidentId: PropTypes.number.isRequired,
  location: locationType.isRequired,
  onClose: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default LocationForm;
