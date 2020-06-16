import React from 'react';
// import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { Validators } from 'react-reactive-form';

import { withAppContext } from 'test/utils';

import Header from './index';

describe('Form component <Header />', () => {
  // let wrapper;
  // let meta;
  // let options;
  // let touched;
  // let getError;
  // let hasError;

  beforeEach(() => {
    // meta = {
    //   label: 'naam',
    // };
    // options = {};
    // touched = false;
    // getError = jest.fn();
    // hasError = jest.fn();

    // wrapper = shallow(
    //   <Header meta={meta} options={options} touched={touched} hasError={hasError} getError={getError} />
    // );
  });

  it('should render label', () => {
    const label = 'Foo barrrr';
    const { getByText } = render(withAppContext(<Header hasError={() => {}} meta={{ label }} />));

    expect(getByText(label)).toBeInTheDocument();
  });

  it('should render optional indicator', () => {
    const label = 'Zork';
    const options = {
      validators: [Validators.required],
    };
    const { rerender, queryByText } = render(withAppContext(<Header hasError={() => {}} meta={{ label }} options={{}} />));

    expect(queryByText('(optioneel)')).toBeInTheDocument();

    rerender(withAppContext(<Header hasError={() => {}} options={{}} />));

    expect(queryByText('(optioneel)')).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={() => {}} meta={{ label }} options={options} />));

    expect(queryByText('(optioneel)')).not.toBeInTheDocument();
  });

  it('should render subtitle', () => {
    const subtitle = 'Bar bazzz';
    const { getByText } = render(withAppContext(<Header hasError={() => {}} meta={{ subtitle }} />));

    expect(getByText(subtitle)).toBeInTheDocument();
  });

  it('should render children', () => {
    const { container } = render(
      withAppContext(
        <Header hasError={() => {}}>
          <span className="child" />
        </Header>
      )
    );

    expect(container.querySelector('.child')).toBeInTheDocument();
  });

  it('should render required error', () => {
    const hasError = prop => prop === 'required';

    const { queryByText, rerender } = render(withAppContext(<Header hasError={() => false} touched />));

    expect(queryByText('Dit is een verplicht veld')).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} touched />));

    expect(queryByText('Dit is een verplicht veld')).toBeInTheDocument();
  });

  it('should render email error', () => {
    const hasError = prop => prop === 'email';

    const { queryByText, rerender } = render(withAppContext(<Header hasError={() => false} touched />));

    expect(queryByText('Het moet een geldig e-mailadres zijn')).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} touched />));

    expect(queryByText('Het moet een geldig e-mailadres zijn')).toBeInTheDocument();
  });

  it('should render maxLength error', () => {
    const requiredLength = 300;
    const hasError = prop => prop === 'maxLength';
    const getError = () => ({ requiredLength });

    const { queryByText, rerender } = render(withAppContext(<Header hasError={() => false} getError={getError} touched />));

    expect(queryByText(`U kunt maximaal ${requiredLength} tekens invoeren.`)).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} getError={getError} touched />));

    expect(queryByText(`U kunt maximaal ${requiredLength} tekens invoeren.`)).toBeInTheDocument();
  });

  it('should render custom error', () => {
    const error = 'Hic sunt dracones';
    const hasError = prop => prop === 'custom';
    const getError = () => error;

    const { queryByText, rerender } = render(withAppContext(<Header hasError={() => false} getError={getError} touched />));

    expect(queryByText(error)).not.toBeInTheDocument();

    rerender(withAppContext(<Header hasError={hasError} getError={getError} touched />));

    expect(queryByText(error)).toBeInTheDocument();
  });

  it('should not render error when not touched', () => {
    const hasError = prop => prop === 'required';
    const touched = false;

    const { queryByText } = render(withAppContext(<Header hasError={hasError} touched={touched} />));

    expect(queryByText('Dit is een verplicht veld')).not.toBeInTheDocument();
  });
});
