import React, { useMemo, Fragment, useEffect, useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import loadashGet from 'lodash.get';
import set from 'lodash.set';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import Button from 'components/Button';
import { dataListType } from 'shared/types';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import InfoText from 'components/InfoText';
import FieldControlWrapper from 'signals/incident-management/components/FieldControlWrapper';

import EditButton from '../EditButton';
import IncidentDetailContext from '../../context';

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
  disabled = false,
  display,
  infoKey,
  options,
  patch,
  path,
  sort,
  type,
  valueClass,
  valuePath,
  get = loadashGet,
  getSelectedOption,
}) => {
  const { incident, update } = useContext(IncidentDetailContext);
  const [showForm, setShowForm] = useState(false);
  const [info, setInfo] = useState('');

  const form = useMemo(
    () =>
      FormBuilder.group({
        input: [get(incident, valuePath), Validators.required],
      }),
    [incident, valuePath, get]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const payload = { ...patch };

      const newValue = form.value.input || options.find(({ key }) => !key)?.key;
      set(payload, path, getSelectedOption(newValue));

      update({
        type,
        patch: { ...payload },
      });

      form.reset();
      setShowForm(false);
    },
    [patch, form, options, path, getSelectedOption, update, type]
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
        const valueItem = options.find(({ key }) => key === value);

        if (valueItem) {
          setInfo(valueItem[infoKey]);
        }
      }
    },
    [infoKey, options]
  );

  const onShowForm = useCallback(() => {
    const value = get(incident, valuePath || path);

    form.controls.input.setValue(value);
    setShowForm(true);

    showInfo(value);
  }, [incident, valuePath, path, showInfo, form, get]);

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
          <FieldControlWrapper
            control={form.get('input')}
            disabled={disabled}
            name="input"
            render={component}
            sort={sort}
            values={options}
          />

          {info && <InfoText text={info} />}

          <ButtonBar>
            <SaveButton
              data-testid={`submit${type.charAt(0).toUpperCase()}${type.slice(1)}Button`}
              variant="secondary"
              type="submit"
            >
              Opslaan
            </SaveButton>

            <Button
              data-testid={`cancel${type.charAt(0).toUpperCase()}${type.slice(1)}Button`}
              variant="tertiary"
              type="button"
              onClick={handleCancel}
            >
              Annuleren
            </Button>
          </ButtonBar>
        </form>
      )}
    />
  );

  return (
    <Fragment>
      <dt data-testid={`meta-list-${type}-definition`}>
        <DisplayValue>{display}</DisplayValue>
        {!showForm && (
          <EditButton
            data-testid={`edit${type.charAt(0).toUpperCase()}${type.slice(1)}Button`}
            disabled={disabled}
            onClick={onShowForm}
          />
        )}
      </dt>

      {showForm ? (
        <dd data-testid={`meta-list-${type}-value`}>{editForm}</dd>
      ) : (
        <dd data-testid={`meta-list-${type}-value`} className={valueClass}>
          <DisplayValue data-testid="valuePath">
            {getListValueByKey(options, get(incident, valuePath || path))}
          </DisplayValue>
        </dd>
      )}
    </Fragment>
  );
};

ChangeValue.defaultProps = {
  disabled: false,
  infoKey: '',
  patch: {},
  valueClass: '',
  valuePath: '',
  get: loadashGet,
  getSelectedOption: value => value,
};

ChangeValue.propTypes = {
  /* The selector component. Possible values: (RadioInput, SelectInput) */
  component: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  display: PropTypes.string.isRequired,
  /** Indicator that is used to determine which list item prop should be used to display info text between the form field and the buttons */
  infoKey: PropTypes.string,
  /** The options to choose from, either for a RadioGroup or SelectInput*/
  options: dataListType.isRequired,
  patch: PropTypes.object,
  path: PropTypes.string.isRequired,
  sort: PropTypes.bool,
  type: PropTypes.string.isRequired,
  valueClass: PropTypes.string,
  valuePath: PropTypes.string,
  /** Returns the value of the incident path. Can be overridden to implement specific logic */
  get: PropTypes.func,
  /** Format function for the selected option. By default returns the selected option but can be overridden to implement sepecific logic */
  getSelectedOption: PropTypes.func,
};

export default ChangeValue;
