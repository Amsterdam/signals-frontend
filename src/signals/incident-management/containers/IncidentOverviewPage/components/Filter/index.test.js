import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import Filter from './index';

describe('<Filter />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      onRequestIncidents: jest.fn()
    };

    renderedComponent = shallow(
      <Filter {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.skip('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    expect(renderedComponent.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      renderedFormGroup = (renderedComponent.find(FieldGroup).shallow().dive());
    });

    it.skip('should render correctly', () => {
      expect(renderedFormGroup).toMatchSnapshot();
    });

    it('should render 2 buttons', () => {
      expect(renderedFormGroup.find('button').length).toEqual(2);
    });

    it('should reset the form when the reset button is clicked', () => {
      const filterForm = renderedComponent.instance().filterForm;
      const filterEmptyValue = {
        id: null,
        incident_date_start: null,
        category__sub: null,
        location__address_text: null,
        location__stadsdeel: null,
        status__state: null,
      };
      const filterValue = { id: 50 };
      filterForm.patchValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);

      jest.spyOn(filterForm, 'reset');

      renderedFormGroup.find('button').at(0).simulate('click');
      expect(filterForm.reset).toHaveBeenCalled();
      expect(props.onRequestIncidents).toHaveBeenCalled();
      expect(filterForm.value).toEqual(filterEmptyValue);
    });

    it('should filter when form is submitted (search button is clicked)', () => {
      const filterForm = renderedComponent.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        id: 50,
        location__address_text: 'dam'
      };
      filterForm.setValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(filterValue.location__address_text);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() {} });
      expect(filterForm.value).toEqual(filterValue);
      expect(props.onRequestIncidents).toHaveBeenCalledWith({ filter: filterValue });
    });
  });
});
