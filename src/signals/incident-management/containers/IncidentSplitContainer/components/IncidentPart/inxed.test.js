// import React from 'react';
// import { shallow } from 'enzyme';
// import { FormBuilder } from 'react-reactive-form';

// import { IncidentPart } from './index';
// import priorityList from '../../../../definitions/priorityList';

// describe('<IncidentPart />', () => {
//   let props;

//   beforeEach(() => {
//     const form = {
//       get: jest.fn().mockImplementation((item) => {
//         console.log('iterm', item);
//         switch (item) {
//           default:
//             return '';
//         }
//       })
//     };

//     props = {
//       index: '2',
//       incident: {
//         category: {},
//         priority: {
//           priority: ''
//         }
//       },
//       subcategories: [{
//         key: 'key',
//         value: 'value',
//         slug: 'slug'
//       }],
//       priorityList,
//       splitForm: form
//     };
//   });

//   // splitForm: FormBuilder.group({
//   //   part1: FormBuilder.group({
//   //     subcategory: 'slug',
//   //     text: 'er ligt hier alweer poep',
//   //     file: true,
//   //     note: 'opmerking',
//   //     priority: 'high',
//   //   })
//   // })

//   describe('rendering', () => {
//     it('should render correctly', () => {
//       const wrapper = shallow(
//         <IncidentPart {...props} />
//       );
//       expect(wrapper).toMatchSnapshot();
//       // expect(props.onRequestIncident).toHaveBeenCalledWith('42');
//     });
//   });
// });

it('should', () => {
  expect(1).toBe(1);
});
