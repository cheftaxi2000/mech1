/**
 * Every program or snippet that the Informatik lessons show and run lives here, once. The tests run them in the interpreter and compare
 * with `fixtures.json`, the output recorded from real g++ runs (`WRITE_CPP_FIXTURES=1 npx vitest run src/info/cpp`);
 * where g++ is installed the fixtures are re-checked against it, so they cannot go stale. Lessons import from this file; nothing is typed twice.
 */
export interface Prog {
  /** The code as shown to the student. */
  code: string;
  /** A fragment is wrapped into `int main() { … }` (with the includes below) for compiling. */
  fragment?: boolean;
  /** Extra text placed before the wrapped fragment, e.g. `#include <cmath>`. */
  includes?: string[];
  stdin?: string;
  /** Programs that must be rejected by the compiler: a phrase that has to appear in g++'s error message. */
  compileError?: string;
  /** The run is expected to end in a runtime error (undefined behavior shown on purpose). */
  runtimeError?: boolean;
}

export const P = {
  power8: {
    code: `#include <iostream>
int main() {
    // input
    std::cout << "Compute a^8 for a = ? ";
    int a;
    std::cin >> a;
    // computation
    int b = a * a; // b = a^2
    b = b * b;     // b = a^4
    // output b * b, i.e., a^8
    std::cout << a << "^8 = " << b * b << "\\n";
    return 0;
}`,
    stdin: '2\n',
  },

  // ------------------------------------------------------------------ chapter I1
  power8Messy: {
    code: `#include <iostream>
int main(){std::cout << "Compute a^8 for a = ? ";int a;std::cin
           >> a; int b = a     * a; b
= b * b;std::cout    << a << "^8 = " << b* b << "\\n";return 0;                               }`,
    stdin: '2\n',
  },
  hardcoded: {
    code: `#include <iostream>
int main() {
    std::cout << "the eighth power of two:\\n";
    std::cout << "2^8 = " << 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2;
    return 0;
}`,
  },
  syntaxOk: {
    fragment: true,
    code: `int a = 3;
// computation
int b = a * a; // b = a^2
b = b * b;     // b = a^4
std::cout << b;`,
  },
  errMissingSemi: { fragment: true, code: `int a = 3\nint b = a * a;`, compileError: "expected ',' or ';' before 'int'" },
  wrongResult: { fragment: true, code: `int a = 3;\nint b = a * a;   // intended: b = a^4\nstd::cout << b;` },
  divZero: { fragment: true, code: `int x = 0;\nstd::cout << 5 / x;`, runtimeError: true },
  errNoInclude: {
    code: `int main() {\n    std::cout << "2^8 = 256";\n    return 0;\n}`,
    compileError: "'cout' is not a member of 'std'",
  },
  varsRead: { fragment: true, code: `int x = 2;\nint y = x + 2;\nstd::cout << x << " " << y << " " << 3 * x;` },
  declAssign: { fragment: true, code: `int x;      // declaration: x exists, value undefined\nx = 2;      // assignment: store 2 in x\nstd::cout << x;\nx = 3;\nstd::cout << x;` },
  incr: { fragment: true, code: `int x = 2;\nx = x + 1;\nstd::cout << x;` },
  truncation: { fragment: true, code: `int x = 3.5;\nint y = -3.5;\nstd::cout << x << " " << y;` },
  swapWrong: { fragment: true, code: `int a = 1;\nint b = 2;\na = b;\nb = a;\nstd::cout << a << " " << b;` },
  swapRight: { fragment: true, code: `int a = 1;\nint b = 2;\nint t = a;\na = b;\nb = t;\nstd::cout << a << " " << b;` },
  uninit: { fragment: true, code: `int x;\nstd::cout << x;`, runtimeError: true },
  errUndeclared: { fragment: true, code: `int my_Number = 4;\nstd::cout << my_number;`, compileError: "'my_number' was not declared in this scope" },
  errLvalue: { fragment: true, code: `int x;\n2 = x;`, compileError: 'lvalue required as left operand of assignment' },
  errStringToInt: { fragment: true, code: `int x = "hello";`, compileError: "invalid conversion from 'const char*' to 'int'" },
  errConstAssign: { fragment: true, code: `const int speed_of_light = 299792458;\nspeed_of_light = 300000;`, compileError: "assignment of read-only variable 'speed_of_light'" },
  chainAssign: { fragment: true, code: `int x;\nint y;\nx = (y = 3);\nstd::cout << x << y;` },
  assignValue: { fragment: true, code: `int x;\nint y = 2;\nstd::cout << (x = y);\nstd::cout << x;` },
  expressionStatement: { fragment: true, code: `int x = 2;\nx * x;      // computes 4, then discards it\nstd::cout << x;` },
  power8Vars: {
    code: `#include <iostream>
int main() {
    int x;
    std::cout << "Compute a^8 for a = ? ";
    std::cin >> x;
    int x_squared = x * x;
    int x_to_the_four = x_squared * x_squared;
    int x_to_the_eight = x_to_the_four * x_to_the_four;
    std::cout << x << "^8 = " << x_to_the_eight << "\\n";
    return 0;
}`,
    stdin: '2\n',
  },
  constOk: { fragment: true, code: `const int speed_of_light = 299792458;\nstd::cout << speed_of_light / 1000;` },

  power8Big: {
    code: `#include <iostream>
int main() {
    int a;
    std::cin >> a;
    int b = a * a;
    b = b * b;
    std::cout << a << "^8 = " << b * b << "\\n";
    return 0;
}`,
    stdin: '100\n',
  },
  coutNoSpace: { fragment: true, code: `std::cout << 1 << 2;\nstd::cout << "a" << "b";\nstd::cout << 3;` },
  escapes: { fragment: true, code: `std::cout << "col1\\tcol2\\n";\nstd::cout << "she said \\"hi\\"\\n";\nstd::cout << "path\\\\to\\\\file\\n";` },
  twoLines: { fragment: true, code: `std::cout << "line one\\n";\nstd::cout << "line two";\nstd::cout << " continues";` },

  errModDouble: { fragment: true, code: `int a = 3 % 2.5;`, compileError: "invalid operands of types 'int' and 'double' to binary 'operator%'" },
  sumProduct: { fragment: true, stdin: '12 7\n', code: `int a, b;\nstd::cin >> a >> b;\nstd::cout << a + b << " " << a * b;` },
} satisfies Record<string, Prog>;

export type ProgId = keyof typeof P;
