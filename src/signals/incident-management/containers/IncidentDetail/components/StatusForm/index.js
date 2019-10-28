import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import { Button, Spinner, Heading, Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { incidentType, dataListType, defaultTextsType } from 'shared/types';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import Label from '../../../../components/Label';
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
})`
`;

class StatusForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  form = FormBuilder.group({ // eslint-disable-line react/sort-comp
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
      const hasDefaultTexts = Boolean(this.props.defaultTextsOptionList.find(s => s.key === status));
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
    if (!isEqual(prevProps.patching && prevProps.patching.status, this.props.patching && this.props.patching.status) && this.props.patching.status === false) {
      const hasError = (this.props.error && this.props.error.response && !this.props.error.response.ok) || false;
      if (!hasError) {
        this.form.reset();
        this.props.onClose();
      }
    }
    this.form.updateValueAndValidity();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onPatchIncident({
      id: this.props.incident.id,
      type: 'status',
      patch: { status: { state: this.form.value.status, text: this.form.value.text } },
    });
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
    const {
      warning,
      hasDefaultTexts,
    } = this.state;
    const currentStatus = statusList.find(status => status.key === incident.status.state);
    return (
      <Fragment>
        <FieldGroup
          control={this.form}
          render={({ invalid }) => (
            <form onSubmit={this.handleSubmit}>
              <Row>
                <StyledColumn span={6}>
                  <StyledH4 $as="h4">Status wijzigen</StyledH4>

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
                    rows={5}
                  />

                  <div className="notification notification-red" data-testid="statusFormWarning">
                    {warning}
                  </div>
                  <div className="notification notification-red" data-testid="statusFormError">
                    {error && error.response && error.response.status === 403 ? 'Je bent niet geautoriseerd om dit te doen.' : '' }
                    {error && error.response && error.response.status !== 403 ? 'De gekozen status is niet mogelijk in deze situatie.' : '' }
                  </div>

                  <StyledButton
                    data-testid="statusFormSubmitButton"
                    variant="secondary"
                    disabled={invalid}
                    type="submit"
                    iconRight={patching.status ? <StyledSpinner /> : null}
                  >Status opslaan</StyledButton>
                  <StyledButton
                    data-testid="statusFormCancelButton"
                    variant="tertiary"
                    onClick={onClose}
                  >Annuleren</StyledButton>
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
