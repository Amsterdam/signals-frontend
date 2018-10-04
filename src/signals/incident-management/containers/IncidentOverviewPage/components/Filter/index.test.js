import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import Filter from './index';

jest.mock('../../../../components/FieldControlWrapper', () => 'FieldControlWrapper');

describe('<Filter />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      mainCategoryList: [
        {
          key: '',
          value: 'Alles'
        },
        {
          key: 'Afval',
          value: 'Afval'
        },
        {
          key: 'Openbaar groen en water',
          value: 'Openbaar groen en water'
        },
        {
          key: 'Overlast Bedrijven en Horeca',
          value: 'Overlast Bedrijven en Horeca'
        },
        {
          key: 'Overlast in de openbare ruimte',
          value: 'Overlast in de openbare ruimte'
        },
        {
          key: 'Overlast op het water',
          value: 'Overlast op het water'
        },
        {
          key: 'Overlast van dieren',
          value: 'Overlast van dieren'
        },
        {
          key: 'Overlast van en door personen of groepen',
          value: 'Overlast van en door personen of groepen'
        },
        {
          key: 'Wegen, verkeer, straatmeubilair',
          value: 'Wegen, verkeer, straatmeubilair'
        },
        {
          key: 'Overig',
          value: 'Overig'
        }
      ],
      subcategoryList: [
        {
          key: '',
          value: 'Alles'
        },
        {
          key: 'Asbest / accu',
          value: 'Asbest / accu'
        },
        {
          key: 'Bedrijfsafval',
          value: 'Bedrijfsafval'
        },
        {
          key: 'Container is kapot',
          value: 'Container is kapot'
        },
        {
          key: 'Container is vol',
          value: 'Container is vol'
        },
        {
          key: 'Container voor plastic afval is kapot',
          value: 'Container voor plastic afval is kapot'
        },
        {
          key: 'Container voor plastic afval is vol',
          value: 'Container voor plastic afval is vol'
        },
        {
          key: 'Grofvuil',
          value: 'Grofvuil'
        },
        {
          key: 'Huisafval',
          value: 'Huisafval'
        },
        {
          key: 'Overig afval',
          value: 'Overig afval'
        },
        {
          key: 'Prullenbak is kapot',
          value: 'Prullenbak is kapot'
        },
        {
          key: 'Prullenbak is vol',
          value: 'Prullenbak is vol'
        },
        {
          key: 'Puin / sloopafval',
          value: 'Puin / sloopafval'
        },
        {
          key: 'Veeg- / zwerfvuil',
          value: 'Veeg- / zwerfvuil'
        }
      ],
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
    expect(wrapper).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    expect(wrapper.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
    });

    it('should render correctly', () => {
      expect(renderedFormGroup).toMatchSnapshot();
    });

    it('should render 2 buttons', () => {
      expect(renderedFormGroup.find('button').length).toEqual(2);
    });

    it('should reset the form when the reset button is clicked', () => {
      const filterForm = wrapper.instance().filterForm;
      const filterEmptyValue = {
        id: null,
        incident_date_start: null,
        priority__priority: null,
        category__main: null,
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
      const filterForm = wrapper.instance().filterForm;
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

    it('should not render subcategoryList when there are less than 2 items', () => {
      wrapper.setProps({
        subcategoryList: [1, 2]
      });

      expect(renderedFormGroup).toMatchSnapshot();
    });
  });
});
