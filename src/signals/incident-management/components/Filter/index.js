import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup } from 'react-reactive-form';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';
import { Button, Row, Column } from '@datapunt/asc-ui';

import FieldControlWrapper from '../FieldControlWrapper';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import DatePickerInput from '../DatePickerInput';

const FilterForm = styled.form`
  column-count: 2;
  column-gap: 100px;
  width: 100%;
  column-rule: 1px dotted #ddd;
  column-fill: auto @media (max-width: 1020px) {
    column-gap: 60px;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
`;

const FormFooter = styled.footer`
  border-top: 2px solid #e6e6e6;
  background: white;
  height: 66px;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
`;

const ButtonContainer = styled(Column)`
  justify-content: flex-end;
`;

const ResetButton = styled(Button)`
  margin-right: auto;
`;

const CancelButton = styled(Button).attrs({
  color: 'bright',
})`
  margin-right: 10px;
  background-color: #b4b4b4;
`;

export const defaults = {
  id: [''],
  incident_date_start: [''],
  location__stadsdeel: [['']],
  priority__priority: '',
  main_slug: [['']],
  sub_slug: [['']],
  status__state: [['']],
  location__address_text: [''],
};

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.filterForm = FormBuilder.group(defaults);

    if (props.filter) {
      this.filterForm.setValue(props.filter);
    }

    this.onFilter = this.onFilter.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { categories } = this.props;

    this.filterForm.get('main_slug').valueChanges.subscribe((value) => {
      this.filterForm.get('sub_slug').setValue(defaults.sub_slug);

      this.props.onMainCategoryFilterSelectionChanged({
        selectedOptions: value,
        categories,
      });
    });

    const selectedOptions =
      (this.props.filter && this.props.filter.main_slug) || defaults.main_slug;

    this.props.onMainCategoryFilterSelectionChanged({
      selectedOptions,
      categories,
    });
  }

  componentDidUpdate() {
    this.filterForm.updateValueAndValidity();
  }

  componentWillUnmount() {
    this.filterForm.get('main_slug').valueChanges.unsubscribe();
  }

  onFilter = (filter) => {
    const newFilter = { ...filter };

    if (isEqual(newFilter.main_slug, defaults.main_slug)) {
      newFilter.main_slug = null;
    }

    if (isEqual(newFilter.sub_slug, defaults.sub_slug)) {
      newFilter.sub_slug = null;
    }

    this.props.onRequestIncidents({ filter: newFilter });
  };

  handleReset = () => {
    this.filterForm.reset();
    this.onFilter(this.filterForm.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { onSubmit } = this.props;
    this.onFilter(this.filterForm.value);

    onSubmit(event);
  };

  render() {
    const {
      categories,
      filterSubCategoryList,
      onCancel,
      priorityList,
      stadsdeelList,
      statusList,
    } = this.props;

    return (
      <FieldGroup
        control={this.filterForm}
        render={({ invalid }) => (
          <FilterForm onSubmit={this.handleSubmit}>
            <Fragment>
              <FieldControlWrapper
                render={TextInput}
                name="id"
                display="Id"
                control={this.filterForm.get('id')}
              />
              <FieldControlWrapper
                render={DatePickerInput}
                name="incident_date_start"
                display="Datum"
                control={this.filterForm.get('incident_date_start')}
                placeholder={'JJJJ-MM-DD'}
              />
              <FieldControlWrapper
                render={SelectInput}
                name="priority__priority"
                display="Urgentie"
                control={this.filterForm.get('priority__priority')}
                values={priorityList}
                emptyOptionText="Alles"
              />
              <FieldControlWrapper
                render={SelectInput}
                name="location__stadsdeel"
                display="Stadsdeel"
                control={this.filterForm.get('location__stadsdeel')}
                values={stadsdeelList}
                emptyOptionText="Alle stadsdelen"
                multiple
              />
              <FieldControlWrapper
                render={SelectInput}
                name="main_slug"
                display="Hoofdcategorie"
                control={this.filterForm.get('main_slug')}
                values={categories.main}
                emptyOptionText="Alles"
                multiple
                useSlug
                size={10}
              />
              <FieldControlWrapper
                render={SelectInput}
                name="sub_slug"
                display="Subcategorie"
                control={this.filterForm.get('sub_slug')}
                values={filterSubCategoryList}
                emptyOptionText="Alles"
                multiple
                useSlug
                size={10}
              />
              <FieldControlWrapper
                render={SelectInput}
                name="status__state"
                display="Status"
                control={this.filterForm.get('status__state')}
                values={statusList}
                emptyOptionText="Alle statussen"
                multiple
              />
              <FieldControlWrapper
                render={TextInput}
                name="location__address_text"
                display="Adres"
                control={this.filterForm.get('location__address_text')}
              />

              <FormFooter>
                <Row>
                  <ButtonContainer span={12}>
                    <ResetButton onClick={this.handleReset} type="reset">
                      Reset filter
                    </ResetButton>

                    <CancelButton
                      data-testid="cancelBtn"
                      type="button"
                      onClick={onCancel}
                    >
                      Annuleren
                    </CancelButton>

                    <Button
                      data-testid="submitBtn"
                      type="submit"
                      color="secondary"
                      disabled={invalid}
                    >
                      Filteren
                    </Button>
                  </ButtonContainer>
                </Row>
              </FormFooter>
            </Fragment>
          </FilterForm>
        )}
      />
    );
  }
}

Filter.defaultProps = {
  categories: {
    main: [],
    sub: [],
    mainToSub: {},
  },
  filterSubCategoryList: [],
  filterSubs: [],
  onCancel: null,
  onSubmit: () => {},
};

Filter.propTypes = {
  categories: PropTypes.object,
  filter: PropTypes.object,
  filterSubCategoryList: PropTypes.array,
  onCancel: PropTypes.func,
  onMainCategoryFilterSelectionChanged: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  priorityList: PropTypes.array,
  stadsdeelList: PropTypes.array,
  statusList: PropTypes.array,
};

export default Filter;
