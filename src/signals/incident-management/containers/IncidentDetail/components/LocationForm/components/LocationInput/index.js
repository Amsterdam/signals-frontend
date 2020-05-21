import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import FormFooter from 'components/FormFooter';

import MapContext from 'containers/MapContext/context';
import { FormControl } from 'react-reactive-form';
import FieldControlWrapper from '../../../../../../components/FieldControlWrapper';
import MapInput from '../../../../../../components/MapInput';

const LocationInput = ({ onQueryResult, locationControl, onClose, handleSubmit }) => {
  const {
    state: { loading },
  } = useContext(MapContext);

  return (
    <form data-testid="locationForm">
      <FieldControlWrapper control={locationControl} name="location" onQueryResult={onQueryResult} render={MapInput} />

      <FormFooter
        cancelBtnLabel="Annuleren"
        inline
        onCancel={onClose}
        onSubmitForm={handleSubmit}
        canSubmitForm={!loading}
        submitBtnLabel="Locatie opslaan"
      />
    </form>
  );
};

LocationInput.propTypes = {
  locationControl: PropTypes.shape(FormControl).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onQueryResult: PropTypes.func.isRequired,
};

export default LocationInput;
