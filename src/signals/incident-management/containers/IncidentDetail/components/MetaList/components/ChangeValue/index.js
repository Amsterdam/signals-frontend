import React, { Fragment, useEffect, useState, useCallback } from 'react';
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
import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';

const EditButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`;

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
  valuePath,
}) => {
  const [showForm, setShowForm] = useState(false);
  const form = FormBuilder.group({
    input: ['', Validators.required],
  });

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
    [form, incident.id, patch, path, type, onPatchIncident]
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
          form.reset();
          setShowForm(false);
          break;

        default:
          break;
      }
    },
    [form]
  );

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
        {!showForm && (
          <EditButton
            data-testid="editButton"
            disabled={disabled}
            icon={<IconEdit />}
            iconSize={18}
            onClick={() => setShowForm(true)}
            variant="application"
          />
        )}
      </dt>
      <dd>
        {showForm ? (
          editForm
        ) : (
          <span data-testid="valuePath">{getListValueByKey(list, get(incident, valuePath || path))}</span>
        )}
      </dd>
    </Fragment>
  );
};

ChangeValue.defaultProps = {
  component: SelectInput,
  disabled: false,
  patch: {},
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
  valuePath: PropTypes.string,
};

export default ChangeValue;
