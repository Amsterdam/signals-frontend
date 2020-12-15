# Naming conventions

Date: 2020-09-24

## Status

2020-12-02 Proposed

## Component files

### Principles

- Keep it simple, reduce nesting
- A `src/pages` folder will hold 'root' components and reflect the navigation structure (menu, routes) of the app
- Components needed only by one 'root' component go into that root component's folder, no extra nesting
- Components needed by more than one 'root' component go into `src/components`
- Component folders, files, and auxiliary files, camel cased, starting with upper case
- Component names and file names will be unique
- Generic/shared components, hooks, interfaces, services, in their respective folders in `src`.

### Example tree

```
src
  pages
    login
      Login.tsx
    manage
      default-texts
        DefaultTexts.tsx
        TextsForm.tsx
        SelectForm.tsx
      incidents
        incident
          split
            IncidentSplit.tsx
            SplitForm.tsx
            SplitFormIncident.tsx
          Incident.tsx
        Incidents.tsx
        IncidentsList.tsx
        IncidentsMap.tsx
        Filter.tsx
        FilterTagList.tsx
    report
      Incident.tsx
      IncidentForm.tsx
      IncidentNavigation.tsx
      IncidentPreview.tsx
      IncidentWizard.tsx
    kto
      Kto.tsx
      KtoForm.tsx
    settings
      users
        user
          User.tsx
        Users.tsx
      roles
        role
          Role.tsx
        Roles.tsx
      departments
        department
          Department.tsx
          CategoryGroups.tsx
          CategoryLists.tsx
        Departments.tsx
      categories
        category
          Category.tsx
          CategoryForm.tsx
        Categories.tsx
    App.tsx
    App.styles.ts
    App.test.ts
  components
    RadioInput
      RadioInput.tsx
      RadioInput.styles.ts
      RadioInput.test.ts
    SelectInput
      SelectInput.tsx
      SelectInput.styles.ts
      SelectInput.test.ts
    List
      List.tsx
      List.styles.ts
      List.test.ts
  hooks
    useFetch.ts
    useFetch.test.ts
  interfaces
  services
```

This gives a clear hierarchy without much nesting.

## Styling

Define styled components in a separate file named `<Component>.styles.ts`.

Naming styled components is based on [this article](https://medium.com/inturn-eng/naming-styled-components-d7097950a245).

Import the styles into the component file with

```JavaScript
import * as Styled from './<Component>.styles';
```

Use the styled components in your component as

```JSX
<Styled.Component ...>
```

When you use a styled component as a root for your component, name it the same as the component.
So, for instance, you have a `List` component, this could look as follows

`List.tsx`

```JSX
import * as Styled from './List.styles';

const List = ({ items }) => {
  return (
    <Styled.List>
      {items.map(item => (
        <Styled.Li value={item.name} />
      ))}
    </Styled.List>
  );
};

export default List;
```

`List.styles.ts`

```JavaScript
import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
`;

export const Li = styled.li`
  margin: 0;
`;
```

## Action plan

- Merge `src/shared` to `src`
- Merge or move components from `src/containers` to either `src` or `src/components`
- Merge `src/signals/incident/containers` with `src`
- Merge `src/signals/incident/components` into the (now) root incident component (keep the form components grouped together, for now).
- Continue this process for `incident-management`
