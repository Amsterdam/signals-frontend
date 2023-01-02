# Naming conventions

Date: 2022-12-22

## Status

2020-12-02 Proposed |
2020-02-11 Approved |
2022-12-22 Change

## Component files

### Principles

- Keep it simple, reduce nesting
- The aim is to create consitency at all levels in the application
- data-testid's will be written in `kebab-case`
- A `src/pages` folder will hold 'root' components and reflect the navigation structure (menu, routes) of the app
- Generic/shared components, hooks, interfaces, services, in their respective folders in `src`.
- Tests will be placed in a file next to the file under test. The naming of said test file will be the same as the file under test with an addendum .test.tsx. 
- Components needed only by one 'root' component go into that root component's folder in a separate folder with the name of the component, no extra nesting.
- Components needed by more than one 'root' component go into `src/components`
- Component folders will be written in `PascalCase`, non component folders will be written in `kebab-case`. This includes 'pages', 'services', etc.
- The nested components will prevent as much as possible prefixing with the parent component name.
  A child component of `IncidentSplit` will be `IncidentSplit/ChangeValue` and **not** `IncidentSplitChangeValue`
- Components that have more than one file (containers) will keep the convention that the additional files (like context, reducer, actions, constants, styles, ...) will **not be prefixed** with the component name:

### Example of a `container` component

```
...
IncidentDetail
  __tests__
    actions.test.ts
    IncidentDetail.test.tsx
    reducer.test.ts
  AddNote
  ChangeValue
  DetailHeader
  constants.ts
  context.ts
  actions.ts
  IncidentDetail.tsx
  index.tsx
  reducer.ts
```

### Example main tree

```
src
  pages
    login
      __tests__
        Login.test.tsx
      Login.tsx
      index.ts
    manage
      default-texts
        __tests__
        TextsForm
          __tests__
            TextsForm.test.tsx
          TextsForm.tsx
          index.ts
        SelectForm
          __tests__
            SelectForm.test.tsx
          SelectForm.tsx
          index.ts
        DefaultTexts.tsx
        index.ts
      incidents
        incident
          split
            Split.tsx
            ...
          Incident.tsx
        Incidents
        ...
    report
      __tests__
      Form
      Navigation
      Preview
      Wizard
      Report.tsx
      index.ts
    kto
      __tests__
        Kto.tests.tsx
      Form
        __tests__
        Form.tsx
      Kto.tsx
      index.ts
    settings
      users
      ...
      roles
      ...
      departments
      ...
      categories
      ...
    App.tsx
    styles.ts
  components
    RadioInput
      __tests__
        RadioInput.test.ts
      RadioInput.tsx
      index.ts
      styles.ts
    SelectInput
      __tests__
        SelectInput.test.ts
      SelectInput.tsx
      index.ts
      styles.ts
    ...
  hooks
    __tests__
      useFetch.test.ts
      useDebounce.test.ts
    useFetch.ts
    useDebounce.ts
  interfaces
  services
  types
```

This gives a clear hierarchy without much nesting.


