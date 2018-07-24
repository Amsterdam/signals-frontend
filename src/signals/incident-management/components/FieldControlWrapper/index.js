// import React from 'react';
// import PropTypes from 'prop-types';

// import { FieldControl } from 'react-reactive-form';

// const withFieldControl = (Component) => //  ({ name, control }) =>
//   class extends React.Component { // eslint-disable-line react/prefer-stateless-function
//     static propTypes = {
//       name: PropTypes.string.isRequired,
//       control: PropTypes.object.isRequired
//     }

//     render() {
//       const { name, control } = this.props;
//       // debugger;
//       console.log('withF ieldCnt rol', this.props);
//       const { handler, touched, hasError } = control;
//       const comp = <Component {...this.props} handler={handler} touched={touched} hasError={hasError} />;
//       // return <div>test</div>;
//       console.log(comp.props);
//       return <FieldControl name={name} control={control} render={comp.renderIt} />;
//     }

//   };

// // export default withFieldControl;

// export class TextInputComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function, react/no-multi-comp
//   constructor(props) {
//     super(props);
//     console.log('bla', props);
//   }

//   renderIt(props) {
//   // renderit() {
//     const { name, display, placeholder } = this.props;
//     console.log('renderIt', this.props);
//     return (<div>
//       <div className="row mode_input text rij_verplicht">
//         <div className="label">
//           <label htmlFor={`form${name}`}>{display}</label>
//         </div>

//         <div className="invoer">
//           <input name="" id={`form${name}`} value="" className="input" type="text" {...handler()} placeholder={placeholder} />
//         </div>
//         <div>
//           {touched
//             && hasError('required')
//             && 'Name is required'}
//         </div>

//       </div>
//     </div>);
//   }

//   render() {
//     console.log('render text comp', this.props);
//     return <div>TextInputComponent</div>;
//   }
// }

// TextInputComponent.defaultProps = {
//   name: '',
//   display: '',
//   placeholder: ''
// };

// TextInputComponent.propTypes = {
//   name: PropTypes.string.isRequired,
//   display: PropTypes.string.isRequired,
//   handler: PropTypes.func.isRequired,
//   hasError: PropTypes.func.isRequired,
//   // touched: PropTypes.boolean,
//   // control: PropTypes.shape({
//   //   pristine: PropTypes.boolean,
//   // }),
//   placeholder: PropTypes.string
// };

// export default withFieldControl(TextInputComponent);

