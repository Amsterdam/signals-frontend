import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import FormFooter from 'components/FormFooter';

import { incidentType } from 'shared/types';
import { PATCH_TYPE_LOCATION } from 'models/incident/constants';

import { mapLocation } from 'shared/services/map-location';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import MapInput from '../../../../components/MapInput';
import HiddenInput from '../../../../components/HiddenInput';

const LocationForm = ({ incident, onPatchIncident, onClose }) => {
  const form = useMemo(
    () =>
      FormBuilder.group({
        coordinates: [incident.location.geometrie.coordinates.join(','), Validators.required],
        location: incident.location,
      }),
    [incident.location]
  );

  const onQueryResult = useCallback(
    value => {
      const newLocation = mapLocation(value);
      const coordinates = newLocation.geometrie.coordinates.join(',');

      form.controls.location.setValue(newLocation);
      form.controls.coordinates.setValue(coordinates);
    },
    [form.controls.coordinates, form.controls.location]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      const location = form.controls.location.value;

      onPatchIncident({
        id: incident.id,
        type: PATCH_TYPE_LOCATION,
        patch: { location },
      });

      onClose();
    },
    [onPatchIncident, form.controls.location.value, incident.id, onClose]
  );

  return (
    <FieldGroup
      control={form}
      render={() => (
        <form data-testid="locationForm">
          <FieldControlWrapper
            control={form.get('coordinates')}
            display="Coordinates"
            name="coordinates"
            render={HiddenInput}
          />

          <FieldControlWrapper
            control={form.get('location')}
            name="location"
            onQueryResult={onQueryResult}
            render={MapInput}
          />

          <FormFooter
            cancelBtnLabel="Annuleren"
            inline
            onCancel={onClose}
            onSubmitForm={handleSubmit}
            submitBtnLabel="Locatie opslaan"
          />
        </form>
      )}
    />
  );
};

LocationForm.propTypes = {
  incident: incidentType.isRequired,
  onClose: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default LocationForm;
