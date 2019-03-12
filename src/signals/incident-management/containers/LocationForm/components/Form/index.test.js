// import React from 'react';
// import { shallow } from 'enzyme';
// import { FieldGroup } from 'react-reactive-form';

// import Form from './index';

// describe('<Form />', () => {
//   let wrapper;
//   let props;

//   beforeEach(() => {
//     props = {
//       id: '1',
//       sublocationList: ['test'],
//       onRequestPriorityUpdate: jest.fn()
//     };

//     wrapper = shallow(
//       <Form {...props} />
//     );
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it('should render correctly', () => {
//     expect(wrapper).toMatchSnapshot();
//   });

//   it('should contain the FieldGroup', () => {
//     expect(wrapper.find(FieldGroup)).toHaveLength(1);
//   });

//   describe('FieldGroup', () => {
//     let renderedFormGroup;

//     beforeEach(() => {
//     });

//     describe('rendering', () => {
//       it('should render FormGroup correctly', () => {
//         renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//         expect(renderedFormGroup).toMatchSnapshot();
//       });

//       it('should render loading', () => {
//         wrapper.setProps({ loading: false });
//         wrapper.setProps({ loading: true });

//         renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//         expect(renderedFormGroup).toMatchSnapshot();
//       });
//     });

//     it('should disable the submit button when no category is selected', () => {
//       renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//       expect(renderedFormGroup.find('button').prop('disabled')).toBe(true);
//     });

//     it('should disable the submit button when no location is selected', () => {
//       renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//       expect(renderedFormGroup.find('button').prop('disabled')).toBe(true);
//     });

//     it('should enable the submit button when a  location is selected', () => {
//       const form = wrapper.instance().locationForm;
//       const formValue = { location: 'test' };
//       form.patchValue(formValue);
//       expect(form.value.location).toEqual(formValue.location);
//       renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//       expect(renderedFormGroup.find('button').prop('disabled')).toBe(false);
//     });

//     it('should call location update when the form is submitted (search button is clicked)', () => {
//       const form = wrapper.instance().locationForm;
//       const formValue = {
//         ...form.value,
//         location: 'high'
//       };
//       form.setValue(formValue);
//       expect(form.value.location).toEqual(formValue.location);

//       renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
//       // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
//       renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
//       const formCallValue = { ...formValue, _signal: props.id };
//       expect(props.onRequestPriorityUpdate).toHaveBeenCalledWith(formCallValue);
//     });
//   });
// });
