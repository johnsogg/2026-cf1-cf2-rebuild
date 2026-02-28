import * as ts from "typescript";

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

type WorkerMessage = {
  studentCode: string;
  testCode: string;
};

type WorkerResponse = {
  results: TestResult[];
  logs: string[];
  error?: string;
};

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { studentCode, testCode } = e.data;
  const logs: string[] = [];

  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        strict: false,
      },
    };

    const studentJS = ts.transpileModule(studentCode, transpileOpts).outputText;
    const testJS = ts.transpileModule(testCode, transpileOpts).outputText;

    const script = buildScript(studentJS, testJS);

    const fn = new Function(script);
    const results: TestResult[] = fn();

    const response: WorkerResponse = { results, logs };
    self.postMessage(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const response: WorkerResponse = { results: [], logs, error: message };
    self.postMessage(response);
  } finally {
    console.log = originalLog;
  }
};

function buildScript(studentJS: string, testJS: string): string {
  return `
    // --- Minimal module system ---
    const studentExports = {};
    const require = (name) => {
      if (name === './usingGit' || name === './solution' || name === './main') {
        return studentExports;
      }
      throw new Error('Unknown module: ' + name);
    };

    // --- Run student code, capturing exports ---
    (function(exports) {
      ${studentJS}
    })(studentExports);

    // --- Minimal test runner ---
    const results = [];

    const test = (name, fn) => {
      try {
        fn();
        results.push({ name, passed: true });
      } catch(e) {
        results.push({ name, passed: false, error: e.message });
      }
    };

    const expect = (actual) => ({
      toBe: (expected) => {
        if (actual !== expected)
          throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected))
          throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      },
      toBeNull: () => {
        if (actual !== null)
          throw new Error('Expected null, got ' + JSON.stringify(actual));
      },
      toBeDefined: () => {
        if (actual === undefined)
          throw new Error('Expected defined value, got undefined');
      },
      not: {
        toBe: (expected) => {
          if (actual === expected)
            throw new Error('Expected not ' + JSON.stringify(expected));
        },
        toBeNull: () => {
          if (actual === null)
            throw new Error('Expected non-null value');
        },
        toBeDefined: () => {
          if (actual !== undefined)
            throw new Error('Expected undefined');
        },
      },
    });

    // --- Run test code ---
    // Transpiled CJS emits Object.defineProperty(exports, "__esModule", ...) at the top,
    // so we provide a local exports object to absorb those calls.
    const exports = {};
    ${testJS}

    return results;
  `;
}
