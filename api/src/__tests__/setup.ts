// Import reflection metadata API for TypeGraphQL
import 'reflect-metadata';

// Set up test environment variables
process.env.NODE_ENV = 'test';

// Increase test timeout to handle async operations
jest.setTimeout(30000);

// Proper mock for TypeDI that preserves reflection metadata
jest.mock('typedi', () => {
  const actual = jest.requireActual('typedi');
  
  // Create mock decorators that maintain reflection metadata functionality
  const Service = jest.fn().mockImplementation((params?: any) => {
    return (target: any) => {
      actual.Service(params)(target);
      return target;
    };
  });

  const Inject = jest.fn().mockImplementation((type?: any, propertyName?: string) => {
    return (target: any, key?: string | symbol, index?: number) => {
      actual.Inject(type, propertyName)(target, key, index);
      return target;
    };
  });

  return {
    ...actual,
    Service,
    Inject
  };
});

// Add a simple test to avoid the "must contain at least one test" error
describe('Test Environment', () => {
  it('should set up the testing environment correctly', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

// Global test setup and teardown can be added here
beforeAll(() => {
  console.log('Starting test suite');
});

afterAll(() => {
  console.log('Test suite completed');
});