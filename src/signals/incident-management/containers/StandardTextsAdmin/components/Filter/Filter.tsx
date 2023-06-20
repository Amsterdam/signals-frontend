// import RadioButtonList from 'components/RadioButtonList'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'
import { RadioGroup } from '../../../../components/FilterForm/components/RadioGroup'
interface Props {
  setStatusFilter: (filter: any) => void
  setActiveFilter: (active: any) => void
}

const activeOption = [
  {
    key: 'true',
    value: 'Actief',
  },
  {
    key: 'false',
    value: 'Non-actief',
  },
]

export const Filter = ({ setStatusFilter, setActiveFilter }: Props) => {
  const options = changeStatusOptionList.map((option) => ({
    key: option.key,
    value: option.value,
  }))

  const onStatusChange = (_groupName: any, option: any) => {
    setStatusFilter(option)
  }

  const onActiveChange = (_groupName: any, option: any) => {
    setActiveFilter(option)
  }

  //   const { control, getValues, watch, setValue } = useForm({
  //     defaultValues: {
  //       state: 'o',
  //       //   category_url: firstSubcategory[0]?.key,
  //       //   sub_slug: null,
  //       //   main_slug: null,
  //     },
  //   })

  return (
    <form data-testid="select-form-form" className="select-form__form">
      {/* <Controller
        name="state"
        control={control}
        render={({ field: { name, value, onChange } }) => ( */}

      <RadioGroup
        label="Filter op status"
        // display="Status"
        name="status-filter"
        options={options}
        onChange={onStatusChange}
        // value={value}
      />

      <RadioGroup
        label="Filter op actief/non-actief"
        // display="Status"
        name="is-actief-filter"
        options={activeOption}
        onChange={onActiveChange}
        // value={value}
      />

      {/* )}
      /> */}
    </form>
  )
}
