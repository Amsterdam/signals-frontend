import React, { useMemo, Fragment, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import get from 'lodash.get';
import set from 'lodash.set';
import Button from 'components/Button';
import { themeSpacing } from '@datapunt/asc-ui';

import { incidentType, dataListType } from 'shared/types';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import InfoText from 'components/InfoText';
import SelectInput from 'signals/incident-management/components/SelectInput';
import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';

import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';

const EditButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`;

const DisplayValue = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - ${themeSpacing(10)});
`;

const SaveButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

const ButtonBar = styled.div`
  margin-top: ${themeSpacing(6)};
`;

const ChangeValue = ({
  component,
  disabled,
  display,
  incident,
  infoKey,
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
  const [info, setInfo] = useState('');

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

  const handleChange = useCallback(
    event => {
      const { value } = event.target;

      showInfo(value);
    },
    [showInfo]
  );

  const showInfo = useCallback(
    value => {
      if (infoKey) {
        const valueItem = list.find(({ key }) => key === value);

        if (valueItem) {
          setInfo(valueItem[infoKey]);
        }
      }
    },
    [infoKey, list]
  );

  const onShowForm = useCallback(() => {
    const value = get(incident, valuePath || path);

    form.controls.input.setValue(value);
    setShowForm(true);

    showInfo(value);
  }, [incident, valuePath, path, showInfo, form]);

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
        <form onSubmit={handleSubmit} onChange={handleChange} data-testid="changeValueForm">
          <Fragment>
            <FieldControlWrapper
              control={form.get('input')}
              disabled={disabled}
              name="input"
              render={component}
              sort={sort}
              values={list}
            />

            {info && <InfoText text={info} />}

            <ButtonBar>
              <SaveButton data-testid={`submit${type.charAt(0).toUpperCase()}${type.slice(1)}Button`} variant="secondary" type="submit">
                Opslaan
              </SaveButton>

              <Button data-testid={`cancel${type.charAt(0).toUpperCase()}${type.slice(1)}Button`} variant="tertiary" type="button" onClick={handleCancel}>
                Annuleren
              </Button>
            </ButtonBar>
          </Fragment>
        </form>
      )}
    />
  );

  return (
    <Fragment>
      <dt data-testid={`meta-list-${type}-definition`}>
        {display}
        {!showForm && (
          <EditButton
            data-testid={`edit${type.charAt(0).toUpperCase()}${type.slice(1)}Button`}
            disabled={disabled}
            icon={<IconEdit />}
            iconSize={18}
            onClick={onShowForm}
            variant="application"
          />
        )}
      </dt>

      {showForm ? (
        <dd data-testid={`meta-list-${type}-value`}>{editForm}</dd>
      ) : (
        <dd data-testid={`meta-list-${type}-value`} className={valueClass}>
          <DisplayValue data-testid="valuePath">
            {getListValueByKey(list, get(incident, valuePath || path))}
          </DisplayValue>
        </dd>
      )}
    </Fragment>
  );
};

ChangeValue.defaultProps = {
  component: SelectInput,
  disabled: false,
  infoKey: '',
  patch: {},
  valueClass: '',
  valuePath: '',
};

ChangeValue.propTypes = {
  component: PropTypes.func,
  disabled: PropTypes.bool,
  display: PropTypes.string.isRequired,
  incident: incidentType.isRequired,
  /** Indicator that is used to determine which list item prop should be used to display info text between the form field and the buttons */
  infoKey: PropTypes.string,
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
