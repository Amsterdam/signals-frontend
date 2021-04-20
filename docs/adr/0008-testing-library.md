# Testing Library conventions

Date: 2020-10-27

## Status

2020-10-27 Proposed
2020-10-27 Approved

## Conventions

We are already using the [Testing Library](https://testing-library.com/). Some insights on how to use the testing library have come to light, thought. These insights are explained by the developer of the testing library in the article _[Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)_. Let us use these conventions as explained in his article.

## Refactoring plan

Some things can be changed directly in the whole code base, like removing `cleanup` and removing unnecessary `waitFor` statements. Other things will have to be changed gradually over time throughout the codebase, like (but not limited to) using `userEvent` instead of `fireEvent` as much as possible and removing unnecessary `act` statements.

## Consequences

This will result in easier reading, writing and refactoring of unit tests.
