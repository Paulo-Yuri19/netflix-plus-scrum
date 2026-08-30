const createStorageMock = () => {
    let store = {};

    return {
        getItem: jest.fn((key) => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
        setItem: jest.fn((key, value) => {
            store[key] = String(value);
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        key: jest.fn((index) => Object.keys(store)[index] || null),
        get length() {
            return Object.keys(store).length;
        },
    };
};

const installBrowserTestDoubles = () => {
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: createStorageMock(),
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
        configurable: true,
        value: createStorageMock(),
    });
    Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: {
            getRandomValues: jest.fn((values) => {
                values.forEach((_, index) => {
                    values[index] = index + 1;
                });
                return values;
            }),
        },
    });

    globalThis.__navigationMock = {
        assign: jest.fn(),
        replace: jest.fn(),
    };
};

globalThis.createStorageMock = createStorageMock;
globalThis.installBrowserTestDoubles = installBrowserTestDoubles;

beforeEach(() => {
    jest.clearAllMocks();
    installBrowserTestDoubles();
    jest.useRealTimers();
});

afterEach(() => {
    jest.restoreAllMocks();
});
