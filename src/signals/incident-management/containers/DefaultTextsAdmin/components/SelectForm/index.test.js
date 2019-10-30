// import React from 'react';
// import { render } from '@testing-library/react';
// import { shallow } from 'enzyme';
// import { withAppContext } from 'test/utils';

// import { FieldGroup } from 'react-reactive-form';

// import SelectForm from './index';

// import statusList, { changeStatusOptionList, defaultTextsOptionList } from '../../../../definitions/statusList';

// // jest.mock('./components/DefaultTexts', () => () => <div data-testid="status-form-default-texts" />);

// describe('<SelectForm />', () => {
//   let wrapper;
//   let props;
//   let instance;

//   beforeEach(() => {
//     props = {
//       subCategories: [],
//       statusList: [],

//       onFetchDefaultTexts: () => {},
//     };
//   });

//   const getComponent = prps => {
//     const wrap = shallow(
//       <SelectForm {...prps} />
//     );

//     const inst = wrap.instance();

//     return [wrap, inst];
//   };

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it.only('should contain the FieldGroup', () => {
//     [wrapper] = getComponent(props);

//     expect(wrapper.find(FieldGroup)).toHaveLength(1);
//     expect(props.onDismissError).toHaveBeenCalledTimes(1);
//   });

//   it.only('should contain render unauthorized error', () => {
//     props.error = {
//       response: {
//         status: 403,
//       },
//     };

//     const { queryByTestId } = render(
//       withAppContext(<SelectForm {...props} />)
//     );

//     expect(queryByTestId('statusFormError')).toHaveTextContent(/^Je bent niet geautoriseerd om dit te doen\.$/);
//   });

//   it('should contain render other error', () => {
//     props.error = {
//       response: {
//         status: 400,
//       },
//     };

//     const { queryByTestId } = render(
//       withAppContext(<SelectForm {...props} />)
//     );

//     expect(queryByTestId('statusFormError')).toHaveTextContent(/^De gekozen status is niet mogelijk in deze situatie\.$/);
//   });


//   it('should contain loading indicator when patching error', () => {
//     props.patching = {
//       status: true,
//     };

//     const { queryByTestId } = render(
//       withAppContext(<SelectForm {...props} />)
//     );

//     expect(queryByTestId('statusFormSpinner')).not.toBeNull();
//   });

//   it('should render form correctly', () => {
//     const { queryByText, queryByTestId } = render(
//       withAppContext(<SelectForm {...props} />)
//     );

//     expect(queryByText('Huidige status')).not.toBeNull();
//     expect(queryByText('Verzoek tot heropenen')).not.toBeNull();

//     expect(queryByText('Nieuwe status')).not.toBeNull();
//     expect(queryByText('In behandeling')).not.toBeNull();

//     expect(queryByTestId('statusFormSubmitButton')).toHaveTextContent(/^Status opslaan$/);
//     expect(queryByTestId('statusFormCancelButton')).toHaveTextContent(/^Annuleren$/);
//   });

//   it('should disable the submit button when no status has been selected', () => {
//     const { queryByTestId } = render(
//       withAppContext(<StatusForm {...props} />)
//     );
//     expect(queryByTestId('statusFormSubmitButton')).toHaveAttribute('disabled');
//   });

//   it('should close the status form when result is ok', () => {
//     const { rerender } = render(
//       withAppContext(<StatusForm {...props} />)
//     );

//     props.patching = { status: false };
//     props.error = { response: { ok: true } };

//     rerender(
//       withAppContext(<StatusForm {...props} />)
//     );

//     expect(props.onClose).toHaveBeenCalledTimes(1);
//   });

//   it('should not close the status form when result triggers an error', () => {
//     const { rerender } = render(
//       withAppContext(<StatusForm {...props} />)
//     );

//     props.patching = { status: false };
//     props.error = { response: { ok: false, status: 500 } };

//     rerender(
//       withAppContext(<StatusForm {...props} />)
//     );

//     expect(props.onClose).not.toHaveBeenCalled();
//   });

//   // describe('FieldGroup', () => {
//   //   let renderedFormGroup;

//   //   beforeEach(() => {
//   //     [wrapper, instance] = getComponent(props);

//   //     renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
//   //   });

//   //   it('should enable the submit button when a status has been selected', () => {
//   //     const form = instance.form;
//   //     const formValue = {
//   //       status: 'b',
//   //     };
//   //     form.patchValue(formValue);
//   //     expect(form.value.status).toEqual(formValue.status);
//   //     expect(form.value.coordinates).toEqual(formValue.coordinates);
//   //     expect(renderedFormGroup.find('[data-testid="statusFormSubmitButton"]').prop('disabled')).toBe(false);
//   //   });

//   //   it('should enable the submit button when a status with a mandatory text have been selected', () => {
//   //     const form = instance.form;
//   //     const newStatus = {
//   //       status: 'o',
//   //     };
//   //     form.patchValue(newStatus);
//   //     expect(form.value.status).toEqual(newStatus.status);
//   //     expect(renderedFormGroup.find('[data-testid="statusFormSubmitButton"]').prop('disabled')).toBe(true);

//   //     const newText = {
//   //       text: 'bla',
//   //     };
//   //     form.patchValue(newText);
//   //     expect(form.value.text).toEqual(newText.text);
//   //     expect(renderedFormGroup.find('[data-testid="statusFormSubmitButton"]').prop('disabled')).toBe(false);
//   //   });

//   //   it('should set default text when it has triggered', () => {
//   //     instance.handleUseDefaultText({ preventDefault: jest.fn() }, 'default text');

//   //     expect(instance.form.value.text).toEqual('default text');
//   //   });

//   //   it('should call patch status when the form is submitted (submit button is clicked)', () => {
//   //     const form = instance.form;
//   //     const formValues = {
//   //       status: 'o',
//   //       text: 'boooooo',
//   //     };
//   //     form.patchValue(formValues);

//   //     // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
//   //     renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
//   //     expect(props.onPatchIncident).toHaveBeenCalledWith({
//   //       id: 42,
//   //       patch: {
//   //         status: {
//   //           state: 'o',
//   //           text: 'boooooo',
//   //         },
//   //       },
//   //       type: 'status',
//   //     });
//   //   });
//   // });
// });
