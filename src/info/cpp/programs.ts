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

  // ------------------------------------------------------------------ chapter I2
  fahrenheit: {
    code: `#include <iostream>
int main() {
    // Input
    std::cout << "Temperature in degrees Celsius =? ";
    int celsius;
    std::cin >> celsius;

    // Computation and output
    std::cout << celsius << " degrees Celsius are "
              << 32 + 9 * celsius / 5 << " degrees Fahrenheit.\\n";
    return 0;
}`,
    stdin: '15\n',
  },
  fahrenheitBad: {
    code: `#include <iostream>
int main() {
    int celsius;
    std::cin >> celsius;
    std::cout << celsius << " degrees Celsius are "
              << 32 + 9 / 5 * celsius << " degrees Fahrenheit.\\n";
    return 0;
}`,
    stdin: '15\n',
  },
  fahrenheitInt: {
    code: `#include <iostream>
int main() {
    std::cout << "Temperature in degrees Celsius = ? ";
    int celsius;
    std::cin >> celsius;
    std::cout << celsius << " degrees Celsius are "
              << 9 * celsius / 5 + 32 << " degrees Fahrenheit.\\n";
    return 0;
}`,
    stdin: '15\n',
  },
  fahrenheitFloat: {
    code: `#include <iostream>
int main() {
    std::cout << "Temperature in degrees Celsius = ? ";
    float celsius; // enable fractional numbers
    std::cin >> celsius;
    std::cout << celsius << " degrees Celsius are "
              << 9 * celsius / 5 + 32 << " degrees Fahrenheit.\\n";
    return 0;
}`,
    stdin: '15\n',
  },
  divMod: { fragment: true, code: `std::cout << 5 / 2 << " " << 5 % 2 << "\\n";\nstd::cout << -3 / 5 << " " << -3 % 5 << "\\n";\nstd::cout << -7 / 2 << " " << -7 % 2 << "\\n";\nstd::cout << 7 / -2 << " " << 7 % -2;` },
  modPositive: { fragment: true, code: `int a = -3;\nint m = 5;\nstd::cout << a % m << " " << (a % m + m) % m;` },
  incDecEx: { fragment: true, code: `int a = 7;\nstd::cout << ++a << "\\n"; // 8\nstd::cout << a++ << "\\n"; // 8\nstd::cout << a << "\\n";   // 9` },
  arithAssign: { fragment: true, code: `int a = 10;\na += 5;\na -= 3;\na *= 2;\na /= 5;\na %= 3;\nstd::cout << a;` },
  rangeInt: {
    code: `// Output the smallest and the largest value of type int.
#include <iostream>
#include <limits>

int main() {
    std::cout << "Minimum int value is "
              << std::numeric_limits<int>::min() << ".\\n"
              << "Maximum int value is "
              << std::numeric_limits<int>::max() << ".\\n";
    return 0;
}`,
  },
  intWrapEx: { fragment: true, code: `int big = 2147483647;\nbig = big + 1;\nstd::cout << big;`, runtimeError: true },
  unsignedConv: { fragment: true, code: `unsigned int u = -1;\nint a = 3u;\nstd::cout << u << " " << a << " " << 17 + 17u;` },
  unsignedSurprise: { fragment: true, code: `unsigned int a = 10;\nint b = -110;\nint c = (a + b) / 10;\nstd::cout << "c=" << c;` },
  floatDiff: {
    code: `#include <iostream>
int main() {
    float n1;
    std::cout << "First number = ? ";
    std::cin >> n1;

    float n2;
    std::cout << "Second number = ? ";
    std::cin >> n2;

    float d;
    std::cout << "Their difference = ? ";
    std::cin >> d;

    std::cout << "Computed difference - input difference = ";
    std::cout << n1 - n2 - d << "\\n";
    return 0;
}`,
    stdin: '1.1 1.0 0.1\n',
  },
  floatLiterals: { fragment: true, code: `std::cout << 1.0 << "\\n";\nstd::cout << 1.27f << "\\n";\nstd::cout << 1e3 << "\\n";\nstd::cout << 1.23e-7 << "\\n";\nstd::cout << 1.23e-7f;` },
  sumPoint: { fragment: true, code: `double a = 0.1;\ndouble b = 0.2;\ndouble s = a + b;\nstd::cout << (s == 0.3) << " " << (s - 0.3);` },
  relational: { fragment: true, code: `int a = 4;\nbool p = (a % 3 == 1);\nbool q = (a != 2 * a - 1);\nbool r = (a < 3);\nstd::cout << p << q << r;` },
  logicalOps: { fragment: true, code: `int n = -1;\nint p = 3;\nbool b = (n < 0) && (0 < p);\nbool c = !(n < 0);\nstd::cout << b << c;` },
  boolConv: { fragment: true, code: `int a = true;\nbool b = 3;\nbool c = 0;\nstd::cout << a << b << c;` },
  shortCircuit: {
    fragment: true,
    stdin: '6 1 12\n',
    code: `int x, y, z;
std::cin >> x >> y >> z;
bool b = (x != 0) && z / x > y;
std::cout << b;`,
  },
  noShortCircuit: {
    fragment: true,
    stdin: '0 1 12\n',
    code: `int x, y, z;
std::cin >> x >> y >> z;
bool b = z / x > y && (x != 0);
std::cout << b;`,
    runtimeError: true,
  },
  evenOdd: {
    fragment: true,
    stdin: '7\n',
    code: `int a;
std::cin >> a;
if (a % 2 == 0)
    std::cout << "even";
else
    std::cout << "odd";`,
  },

  intDivDouble: { fragment: true, code: `double d = 5 / 2;\ndouble e = 5 / 2.0;\nstd::cout << d << " " << e;` },

  chainedCompare: { fragment: true, code: `int x = 50;\nstd::cout << (0 < x < 10) << (0 < x && x < 10);` },

  // ------------------------------------------------------------------ chapter I3
  ifOnly: { fragment: true, stdin: '7\n', code: `int a;\nstd::cin >> a;\nif (a % 2 == 0)\n    std::cout << "even";` },
  ifElseBlocks: {
    fragment: true,
    stdin: '7\n',
    code: `int a;
std::cin >> a;
if (a % 2 == 0) {
    std::cout << "even";
} else {
    std::cout << "odd";
}`,
  },
  oneLine: { fragment: true, stdin: '7\n', code: `int a; std::cin >> a; if (a % 2 == 0) std::cout << "even"; else std::cout << "odd";` },
  forSum: {
    code: `#include <iostream>
int main() {
    // input
    std::cout << "Compute the sum 1+...+n for n=? ";
    int n;
    std::cin >> n;
    // computation of the sum
    int s = 0;
    for (int i = 1; i <= n; ++i)
        s += i;
    // output
    std::cout << "1+...+" << n << " = " << s << ".\\n";
    return 0;
}`,
    stdin: '4\n',
  },
  forSumN2: { fragment: true, code: `int n = 2;\nint s = 0;\nfor (int i = 1; i <= n; ++i)\n    s += i;` },
  forSumBlock: {
    fragment: true,
    stdin: '3\n',
    code: `int n;
std::cin >> n;
int s = 0;
for (int i = 1; i <= n; ++i) {
    s += i;
    std::cout << "partial sum is " << s << "\\n";
}`,
  },
  forSumDangling: {
    fragment: true,
    stdin: '3\n',
    code: `int n;
std::cin >> n;
int s = 0;
for (int i = 1; i <= n; ++i)
    s += i;
    std::cout << "partial sum is " << s << "\\n";`,
  },
  primeTest: {
    fragment: true,
    stdin: '7\n',
    code: `int n;
std::cin >> n;
// pre-condition: n >= 2
int d;
for (d = 2; n % d != 0; ++d);
if (n == d)
    std::cout << n << " is prime";
else
    std::cout << n << " is divided by " << d;`,
  },
  primeTestBlocks: {
    fragment: true,
    stdin: '12\n',
    code: `int n;
std::cin >> n;
int d;
for (d = 2; n % d != 0; ++d);
if (d < n) {
    std::cout << n << " = " << d << " * " << n / d << ".\\n";
} else {
    std::cout << n << " is prime.\\n";
}`,
  },
  nullBody: { fragment: true, code: `for (int i = 0; i < 3; ++i);\n    std::cout << "hello ";` },
  scopeUndeclared: {
    code: `#include <iostream>
int main() {
    int s = 0;
    for (int i = 0; i < 10; ++i)
        s += i;
    std::cout << i;
    return 0;
}`,
    compileError: "'i' was not declared in this scope",
  },
  scopeBlockErr: {
    code: `#include <iostream>
int main() {
    {
        int i = 2;
    }
    std::cout << i;
    return 0;
}`,
    compileError: "'i' was not declared in this scope",
  },
  shadow: {
    code: `#include <iostream>
int main() {
    int i = 2;
    for (int i = 0; i < 5; ++i)
        std::cout << i; // outputs 0,1,2,3,4
    std::cout << i; // outputs 2
    return 0;
}`,
  },
  redeclSame: { fragment: true, code: `int i;\nint i;`, compileError: "redeclaration of 'int i'" },
  redeclOther: { fragment: true, code: `int i;\ndouble i;`, compileError: "conflicting declaration 'double i'" },
  innerOuter: {
    fragment: true,
    code: `int x = 1;
{
    int y = 2;
    std::cout << x + y; // inner sees outer
}
std::cout << " " << x;`,
  },
  localRecreated: {
    fragment: true,
    code: `int i = 5;
for (int j = 0; j < 5; ++j) {
    std::cout << ++i;
    int k = 2;
    std::cout << --k;
}`,
  },
  whileSum: { fragment: true, stdin: '4\n', code: `int n;\nstd::cin >> n;\nint s = 0;\nint i = 1;\nwhile (i <= n) {\n    s += i;\n    ++i;\n}\nstd::cout << s;` },
  collatz: {
    fragment: true,
    stdin: '5\n',
    code: `int n;
std::cin >> n; // read in n

// iteration
while (n != 1) { // stop when 1 reached
    if (n % 2 == 0) n = n / 2; // n is even
    else n = 3 * n + 1; // n is odd
    std::cout << n << " ";
}`,
  },
  collatzFor: {
    fragment: true,
    stdin: '5\n',
    code: `int n;
std::cin >> n; // read in n

// iteration
for (; n != 1;) { // stop when 1 reached
    if (n % 2 == 0) n = n / 2; // n is even
    else n = 3 * n + 1; // n is odd
    std::cout << n << " ";
}`,
  },
  doWhileCalc: {
    fragment: true,
    stdin: '3\n4\n0\n',
    code: `int summand; // next summand
int sum = 0; // current sum
do {
    std::cout << "next number = ? ";
    std::cin >> summand;
    sum += summand;
    std::cout << "sum = " << sum << "\\n";
} while (summand != 0);`,
  },
  whileCalc: {
    fragment: true,
    stdin: '3\n4\n0\n',
    code: `int summand = 1; // next summand
int sum = -summand; // current sum
while (summand != 0) {
    sum += summand;
    std::cout << "sum = " << sum << "\\n";
    std::cout << "next number = ? ";
    std::cin >> summand;
}`,
  },
  breakCalc: {
    fragment: true,
    stdin: '3\n4\n0\n',
    code: `int summand;
int sum = 0;
while (true) {
    std::cout << "next number = ? ";
    std::cin >> summand;
    if (summand == 0) break; // exit loop in the middle
    sum += summand;
    std::cout << "sum = " << sum << "\\n";
}`,
  },
  continueCalc: {
    fragment: true,
    stdin: '3\n-2\n4\n0\n',
    code: `int summand;
int sum = 0;
while (true) {
    std::cout << "next number = ? ";
    std::cin >> summand;
    if (summand < 0) continue; // jump to }
    if (summand == 0) break;
    sum += summand;
    std::cout << "sum = " << sum << "\\n";
}`,
  },
  oddContinue: { fragment: true, code: `for (int i = 0; i < 100; ++i) {\n    if (i % 2 == 0) {\n        continue;\n    }\n    std::cout << i << "\\n";\n}` },
  oddNegated: { fragment: true, code: `for (int i = 0; i < 100; ++i) {\n    if (i % 2 != 0) {\n        std::cout << i << "\\n";\n    }\n}` },
  oddStep: { fragment: true, code: `for (int i = 1; i < 100; i += 2) {\n    std::cout << i << "\\n";\n}` },
  gradesIf: {
    fragment: true,
    stdin: '6\n',
    code: `int grade;
std::cin >> grade;
if (grade == 6) std::cout << "Excellent ... ";
if (4 <= grade && grade <= 6) {
    std::cout << "You passed!";
} else if (1 <= grade && grade < 4) {
    if (grade == 3) std::cout << "Close, but ... ";
    std::cout << "You failed!";
} else std::cout << "Error!";`,
  },
  gradesSwitch: {
    fragment: true,
    stdin: '6\n',
    code: `int grade;
std::cin >> grade;
switch (grade) {
  case 6: std::cout << "Excellent ... ";
  case 5:
  case 4: std::cout << "You passed!";
    break;
  case 3: std::cout << "Close, but ... ";
  case 2:
  case 1: std::cout << "You failed!";
    break;
  default: std::cout << "Error!";
}`,
  },
  switchNoBreak: {
    fragment: true,
    stdin: '1\n',
    code: `int x;
std::cin >> x;
switch (x) {
  case 1: std::cout << "one ";
  case 2: std::cout << "two ";
  case 3: std::cout << "three ";
  default: std::cout << "other";
}`,
  },

  ifDangling: {
    fragment: true,
    stdin: '7\n',
    code: `int a;
std::cin >> a;
if (a % 2 == 0)
    std::cout << "even";
    std::cout << " number";`,
  },
  ifSemicolon: {
    fragment: true,
    stdin: '7\n',
    code: `int a;
std::cin >> a;
if (a % 2 == 0);
    std::cout << "even";`,
  },
  ifAssign: {
    fragment: true,
    code: `int a = 7;
if (a = 0)
    std::cout << "zero";
else
    std::cout << "not zero";
std::cout << " " << a;`,
  },
  elseIf: {
    fragment: true,
    stdin: '-4\n',
    code: `int x;
std::cin >> x;
if (x < 0)
    std::cout << "negative";
else if (x == 0)
    std::cout << "zero";
else
    std::cout << "positive";`,
  },
} satisfies Record<string, Prog>;

export type ProgId = keyof typeof P;
