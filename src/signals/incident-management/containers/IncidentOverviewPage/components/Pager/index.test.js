import React from 'react';
import { shallow } from 'enzyme';

import Pager from './index';

describe('<Pager />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    // There are 3 pages, it renders (vorige 1 2 3 volgende), 2 is selected and not clickable
    props = {
      page: 2,
      onPageChanged: jest.fn(),
      incidentsCount: 200
    };

    renderedComponent = shallow(
      <Pager {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });

  it('should render 4 links (vorige 1 3 volgende)', () => {
    expect(renderedComponent.find('a').length).toEqual(4);
  });

  it('should move to the second page when 2 is clicked', () => {
    expect(renderedComponent.find('a').length).toEqual(4);

    renderedComponent.find('a').at(1).simulate('click');
    expect(props.onPageChanged).toHaveBeenCalledWith(1);
  });
});
