import React from 'react';
import { shallow } from 'enzyme';

import { FieldGroup } from 'react-reactive-form';

import { mapLocation } from 'shared/services/map-location';

import LocationForm from './index';

jest.mock('shared/services/map-location');

describe('<LocationForm />', () => {
  let location;
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    location = {
      extra_properties: null,
      geometrie: {
        type: 'Point',
        coordinates: [4, 52],
      },
      buurt_code: 'A00d',
      created_by: null,
      address: {
        postcode: '1012KP',
        huisletter: 'A',
        huisnummer: '123',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Rokin',
        huisnummer_toevoeging: 'H',
      },
      stadsdeel: 'A',
      bag_validated: false,
      address_text: 'Rokin 123-H 1012KP Amsterdam',
      id: 3372,
    };
    props = {
      incident: {
        id: 42,
        location,
      },
      patching: { location: false },
      error: false,
      onPatchIncident: jest.fn(),
      onDismissError: jest.fn(),
      onClose: jest.fn(),
    };

    wrapper = shallow(<LocationForm {...props} />);

    instance = wrapper.instance();

    mapLocation.mockImplementation(() => ({ ...location, stadsdeel: 'B' }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should contain the FieldGroup', () => {
    expect(wrapper.find(FieldGroup)).toHaveLength(1);
    expect(props.onDismissError).toHaveBeenCalledTimes(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      renderedFormGroup = wrapper
        .find(FieldGroup)
        .shallow()
        .dive();
    });

    it('should render buttons correctly', () => {
      expect(renderedFormGroup.find('location-form__submit')).not.toBeNull();
      expect(renderedFormGroup.find('location-form__cancel')).not.toBeNull();
    });

    it('should disable the submit button when no location is selected', () => {
      expect(renderedFormGroup.find('.location-form__submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a location has been selected', () => {
      const form = instance.form;
      const formValue = {
        location: { stadsdeel: 'E' },
        coordinates: '5,52',
      };
      form.patchValue(formValue);
      expect(form.value.location).toEqual(formValue.location);
      expect(form.value.coordinates).toEqual(formValue.coordinates);
      expect(renderedFormGroup.find('.location-form__submit').prop('disabled')).toBe(false);
    });

    it('should enable the submit button when a location has been selected', () => {
      const form = instance.form;
      const formValue = {
        location: { stadsdeel: 'E' },
        coordinates: '5,52',
      };
      form.patchValue(formValue);
      expect(form.value.location).toEqual(formValue.location);
      expect(form.value.coordinates).toEqual(formValue.coordinates);
    });

    it('should update the location and coordinates when the map returns a new value', () => {
      const form = instance.form;
      instance.onQueryResult();
      expect(form.value.coordinates).toEqual('4,52');
      expect(form.value.location).toEqual({ ...location, stadsdeel: 'B' });
    });

    it('should call patch location when the form is submitted (search button is clicked)', () => {
      wrapper.setProps({
        incident: {
          id: 42,
          location: { stadsdeel: 'E' },
        },
        patching: { location: false },
      });

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() {} });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: 42,
        patch: {
          location: { stadsdeel: 'E' },
        },
        type: 'location',
      });
    });

    it('should close the location form when result is ok', () => {
      wrapper.setProps({
        patching: { location: true },
      });

      wrapper.setProps({
        patching: { location: false },
        error: { response: { ok: true } },
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close the location form when result triggers an error', () => {
      wrapper.setProps({
        patching: { location: true },
      });

      wrapper.setProps({
        patching: { location: false },
        error: { response: { ok: false, status: 500 } },
      });

      expect(props.onClose).not.toHaveBeenCalled();
    });
  });
});
