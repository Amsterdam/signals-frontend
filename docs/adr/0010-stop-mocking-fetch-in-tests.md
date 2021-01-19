# Replace mocking fetch with `msw`

Date: 2021-01-14

## Status

2021-01-14 Proposed

## Context

For mocking unittests we are using at this moment the `jest-fetch-mock` package. This works but there are new develoments on the market. As the creator of the [Testing Library](https://testing-library.com/) suggests in this [article](https://kentcdodds.com/blog/stop-mocking-fetch), there is a new strategy available that would simplify testing of components that are making fetch calls.

# Technical description
The `msw` server intercepts the fetch calls and returns the configured response. This is done outside the test file and only overrides of the standard responses from the default configuration need to be added to the respective test file. [Here is the documentation](https://github.com/mswjs/msw).

## Consideratons
Here are few advantages of introducing this library:
- All the fetch/mocking can moved to one place (internals/testing)
- The tests involving fetch will be simpler and easier to read/write
- Enforces using the correct data/types, no half mock objects
- E2e tests can also benefit from the msw setup and can use fixtures, the same way the unit tests can

## Decision
The `jest-fetch-mock` will be removed and the mocking will be done by using the the `msw` package


## Refactoring plan
- Add the `msw` package and create the configuration in the `internals folder`
- Use for the configuration the existing features that are already present in `utils/__tests__/fixtures`
- Start small, replace the `jest-fetch-mock` only in the changed files.


## Consequences

- There will be a transition period where both `jest-fetch-mock` and `msw` will coexist.
- This change will increase the readability and simplify the unittests.
