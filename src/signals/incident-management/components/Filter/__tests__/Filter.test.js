import React from 'react';
import { mount } from 'enzyme';
import { FormBuilder } from 'react-reactive-form';
import { render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Filter, { defaults } from '../';

describe('signals/incident-management/components/Filter', () => {
  let props;
  const filterSubCategoryList = [
    {
      key:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
      value: 'Duiven',
      slug: 'duiven',
    },
    {
      key:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
      value: 'Ganzen',
      slug: 'ganzen',
    },
    {
      key:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
      value: 'Asbest / accu',
      slug: 'asbest-accu',
    },
    {
      key:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/ategories/afval/sub_categories/container-is-kapot',
      value: 'Container is kapot',
      slug: 'container-is-kapot',
    },
  ];

  const categories = {
    main: [
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        value: 'Afval',
        slug: 'afval',
      },
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
        value: 'Overlast van dieren',
        slug: 'overlast-van-dieren',
      },
    ],
  };

  beforeEach(() => {
    props = {
      statusList: [
        {
          key: '',
          value: 'Alle statussen',
        },
        {
          key: 'm',
          value: 'Gemeld',
        },
        {
          key: 'i',
          value: 'In afwachting van behandeling',
        },
        {
          key: 'b',
          value: 'In behandeling',
        },
        {
          key: 'o',
          value: 'Afgehandeld',
        },
        {
          key: 'h',
          value: 'On hold',
        },
        {
          key: 'a',
          value: 'Geannuleerd',
        },
      ],
      stadsdeelList: [
        {
          key: '',
          value: 'Alle stadsdelen',
        },
        {
          key: 'A',
          value: 'Centrum',
        },
        {
          key: 'B',
          value: 'Westpoort',
        },
        {
          key: 'E',
          value: 'West',
        },
        {
          key: 'M',
          value: 'Oost',
        },
        {
          key: 'N',
          value: 'Noord',
        },
        {
          key: 'T',
          value: 'Zuidoost',
        },
        {
          key: 'K',
          value: 'Zuid',
        },
        {
          key: 'F',
          value: 'Nieuw-West',
        },
      ],
      priorityList: [
        {
          key: '',
          value: 'Alles',
        },
        {
          key: 'normal',
          value: 'Normaal',
        },
        {
          key: 'high',
          value: 'Hoog',
        },
      ],
      onRequestIncidents: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should initialise form instance', () => {
    const groupSpy = jest.spyOn(FormBuilder, 'group');
    render(withAppContext(<Filter {...props} />));

    expect(groupSpy).toHaveBeenCalledWith(defaults);

    FormBuilder.group.mockRestore();
  });

  it('should render a form', () => {
    render(withAppContext(<Filter {...props} />));

    expect(document.querySelectorAll('form')).toHaveLength(1);
  });

  it('should render filter selects', () => {
    render(
      withAppContext(
        <Filter
          {...props}
          categories={categories}
          filterSubCategoryList={filterSubCategoryList}
        />,
      ),
    );

    expect(document.getElementById('formmain_slug').options).toHaveLength(
      Object.keys(categories.main).length + 1,
    );
    expect(document.getElementById('formsub_slug').options).toHaveLength(
      Object.keys(filterSubCategoryList).length + 1,
    );
    expect(
      document.getElementById('formlocation__stadsdeel').options,
    ).toHaveLength(Object.keys(props.stadsdeelList).length);
    expect(document.getElementById('formstatus__state').options).toHaveLength(
      Object.keys(props.statusList).length,
    );
  });

  it('should render buttons', () => {
    render(withAppContext(<Filter {...props} />));

    expect(document.querySelectorAll('button')).toHaveLength(3);
  });

  describe('FieldGroup', () => {
    const onMainCategoryFilterSelectionChanged = jest.fn();

    it('should reset the form when the reset button is clicked', () => {
      const onRequestIncidents = jest.fn();
      const tree = mount(
        withAppContext(
          <Filter
            {...{
              ...props,
              filterSubCategoryList,
              categories,
              onRequestIncidents,
              onMainCategoryFilterSelectionChanged,
            }}
          />,
        ),
      );
      const { filterForm } = tree.find(Filter).instance();

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

      tree.find('button[type="reset"]').simulate('click');
      expect(filterForm.reset).toHaveBeenCalled();
      expect(onRequestIncidents).toHaveBeenCalled();
      expect(filterForm.value).toEqual(filterEmptyValue);

      tree.unmount();
    });

    it('should filter when form is submitted', () => {
      const onRequestIncidents = jest.fn();
      const onSubmit = jest.fn();
      const tree = mount(
        withAppContext(
          <Filter
            {...{
              ...props,
              filterSubCategoryList,
              categories,
              onRequestIncidents,
              onSubmit,
              onMainCategoryFilterSelectionChanged,
            }}
          />,
        ),
      );
      const { filterForm } = tree.find(Filter).instance();
      const filterValue = {
        ...filterForm.value,
        id: 50,
        location__address_text: 'dam',
      };

      filterForm.setValue(filterValue);

      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(
        filterValue.location__address_text,
      );

      tree.find('form').simulate('submit');

      expect(filterForm.value).toEqual(filterValue);
      expect(onRequestIncidents).toHaveBeenCalledWith({
        filter: {
          ...filterValue,
          main_slug: [''],
          sub_slug: [''],
        },
      });
      expect(onSubmit).toHaveBeenCalled();

      tree.unmount();
    });

    it('should filter when form is submitted with default main_slug and sub_slug', () => {
      const onRequestIncidents = jest.fn();
      const tree = mount(
        withAppContext(
          <Filter
            {...{
              ...props,
              filterSubCategoryList,
              categories,
              onRequestIncidents,
              onMainCategoryFilterSelectionChanged,
            }}
          />,
        ),
      );
      const { filterForm } = tree.find(Filter).instance();
      const filterValue = {
        ...filterForm.value,
        main_slug: [['']],
        sub_slug: [['']],
        id: 50,
        location__address_text: 'dam',
      };
      filterForm.setValue(filterValue);
      expect(filterForm.value.id).toEqual(filterValue.id);
      expect(filterForm.value.location__address_text).toEqual(
        filterValue.location__address_text,
      );

      tree.find('form').simulate('submit');

      expect(filterForm.value).toEqual(filterValue);
      expect(onRequestIncidents).toHaveBeenCalledWith({
        filter: {
          ...filterValue,
          main_slug: null,
          sub_slug: null,
        },
      });

      tree.unmount();
    });

    it('should update sub categories when main categories have changed', () => {
      const onRequestIncidents = jest.fn();
      const onMainCategoryFilterSelectionChangedFn = jest.fn();
      const tree = mount(
        withAppContext(
          <Filter
            {...{
              ...props,
              filterSubCategoryList,
              categories,
              onRequestIncidents,
              onMainCategoryFilterSelectionChanged: onMainCategoryFilterSelectionChangedFn,
            }}
          />,
        ),
      );

      const { filterForm } = tree.find(Filter).instance();
      const filterValue = {
        ...filterForm.value,
        main_slug: ['', 'overlast-van-dieren'],
      };

      filterForm.setValue(filterValue);

      expect(onMainCategoryFilterSelectionChangedFn).toHaveBeenCalledTimes(2);
      expect(onMainCategoryFilterSelectionChangedFn).toHaveBeenLastCalledWith({
        selectedOptions: ['', 'overlast-van-dieren'],
        categories,
      });
    });

    it('should update main category to All when main all main categories have been deselected', () => {
      const onRequestIncidents = jest.fn();
      const onMainCategoryFilterSelectionChangedFn = jest.fn();
      const tree = mount(
        withAppContext(
          <Filter
            {...{
              ...props,
              filterSubCategoryList,
              categories,
              onRequestIncidents,
              onMainCategoryFilterSelectionChanged: onMainCategoryFilterSelectionChangedFn,
            }}
          />,
        ),
      );

      const { filterForm } = tree.find(Filter).instance();
      const filterValue = {
        ...filterForm.value,
        main_slug: [],
      };
      filterForm.setValue(filterValue);

      expect(onMainCategoryFilterSelectionChangedFn).toHaveBeenCalledTimes(2);
      expect(onMainCategoryFilterSelectionChangedFn).toHaveBeenLastCalledWith({
        selectedOptions: [],
        categories,
      });
    });
  });
});
