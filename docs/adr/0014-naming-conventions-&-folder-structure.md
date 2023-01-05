# Naming conventions

Date: 2023-01-04

## Status

2023-01-04 Proposed

## Component files

### Principles

- Keep it simple, reduce nesting
- The aim is to create consitency at all levels in the application

#### Folder structure principles
- A `src/pages` folder will hold 'root' components and reflect the navigation structure (menu, routes) of the app
- Generic/shared components, hooks, interfaces, services, in their respective folders in `src`.
- Tests will be placed in a file next to the file under test with name.test.tsx
- Components needed only by one 'root' component go into that root component's folder in a separate folder with the name of the component, no extra nesting.
- Components needed by more than one 'root' component go into `src/components`

#### Naming principles
- Data-testids are written in `kebak-case`.
- Names of component folders will be written in `PascalCase`, non component folders will be written in `kebab-case`. This includes 'pages', 'services', etc.
- The nested components will prevent as much as possible prefixing with the parent component name.
  A child component of `IncidentSplit` will be `IncidentSplit/ChangeValue` and **not** `IncidentSplitChangeValue`
- Components that have more than one file (containers) will keep the convention that the additional files (like context, reducer, actions, constants, styles, ...) will **not be prefixed** with the component name:


### Example of a `container` component

```
...
IncidentDetail
  AddNote
  ChangeValue
  DetailHeader
  constants.ts
  context.ts
  actions.ts
  actions.test.ts
  IncidentDetail.tsx
  IncidentDetail.test.tsx
  index.tsx
  reducer.ts
  reducer.test.ts
```

### Example main tree

```
src
  pages
    login
      Login.tsx
      Login.test.tsx
      index.ts
    manage
      default-texts
        TextsForm
          TextsForm.test.tsx
          TextsForm.tsx
          index.ts
        SelectForm
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
      Form
      Navigation
      Preview
      Wizard
      Report.tsx
      index.ts
    kto  
      Form
        Form.tsx
      Kto.tsx
      Kto.tests.tsx
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
      RadioInput.test.ts
      RadioInput.tsx
      index.ts
      styles.ts
    SelectInput
      SelectInput.test.ts
      SelectInput.tsx
      index.ts
      styles.ts
    ...
  hooks
    useFetch.test.ts
    useFetch.ts
    useDebounce.ts
    useDebounce.test.ts
  interfaces
  services
  types
```

This gives a clear hierarchy without much nesting.
