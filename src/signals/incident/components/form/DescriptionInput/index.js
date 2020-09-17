import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/TextArea';
import DescriptionInfo from '../DescriptionInfo';

function get(e, meta, parent) {
  const {
    getClassification,
    updateIncident,
    incidentContainer: { usePredictions },
  } = parent?.meta;
  if (!usePredictions) return;
  if (e.target.value) getClassification(e.target.value);
  updateIncident({ [meta.name]: e.target.value });
}

const DescriptionInput = ({
  handler,
  value,
  meta,
  parent,
}) => {
  const getCharactersInfo = useCallback(
    () => meta.maxLength > 0 && `${value ? value.length : '0'}/${meta.maxLength} tekens`,
    [value, meta]
  );

  const handleBlur = useCallback(e => get(e, meta, parent), [meta, parent]);

  return (
    <TextArea
      data-testid="DescriptionInput"
      rows={meta.rows || 6}
      placeholder={meta.placeholder}
      {...handler()}
      onBlur={handleBlur}
      helpText={<DescriptionInfo info={getCharactersInfo()} />}
    />
  );
};

DescriptionInput.propTypes = {
  handler: PropTypes.func,
  value: PropTypes.string,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default DescriptionInput;
