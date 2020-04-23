import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
import styled, { css } from 'styled-components';

import {
  Button,
  Spinner,
  Heading,
  Row,
  Column,
  themeSpacing,
} from '@datapunt/asc-ui';
import { incidentType, dataListType, defaultTextsType } from 'shared/types';
import { PATCH_TYPE_STATUS } from 'models/incident/constants';

import Label from 'components/Label';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import DefaultTexts from './components/DefaultTexts';

const StyledColumn = styled(Column)`
  display: block;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`;

const StyledCurrentStatus = styled.div`
  margin-bottom: ${themeSpacing(5)};
`;

const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

const StyledSpinner = styled(Spinner).attrs({
  'data-testid': 'statusFormSpinner',
})``;

const Notification = styled.div`
  ${({ warning }) =>
    warning &&
    css`
      border-left: 3px solid;
      display: block;
      margin: 30px 0;
      padding-left: 20px;
      border-color: #ec0000;
    `}

  line-height: 22px;
`;

class StatusForm extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({
    // eslint-disable-line react/sort-comp
    status: ['', Validators.required],
    text: [''],
  });

  constructor(props) {
    super(props);

    this.state = {
      warning: props.warning,
      hasDefaultTexts: props.hasDefaultTexts,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUseDefaultText = this.handleUseDefaultText.bind(this);
  }

  componentDidMount() {
    this.form.controls.status.valueChanges.subscribe(status => {
      const found = this.props.statusList.find(s => s.key === status);
      this.setState({
        warning: (found && found.warning) || '',
      });
      this.props.onDismissError();

      const textField = this.form.controls.text;
      const hasDefaultTexts = Boolean(
        this.props.defaultTextsOptionList.find(s => s.key === status)
      );
      if (hasDefaultTexts) {
        textField.setValidators([Validators.required]);
      } else {
        textField.clearValidators();
      }
      this.setState({ hasDefaultTexts });

      textField.updateValueAndValidity();
    });

    this.props.onDismissError();
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        prevProps.patching && prevProps.patching.status,
        this.props.patching && this.props.patching.status
      ) &&
      this.props.patching.status === false
    ) {
      const hasError =
        (this.props.error &&
          this.props.error.response &&
          !this.props.error.response.ok) ||
        false;
      if (!hasError) {
        this.form.reset();
        this.props.onClose();
      }
    }
    this.form.updateValueAndValidity();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { value } = this.form;

    if (/(?:{{|}})/gi.test(value.text)) {
      global.alert("Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.");
    } else {
      this.props.onPatchIncident({
        id: this.props.incident.id,
        type: PATCH_TYPE_STATUS,
        patch: {
          status: { state: value.status, text: value.text },
        },
      });
    }
  }

  handleUseDefaultText(e, text) {
    e.preventDefault();

    this.form.get('text').patchValue(text);
  }

  render() {
    const {
      incident,
      patching,
      error,
      statusList,
      changeStatusOptionList,
      onClose,
      defaultTexts,
    } = this.props;
    const { warning, hasDefaultTexts } = this.state;
    const currentStatus = statusList.find(
      status => status.key === incident.status.state
    );
    return (
      <Fragment>
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <Row hasMargin={false}>
                <StyledColumn span={6}>
                  <StyledH4 forwardedAs="h4">Status wijzigen</StyledH4>

                  <StyledCurrentStatus>
                    <Label htmlFor="currentStatus">Huidige status</Label>
                    <div id="currentStatus">{currentStatus.value}</div>
                  </StyledCurrentStatus>

                  <FieldControlWrapper
                    data-testid="statusFormStatusField"
                    display="Nieuwe status"
                    render={RadioInput}
                    name="status"
                    control={this.form.get('status')}
                    values={changeStatusOptionList}
                  />
                  <FieldControlWrapper
                    render={TextAreaInput}
                    name="text"
                    display="Toelichting"
                    control={this.form.get('text')}
                    rows={10}
                  />

                  <Notification warning data-testid="statusFormWarning">
                    {warning}
                  </Notification>

                  <Notification warning data-testid="statusFormError">
                    {error && error.response && error.response.status === 403
                      ? 'Je bent niet geautoriseerd om dit te doen.'
                      : ''}
                    {error && error.response && error.response.status !== 403
                      ? 'De gekozen status is niet mogelijk in deze situatie.'
                      : ''}
                  </Notification>

                  <StyledButton
                    data-testid="statusFormSubmitButton"
                    variant="secondary"
                    disabled={invalid}
                    type="submit"
                    iconRight={patching.status ? <StyledSpinner /> : null}
                  >
                    Status opslaan
                  </StyledButton>
                  <StyledButton
                    data-testid="statusFormCancelButton"
                    variant="tertiary"
                    onClick={onClose}
                  >
                    Annuleren
                  </StyledButton>
                </StyledColumn>
                <StyledColumn span={6}>
                  <DefaultTexts
                    defaultTexts={defaultTexts}
                    status={this.form.get('status').value}
                    hasDefaultTexts={hasDefaultTexts}
                    onHandleUseDefaultText={this.handleUseDefaultText}
                  />
                </StyledColumn>
              </Row>
            </form>
          )}
        />
      </Fragment>
    );
  }
}

StatusForm.defaultProps = {
  warning: '',
  hasDefaultTexts: false,
};

StatusForm.propTypes = {
  incident: incidentType.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  patching: PropTypes.shape({
    status: PropTypes.bool,
  }).isRequired,
  warning: PropTypes.string,
  hasDefaultTexts: PropTypes.bool,
  changeStatusOptionList: dataListType.isRequired,
  defaultTextsOptionList: dataListType.isRequired,
  statusList: dataListType.isRequired,
  defaultTexts: defaultTextsType.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusForm;
