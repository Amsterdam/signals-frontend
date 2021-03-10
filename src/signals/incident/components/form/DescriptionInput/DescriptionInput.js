import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';
import DescriptionInfo from '../DescriptionInfo';

const DescriptionInput = ({ handler, value, meta, parent }) => {
  const getCharactersInfo = useCallback(
    () => meta.maxLength > 0 && `${value ? value.length : '0'}/${meta.maxLength} tekens`,
    [value, meta.maxLength]
  );

  const handleBlur = useCallback(
    event => {
      const {
        getClassification,
        updateIncident,
        incidentContainer: { usePredictions },
      } = parent.meta;

      if (usePredictions && event.target.value) {
        getClassification(event.target.value);
      }

      updateIncident({ [meta.name]: event.target.value });
    },
    [meta, parent]
  );

  return (
    <div>
      <TextArea
        id={meta.name}
        aria-describedby={meta.subtitle && `subtitle-${meta.name}`}
        data-testid="descriptionInput"
        rows={meta.rows}
        placeholder={meta.placeholder}
        {...handler()}
        onBlur={handleBlur}
        infoText={<DescriptionInfo info={getCharactersInfo()} />}
      />
    </div>
  );
};

DescriptionInput.propTypes = {
  handler: PropTypes.func,
  value: PropTypes.string,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default DescriptionInput;
