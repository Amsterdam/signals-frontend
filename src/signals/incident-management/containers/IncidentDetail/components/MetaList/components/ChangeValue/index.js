import React, { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import get from 'lodash.get';
import set from 'lodash.set';
import { Button, themeSpacing } from '@datapunt/asc-ui';

import { incidentType, dataListType } from 'shared/types';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import SelectInput from 'signals/incident-management/components/SelectInput';
import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';
import EditButton from '../../../EditButton';

const SaveButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
  margin-top: -${themeSpacing(2)};
`;

const CancelButton = styled(Button)`
  margin-top: -${themeSpacing(2)};
`;

const ChangeValue = ({
  component,
  disabled,
  display,
  incident,
  list,
  onPatchIncident,
  patch,
  path,
  sort,
  type,
  valueClass,
  valuePath,
}) => {
  const [showForm, setShowForm] = useState(false);

  const form = useMemo(
    () =>
      FormBuilder.group({
        input: ['', Validators.required],
      }),
    []
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const payload = { ...patch };

      set(payload, path, form.value.input);

      onPatchIncident({
        id: incident.id,
        type,
        patch: { ...payload },
      });

      form.reset();
      setShowForm(false);
    },
    [incident.id, patch, path, type, onPatchIncident, form]
  );

  const handleCancel = useCallback(() => {
    form.reset();
    setShowForm(false);
  }, [form]);

  const handleKeyUp = useCallback(
    event => {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          handleCancel();
          break;

        default:
          break;
      }
    },
    [handleCancel]
  );

  const onShowForm = useCallback(() => {
    const value = get(incident, valuePath || path);

    form.controls.input.setValue(value);
    setShowForm(true);
  }, [incident, valuePath, path, form]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
    // Disabling linter; only execute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editForm = (
    <FieldGroup
      strict={false}
      control={form}
      render={() => (
        <form onSubmit={handleSubmit} data-testid="changeValueForm">
          <Fragment>
            <FieldControlWrapper
              render={component}
              name="input"
              values={list}
              control={form.get('input')}
              disabled={disabled}
              sort={sort}
            />

            <SaveButton data-testid="submitButton" variant="secondary" type="submit">
              Opslaan
            </SaveButton>

            <CancelButton data-testid="cancelButton" variant="tertiary" type="button" onClick={handleCancel}>
              Annuleren
            </CancelButton>
          </Fragment>
        </form>
      )}
    />
  );

  return (
    <Fragment>
      <dt>
        {display}
        {!showForm && <EditButton onClick={onShowForm} />}
      </dt>

      {showForm ? (
        <dd>{editForm}</dd>
      ) : (
        <dd className={valueClass}>
          <span data-testid="valuePath">{getListValueByKey(list, get(incident, valuePath || path))}</span>
        </dd>
      )}
    </Fragment>
  );
};

ChangeValue.defaultProps = {
  component: SelectInput,
  disabled: false,
  patch: {},
  valueClass: '',
  valuePath: '',
};

ChangeValue.propTypes = {
  component: PropTypes.func,
  disabled: PropTypes.bool,
  display: PropTypes.string.isRequired,
  incident: incidentType.isRequired,
  list: dataListType.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
  patch: PropTypes.object,
  path: PropTypes.string.isRequired,
  sort: PropTypes.bool,
  type: PropTypes.string.isRequired,
  valueClass: PropTypes.string,
  valuePath: PropTypes.string,
};

export default ChangeValue;
