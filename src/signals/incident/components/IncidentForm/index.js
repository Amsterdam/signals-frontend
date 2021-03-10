import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FormGenerator } from 'react-reactive-form';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import { themeSpacing } from '@amsterdam/asc-ui';

import { isAuthenticated } from 'shared/services/auth/auth';
import formatConditionalForm from '../../services/format-conditional-form';

export const Form = styled.form`
  width: 100%;
  `;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;

  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: ${themeSpacing(8)};
  word-break: break-word;

  & > * {
    grid-column-start: 1;
  }

  .incident-navigation,
  .mapSelect,
  .mapSelectGeneric,
  .mapInput,
  .caution {
    grid-column-end: 3;
  }

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-columns: 8fr 4fr;
    grid-column-gap: ${themeSpacing(5)};

    ${({ isSummary }) =>
    isSummary &&
      css`
        grid-template-columns: 4fr 6fr;

        & > *:not(.incident-navigation) {
          grid-column-start: 2;
        }

        ${() =>
    isSummary &&
          isAuthenticated() &&
          css`
            @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
              grid-template-columns: 4fr 6fr 2fr;

              & > .incident-navigation {
                grid-column-end: 4;
              }
            }
          `}
      `}
  }
`;

class IncidentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    };

    this.setForm = this.setForm.bind(this);
    this.setValues = this.setValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setIncident = this.setIncident.bind(this);
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!props.postponeSubmitWhenLoading) {
      return null;
    }

    const loading = get(props, props.postponeSubmitWhenLoading);
    if (loading !== prevState.loading) {
      return {
        loading,
        submitting: !loading ? false : prevState.submitting,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.form) return;
    this.setValues(this.props.incidentContainer.incident);
    this.form.meta.incident = this.props.incidentContainer.incident;
    this.form.meta.submitting = this.state.submitting;
    if (this.state.loading !== prevState.loading && !this.state.loading && this.state.next) {
      if (this.form.valid) {
        this.setIncident(this.state.formAction);
        this.state.next();
      }
    }
  }

  componentDidMount() {
    this.setState({
      loading: false,
      submitting: false,
      formAction: '',
      next: null,
    });
  }

  setForm(form) {
    this.form = form;
    this.form.meta = {
      wizard: this.props.wizard,
      incidentContainer: this.props.incidentContainer,
      handleSubmit: this.handleSubmit,
      getClassification: this.props.getClassification,
      updateIncident: this.props.updateIncident,
    };

    this.setValues(this.props.incidentContainer.incident);
  }

  setValues(incident) {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.controls[key];
      if ((control.disabled && control.meta.isVisible) || (control.enabled && !control.meta.isVisible)) {
        if (control.meta.isVisible) {
          control.enable();
        } else {
          control.disable();
        }
      }

      if (!isEqual(incident[key], control.value)) {
        control.setValue(incident[key]);
      }
    });
    this.form.updateValueAndValidity();
  }

  setIncident(formAction) {
    switch (
      formAction // eslint-disable-line default-case
    ) {
      case 'UPDATE_INCIDENT':
        this.props.updateIncident(this.form.value);
        break;

      case 'CREATE_INCIDENT':
        this.props.createIncident({
          incident: this.props.incidentContainer.incident,
          wizard: this.props.wizard,
        });
        break;

      default:
    }
  }

  handleSubmit(e, next, formAction) {
    e.preventDefault();

    if (next) {
      if (this.props.postponeSubmitWhenLoading) {
        if (this.state.loading) {
          this.setState({
            submitting: true,
            formAction,
            next,
          });

          return;
        }
      }

      if (this.form.valid) {
        this.setIncident(formAction);
        next();
      }
    }

    Object.values(this.form.controls).map(control => control.onBlur());
  }

  render() {
    const fields = this?.form?.value || {};
    const isSummary = Object.keys(fields).includes('page_summary');

    return (
      <div className="incident-form" data-testid="incidentForm">
        <Form onSubmit={this.handleSubmit}>
          <Fieldset isSummary={isSummary}>
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={formatConditionalForm(this.props.fieldConfig, this.props.incidentContainer.incident)}
            />
          </Fieldset>
        </Form>
      </div>
    );
  }
}

IncidentForm.defaultProps = {
  fieldConfig: {
    controls: {},
  },
  postponeSubmitWhenLoading: '',
};

IncidentForm.propTypes = {
  fieldConfig: PropTypes.object,
  incidentContainer: PropTypes.object.isRequired,
  wizard: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  postponeSubmitWhenLoading: PropTypes.string,
};

export default IncidentForm;
