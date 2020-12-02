# Naming conventions

Date: 2020-09-24

## Status

2020-12-02 Proposed

## Component files

### Principles

- Keep it simple, reduce nesting
- 'container'-type components in their own folder directly under `src`.
- Components needed only by one 'root' component go into that root component's folder, no extra nesting
- Components needed by more than one 'root' component go into `src/components`
- Component folders, files, and auxiliary files, camel cased, starting with upper case
- Component names and file names will be unique
- Unique `data-testid` names by prefixing them with component names
- 'root' level components, hooks, interfaces, services, in their respective floders.

### Example tree

```
src
  App
    App.tsx
    App.styles.ts
    App.test.ts
  DefaultTexts
  Filter
  IncidentDetail
  IncidentOverview
  IncidentSplit
    IncidentSplit.tsx
    IncidentSplit.styles.ts
    IncidentSplit.test.ts
    IncidentSplitForm.tsx
    IncidentSplitForm.styles.ts
    IncidentSplitForm.test.ts
    IncidentSplitFormIncident.tsx
    IncidentSplitFormIncident.styles.ts
    IncidentSplitFormIncident.test.ts
  IncidentWizard
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
