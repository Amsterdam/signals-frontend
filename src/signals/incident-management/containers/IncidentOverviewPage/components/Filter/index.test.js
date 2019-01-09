import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import Filter from './index';

jest.mock('../../../../components/FieldControlWrapper', () => () => 'FieldControlWrapper');
jest.mock('../../../../components/TextInput', () => () => 'TextInput');
jest.mock('../../../../components/SelectInput', () => () => 'SelectInput');
jest.mock('../../../../components/DatePickerInput', () => () => 'DatePickerInput');

describe('<Filter />', () => {
  let wrapper;
  let props;
  const filterSubCategoryList = [{
    key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
    value: 'Duiven',
    slug: 'duiven'
  },
  {
    key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
    value: 'Ganzen',
    slug: 'ganzen'
  }];

  const categories = {
    main: [
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        value: 'Afval',
        slug: 'afval'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
        value: 'Overlast van dieren',
        slug: 'overlast-van-dieren'
      }
    ]
  };

  beforeEach(() => {
    props = {
      statusList: [
        {
          key: '',
          value: 'Alle statussen'
        },
        {
          key: 'm',
          value: 'Gemeld'
        },
        {
          key: 'i',
          value: 'In afwachting van behandeling'
        },
        {
          key: 'b',
          value: 'In behandeling'
        },
        {
          key: 'o',
          value: 'Afgehandeld'
        },
        {
          key: 'h',
          value: 'On hold'
        },
        {
          key: 'a',
          value: 'Geannuleerd'
        }

      ],
      stadsdeelList: [
        {
          key: '',
          value: 'Alle stadsdelen'
        },
        {
          key: 'A',
          value: 'Centrum'
        },
        {
          key: 'B',
          value: 'Westpoort'
        },
        {
          key: 'E',
          value: 'West'
        },
        {
          key: 'M',
          value: 'Oost'
        },
        {
          key: 'N',
          value: 'Noord'
        },
        {
          key: 'T',
          value: 'Zuidoost'
        },
        {
          key: 'K',
          value: 'Zuid'
        },
        {
          key: 'F',
          value: 'Nieuw-West'
        }
      ],
      priorityList: [
        {
          key: '',
          value: 'Alles'
        },
        {
          key: 'normal',
          value: 'Normaal'
        },
        {
          key: 'high',
          value: 'Hoog'
        }
      ],
      onRequestIncidents: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn()
    };

    wrapper = shallow(
      <Filter {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    props.categories = categories;
    props.filterSubCategoryList = filterSubCategoryList;
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should lazy load categories correctly', () => {
    wrapper = shallow(<Filter {...props} />);

    wrapper.setProps({
      filterSubCategoryList
    });

    wrapper.setProps({
      categories
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with set filter correctly ', () => {
    props.filter = {
      id: '',
      incident_date_start: null,
      priority__priority: null,
      main_slug: null,
      sub_slug: null,
      location__address_text: null,
      location__stadsdeel: ['B'],
      status__state: null,

    };
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    wrapper = shallow(<Filter {...props} />);

    expect(wrapper.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      wrapper = shallow(<Filter {...props} />);

      wrapper.setProps({
        filterSubCategoryList,
        categories
      });

      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
    });

    it('should render correctly', () => {
      expect(renderedFormGroup).toMatchSnapshot();
    });

    it('should render 2 buttons', () => {
      expect(renderedFormGroup.find('button').length).toEqual(2);
    });

    it('should lazy load categories correctly with existing filter', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        main_slug: ['overlast-van-dieren'],
        sub_slug: ['ganzen']
      };

      props.filter = filterValue;
      wrapper = shallow(<Filter {...props} />);

      wrapper.setProps({
        categories
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should reset the form when the reset button is clicked', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterEmptyValue = {
        id: null,
        incident_date_start: null,
        priority__priority: null,
        main_slug: null,
        sub_slug: null,
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
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        id: 50,
        location__address_text: 'dam'
      };
      filterForm.setValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(filterValue.location__address_text);

      renderedFormGroup.find('form').simulate('submit', { preventDefault() {} });
      expect(filterForm.value).toEqual(filterValue);
      expect(props.onRequestIncidents).toHaveBeenCalledWith({
        filter: {
          ...filterValue,
          main_slug: [''],
          sub_slug: ['']
        }
      });
    });

    it('should filter when form is submitted with default main_slug and sub_slug', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        main_slug: [['']],
        sub_slug: [['']],
        id: 50,
        location__address_text: 'dam'
      };
      filterForm.setValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(filterValue.location__address_text);

      renderedFormGroup.find('form').simulate('submit', { preventDefault() {} });
      expect(filterForm.value).toEqual(filterValue);
      expect(props.onRequestIncidents).toHaveBeenCalledWith({
        filter: {
          ...filterValue,
          main_slug: null,
          sub_slug: null
        }
      });
    });

    it('should update sub categories when main categories have changed', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        main_slug: ['', 'overlast-van-dieren'],
      };
      filterForm.setValue(filterValue);

      expect(wrapper).toMatchSnapshot();
    });

    it('should update main category to All when main all main categories have been deselected', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterValue = {
        ...filterForm.value,
        main_slug: [],
      };
      filterForm.setValue(filterValue);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
