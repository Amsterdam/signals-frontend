import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import mapLocation from 'shared/services/map-location';

import Form from './index';

jest.mock('shared/services/map-location');

describe('<Form />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      incidentModel: {
        incident: {
          id: 42,
          location: { foo: 'bar' }
        },
        patching: {
          location: false
        }
      },
      onPatchIncident: jest.fn()
    };

    wrapper = shallow(
      <Form {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    expect(wrapper.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    describe('rendering', () => {
      it('should render FormGroup correctly', () => {
        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render patching', () => {
        wrapper.setProps({
          incidentModel: {
            ...props.incidentModel,
            patching: {
              location: true
            }
          }
        });
        renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
        wrapper.setProps({
          incidentModel: {
            ...props.incidentModel,
            patching: {
              location: false
            },
          }
        });

        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render FormGroup unauthorized error correctly', () => {
        wrapper.setProps({
          incidentModel: {
            ...props.incidentModel,
            error: {
              response: {
                status: 403
              }
            }
          }
        });
        renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render FormGroup unspecified error correctly', () => {
        wrapper.setProps({
          incidentModel: {
            ...props.incidentModel,
            error: {
              response: {
                status: 500
              }
            }
          }
        });
        renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
        expect(renderedFormGroup).toMatchSnapshot();
      });
    });

    it('should disable the submit button when location has not changed', () => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('button').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a  location is selected', () => {
      const form = wrapper.instance().locationForm;
      const formValue = {
        coordinates: '52,4',
        location: { foo: 'bar' }
      };
      form.patchValue(formValue);
      expect(form.value.coordinates).toEqual(formValue.coordinates);
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('button').prop('disabled')).toBe(false);
    });

    it('when a anew location has been selected it should map the location in the form onQueryResult', () => {
      const mappedLocation = {
        foo: 'baz',
        geometrie: {
          coordinates: [52, 4]
        }
      };

      mapLocation.mockImplementation(() => mappedLocation);
      const location = {
        foo: 'bar'
      };
      wrapper.instance().onQueryResult(location);

      expect(wrapper.state('newLocation')).toEqual(mappedLocation);
    });

    it('should call location update when the form is submitted (search button is clicked)', () => {
      const form = wrapper.instance().locationForm;
      wrapper.setState({
        newLocation: { foo: 'baz' }
      });
      const formValue = {
        coordinates: '52,4',
        location: { foo: 'bar' }
      };
      form.setValue(formValue);
      expect(form.value.location).toEqual(formValue.location);

      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      const formCallValue = {
        id: 42,
        patch: {
          location: { foo: 'baz' }
        },
        type: 'location'
      };
      expect(props.onPatchIncident).toHaveBeenCalledWith(formCallValue);
    });
  });
});
