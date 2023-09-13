/* eslint-disable jest/no-mocks-import */
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { server } from './jest/__mocks__/server';

// Establish API mocking before all tests.
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
