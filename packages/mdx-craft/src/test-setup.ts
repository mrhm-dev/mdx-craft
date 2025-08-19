import '@testing-library/jest-dom'

// Mock function interface
interface MockFunction {
  (...args: any[]): any
  mock: {
    calls: any[][]
    instances: any[]
    contexts: any[]
    results: any[]
    lastCall?: any[]
    returnValue?: any
    implementation?: (...args: any[]) => any
  }
  mockReturnValue: (value: any) => MockFunction
  mockImplementation: (fn: (...args: any[]) => any) => MockFunction
  mockReset: () => MockFunction
  mockClear: () => MockFunction
  mockRestore?: () => void
  _isMockFunction: boolean
  getMockName: () => string
}

// Create Jest mock implementation
;(globalThis as any).jest = {
  fn: (): MockFunction => {
    const mockFn = function (...args: any[]) {
      mockFn.mock.calls.push(args)
      mockFn.mock.lastCall = args
      if (mockFn.mock.implementation) {
        return mockFn.mock.implementation(...args)
      }
      return mockFn.mock.returnValue
    } as any as MockFunction

    // Add Jest-compatible mock object
    mockFn.mock = {
      calls: [],
      instances: [],
      contexts: [],
      results: [],
      lastCall: undefined,
      returnValue: undefined,
      implementation: undefined,
    }

    // Add Jest matcher methods
    mockFn.mockReturnValue = (value: any) => {
      mockFn.mock.returnValue = value
      return mockFn
    }

    mockFn.mockImplementation = (fn: (...args: any[]) => any) => {
      mockFn.mock.implementation = fn
      return mockFn
    }

    mockFn.mockReset = () => {
      mockFn.mock.calls = []
      mockFn.mock.instances = []
      mockFn.mock.contexts = []
      mockFn.mock.results = []
      mockFn.mock.lastCall = undefined
      return mockFn
    }

    mockFn.mockClear = () => {
      mockFn.mock.calls = []
      mockFn.mock.instances = []
      return mockFn
    }

    // Make it compatible with Jest matchers
    mockFn._isMockFunction = true
    mockFn.getMockName = () => 'jest.fn()'

    return mockFn
  },
  clearAllMocks: () => {},
  spyOn: (obj: any, method: string) => {
    const original = obj[method]
    const spy = (globalThis as any).jest.fn()
    obj[method] = spy
    spy.mockRestore = () => {
      obj[method] = original
    }
    return spy
  },
}

// Mock CSS imports
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function (query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    }
  },
})

// Mock ResizeObserver
;(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
