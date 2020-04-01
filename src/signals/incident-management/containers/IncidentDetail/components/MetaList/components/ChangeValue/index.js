import React, { Fragment, useState, useCallback } from 'react';
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

  const editForm = (
    <FieldGroup
      strict={false}
      control={form}
      render={() => (
        <form onSubmit={handleSubmit}>
          <Fragment>
            <FieldControlWrapper
              render={component}
              name="input"
              values={list}
              control={form.get('input')}
              disabled={disabled}
              sort={sort}
            />

            <SaveButton variant="secondary" type="submit">
              Opslaan
            </SaveButton>

            <CancelButton variant="tertiary" type="button" onClick={handleCancel}>
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
          <span className="change-value__value">{getListValueByKey(list, get(incident, valuePath || path))}</span>
        )}
      </dd>
    </Fragment>
  );
};


ChangeValue.defaultProps = {
  component: SelectInput,
  valuePath: '',
  patch: {},
  disabled: false,
};

ChangeValue.propTypes = {
  component: PropTypes.func,
  incident: incidentType.isRequired,
  list: dataListType.isRequired,
  display: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  valuePath: PropTypes.string,
  patch: PropTypes.object,
  disabled: PropTypes.bool,
  sort: PropTypes.bool,
  type: PropTypes.string.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default ChangeValue;
