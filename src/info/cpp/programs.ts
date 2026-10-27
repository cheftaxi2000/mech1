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

  // ------------------------------------------------------------------ chapter I4
  powInline: {
    fragment: true,
    stdin: '2 -2\n',
    code: `double a;
int n;
std::cin >> a; // input a
std::cin >> n; // input n
double result = 1.0;
if (n < 0) { // a^n = (1/a)^(-n)
    a = 1.0/a;
    n = -n;
}
for (int i = 0; i < n; ++i)
    result *= a;
std::cout << result;`,
  },
  powFn: {
    code: `#include <iostream>
// assumes e >= 0 || b != 0.0
// returns the value b^e
double pow(double b, int e) {
    double result = 1.0;
    if (e < 0) { // b^e = (1/b)^(-e)
        b = 1.0/b;
        e = -e;
    }
    for (int i = 0; i < e; ++i) {
        result *= b;
    }
    return result;
}

int main() {
    std::cout << pow( 2.0, -2) << "\\n"; // outputs 0.25
    std::cout << pow( 1.5, 2) << "\\n"; // outputs 2.25
    std::cout << pow(-2.0, 9) << "\\n"; // outputs -512
    return 0;
}`,
  },
  fnExamples: {
    code: `#include <iostream>

// returns l XOR r
bool Xor(bool l, bool r) {
    return l != r;
}

// assumes n >= 0
// returns nth harmonic number computed with the backward sum
float Harmonic(int n) {
    float res = 0;
    for (int i = n; i >= 1; --i)
        res += 1.0f / i;
    return res;
}

// returns the minimum of a and b
int min(int a, int b) {
    if (a<b)
        return a;
    else
        return b;
}

int main() {
    std::cout << Xor(true, false) << Xor(true, true) << "\\n";
    std::cout << Harmonic(4) << "\\n";
    std::cout << min(7, 3) << "\\n";
    return 0;
}`,
  },
  scopeParams: {
    code: `#include <iostream>
double pow(double b, int e) {
    double r = 1.0;
    if (e < 0) {
        b = 1.0/b;
        e = -e;
    }
    for (int i = 0; i < e; ++i)
        r *= b;
    return r;
}

int main() {
    double b = 2.0;
    int e = -2;
    double z = pow(b, e);

    std::cout << z << " "; // 0.25
    std::cout << b << " "; // 2
    std::cout << e;        // -2
    return 0;
}`,
  },
  voidPair: {
    code: `#include <iostream>
// writes a pair of numbers "(i, j)" to standard output
void print_pair(int i, int j) {
    std::cout << "(" << i << ", " << j << ")\\n";
}

int main() {
    print_pair(3,4); // outputs (3, 4)
    return 0;
}`,
  },
  compareBad: {
    includes: [],
    code: `bool compare(float x, float y) {
    float delta = x - y;
    if (delta*delta < 0.001f) return true;
}`,
    // only compiled with -Wall in the tests (behavior undefined: never run)
    runtimeError: true,
  },
  compareFull: {
    code: `#include <iostream>
bool compare(float x, float y) {
    float delta = x - y;
    if (delta*delta < 0.001f)
        return true;
    else
        return false;
}

int main() {
    std::cout << compare(10, 20) << compare(1.0f, 1.01f);
    return 0;
}`,
  },
  compareShort: {
    code: `#include <iostream>
bool compare(float x, float y) {
    float delta = x - y;
    return delta*delta < 0.001f;
}

int main() {
    std::cout << compare(10, 20) << compare(1.0f, 1.01f);
    return 0;
}`,
  },
  assertPow: {
    code: `#include <iostream>
#include <cassert>
// PRE: e >= 0 || b != 0.0
// POST: return value is b^e
double pow(double b, int e) {
    assert(e >= 0 || b != 0.0);
    double result = 1.0;
    if (e < 0) { // b^e = (1/b)^(-e)
        b = 1.0/b;
        e = -e;
    }
    for (int i = 0; i < e; ++i)
        result *= b;
    return result;
}

int main() {
    std::cout << pow(0.0, -1);
    return 0;
}`,
    runtimeError: true,
  },
  rectStage1: { code: `#include <iostream>\nint main() {\n    // input two rectangles\n    // is there an overlap?\n    // output the result\n    return 0;\n}` },
  rectStage2: {
    code: `#include <iostream>
int main() {
    std::cout << "Enter two rectangles [x y w h each] \\n";
    int x1, y1, w1, h1;
    std::cin >> x1 >> y1 >> w1 >> h1;
    int x2, y2, w2, h2;
    std::cin >> x2 >> y2 >> w2 >> h2;

    // overlap?
    // output solution
    return 0;
}`,
    stdin: '0 0 2 2 1 1 2 2\n',
  },
  rectStage3: {
    code: `#include <iostream>
bool rectangles_overlap(int x1, int y1, int w1, int h1,
                        int x2, int y2, int w2, int h2) {
    return false; // todo
}

int main() {
    std::cout << "Enter two rectangles [x y w h each] \\n";
    int x1, y1, w1, h1;
    std::cin >> x1 >> y1 >> w1 >> h1;
    int x2, y2, w2, h2;
    std::cin >> x2 >> y2 >> w2 >> h2;

    bool overlap = rectangles_overlap(x1,y1,w1,h1,x2,y2,w2,h2);
    if (overlap)
        std::cout << "overlap!\\n";
    else
        std::cout << "no overlap!\\n";
    return 0;
}`,
    stdin: '0 0 2 2 1 1 2 2\n',
  },
  rectFinal: {
    code: `#include <iostream>
#include <algorithm>

// PRE: [a1, b1], [a2, b2] are (generalized) intervals,
//      with [a,b] := [b,a] if a>b
// POST: returns true if [a1, b1],[a2, b2] overlap
bool intervals_overlap(int a1, int b1, int a2, int b2) {
    return std::max(a1, b1) >= std::min(a2, b2)
        && std::min(a1, b1) <= std::max(a2, b2);
}

// PRE: (x1, y1, w1, h1), (x2, y2, w2, h2) are rectangles, where
//      w1, h1, w2, h2 may be negative.
// POST: returns true if (x1, y1, w1, h1),(x2, y2, w2, h2) overlap
bool rectangles_overlap(int x1, int y1, int w1, int h1,
                        int x2, int y2, int w2, int h2) {
    return intervals_overlap(x1, x1 + w1, x2, x2 + w2)
        && intervals_overlap(y1, y1 + h1, y2, y2 + h2);
}

int main() {
    std::cout << "Enter two rectangles [x y w h] each\\n";
    int x1, y1, w1, h1;
    std::cin >> x1 >> y1 >> w1 >> h1;
    int x2, y2, w2, h2;
    std::cin >> x2 >> y2 >> w2 >> h2;
    bool clash = rectangles_overlap(x1,y1,w1,h1,x2,y2,w2,h2);
    if (clash)
        std::cout << "overlap!\\n";
    else
        std::cout << "no overlap!\\n";
    return 0;
}`,
    stdin: '0 0 2 2 1 1 2 2\n',
  },
  fnNotDeclared: {
    code: `#include <iostream>
int main() {
    std::cout << f(1); // Error: f undeclared
    return 0;
}
int f(int i) { // Scope of f starts here
    return i;
}`,
    compileError: "'f' was not declared in this scope",
  },
  fnForward: {
    code: `#include <iostream>
bool is_odd(int n); // forward declaration

bool is_even(int n) { // is_even valid from here
    if (n == 0) return true;
    return is_odd(n - 1); // ok
}

bool is_odd(int n) {
    if (n == 0) return false;
    return is_even(n - 1); // ok
}

int main() {
    std::cout << is_even(10) << is_odd(10) << is_even(7);
    return 0;
}`,
  },
  paramClash: { code: `double pow(double e, int e);`, compileError: "conflicting declaration 'int e'" },
  namespaces: {
    code: `#include <iostream>
#include <cmath>

namespace informatik {
    // our own pow: repeated multiplication
    double pow(double b, int e) {
        double result = 1.0;
        if (e < 0) { b = 1.0/b; e = -e; }
        for (int i = 0; i < e; ++i) result *= b;
        return result;
    }
}

int main() {
    double x = std::pow(2.0, -2); // <cmath>
    double y = informatik::pow(2.0, -2); // our own
    std::cout << x << " " << y;
    return 0;
}`,
  },
  isPrimeSimple: {
    code: `#include <iostream>
#include <cassert>
bool is_prime(int n) {
    assert( n>1 );
    int d=2;
    for (; n % d != 0; ++d);
    return d == n;
}

int main() {
    for (int n = 2; n <= 30; ++n)
        if (is_prime(n)) std::cout << n << " ";
    return 0;
}`,
  },
  isPrimeSqrt: {
    code: `#include <iostream>
#include <cassert>
#include <cmath>
bool is_prime(int n) {
    assert( n>1 );
    int d=2;
    int bound = std::sqrt(n);
    for (; d <= bound && n % d != 0; ++d);
    return d > bound;
}

int main() {
    for (int n = 2; n <= 30; ++n)
        if (is_prime(n)) std::cout << n << " ";
    return 0;
}`,
  },

  nestedCalls: {
    code: `#include <iostream>
int square(int x) {
    return x * x;
}

int sum_of_squares(int a, int b) {
    return square(a) + square(b);
}

int main() {
    int r = sum_of_squares(3, 4);
    std::cout << r;
    return 0;
}`,
  },

  powLimits: {
    code: `#include <iostream>
double pow(double b, int e) {
    double result = 1.0;
    if (e < 0) { b = 1.0/b; e = -e; }
    for (int i = 0; i < e; ++i)
        result *= b;
    return result;
}

int main() {
    std::cout << pow(10.0, 400) << " " << pow(10.0, -400) << " " << pow(10.0, 15) << " " << pow(1.1, 10);
    return 0;
}`,
  },

  // ------------------------------------------------------------------ chapter I5
  sieve: {
    code: `#include <iostream>
#include <vector> // standard containers with vector functionality
int main() {
    // input
    std::cout << "Compute prime numbers in {2,...,n-1} for n =? ";
    int n;
    std::cin >> n;

    // definition and initialization: provides us with Booleans
    // crossed_out[0],..., crossed_out[n-1], initialized to false
    std::vector<bool> crossed_out = std::vector<bool>(n, false);

    // computation and output
    std::cout << "Prime numbers in {2,...," << n-1 << "}:\\n";
    for (int i = 2; i < n; ++i){
        // the index operator [] used to access elements by index
        if (!crossed_out[i]) { // i is prime
            std::cout << i << " ";
            // cross out all proper multiples of i
            for (int m = 2*i; m < n; m += i){
                crossed_out[m] = true;
            }
        }
    }
    std::cout << "\\n";
    return 0;
}`,
    stdin: '24\n',
  },
  vecInit: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> fivezeros = std::vector<int>(5);
std::vector<int> fivetwos = std::vector<int>(5, 2);
std::vector<int> countdown = {5, 4, 3, 2, 1};
std::vector<int> empty;
std::cout << fivezeros[2] << " " << fivetwos[2] << " " << countdown[2] << " " << empty.size();`,
  },
  vecWrite: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> v = {10, 20, 30};
v[1] = 25;
v.push_back(-1);
std::cout << v.size() << " " << v[1] << " " << v[3];`,
  },
  vecOutOfBounds: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> vec = std::vector<int>(10);
for (int i = 0; i <= 10; ++i)
    vec[i] = 30; // Undefined behavior: accessing vec[10]`,
    runtimeError: true,
  },
  vecAt: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> v = std::vector<int>(10);
std::cout << v.at(10);`,
    runtimeError: true,
  },
  sizeUnsigned: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> a {1,2,3};
for (int x = 0; a.size()-x-1 >= 0; ++x){
    std::cout << x;
    if (x == 5) break; // safety exit: the original loop never ends
}`,
  },
  sizeFixed: {
    fragment: true,
    includes: ['#include <vector>', '#include <iterator>'],
    code: `std::vector<int> a {1,2,3};
for (int x = 0; x < a.size(); ++x) {                 // problem solved (1)
    std::cout << x;
}
std::cout << " ";
for (int x = 0; int(a.size())-x-1 >= 0; ++x) {       // problem solved (2)
    std::cout << x;
}
std::cout << " ";
for (int x = 0; std::ssize(a)-x-1 >= 0; ++x) {       // problem solved (3), C++20
    std::cout << x;
}`,
  },
  sizeCompare: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<int> a {1,2,3};
std::cout << (a.size() - 4 >= 0) << " " << (int(a.size()) - 4 >= 0);`,
  },
  matrixInit: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `std::vector<std::vector<int>> matrix = {
    {1, 0, 0, 0},
    {0, 1, 0, 0},
    {0, 0, 1, 0},
    {0, 0, 0, 1}
};
std::cout << matrix.size() << " " << matrix[0].size() << " " << matrix[2][2] << matrix[2][3];`,
  },
  matrixFill: {
    fragment: true,
    includes: ['#include <vector>'],
    code: `int rows = 2;
int cols = 3;
std::vector<std::vector<int>> m;
m = std::vector<std::vector<int>>(rows, std::vector<int>(cols, 1));
m[1][2] = 7;
std::cout << m.size() << " " << m[0].size() << " " << m[0][2] << m[1][2];`,
  },
  lowerTriangle: {
    code: `#include <iostream>
#include <vector>

int lower_triangle_sum(const std::vector<std::vector<int>>& matrix) {
    int sum = 0;
    for (int row = 0; row < matrix.size(); ++row) {
        for (int column = 0; column < row; ++column) {
            sum += matrix[row][column];
        }
    }
    return sum;
}

int main() {
    std::vector<std::vector<int>> m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    std::cout << lower_triangle_sum(m);
    return 0;
}`,
  },
  jagged: {
    fragment: true,
    includes: ['#include <vector>', '#include <string>'],
    code: `std::vector<std::vector<std::string>> cantons = {
    {"ZH", "BE", "SG", "GE", "LU", "SO", "NE", "ZG"},
    {"FR", "VD", "VS", "JU"},
    {"AI", "OW", "NW", "AR", "BS", "BL"}
};
std::cout << cantons[1][2] << " " << cantons[1].size() << " " << cantons[2].size();`,
  },
  aliasAuto: {
    code: `#include <iostream>
#include <vector>

using imatrix = std::vector<std::vector<int>>;

// POST: Matrix 'm' was output to standard output
void print(const imatrix& m) {
    for (int i = 0; i < m.size(); ++i) {
        for (int j = 0; j < m[i].size(); ++j)
            std::cout << m[i][j] << " ";
        std::cout << "\\n";
    }
}

int main() {
    auto m = std::vector<std::vector<int>>(2, std::vector<int>(3, 1));
    auto x = 2 + 3;
    m[1][0] = x;
    print(m);
    return 0;
}`,
  },
  autoIndexErr: { fragment: true, code: `auto x = 2 + 3;\nstd::cout << x[2];`, compileError: "invalid types 'int[int]' for array subscript" },
  swapByValue: {
    code: `#include <iostream>
void swap(int x, int y) {
    int t = x;
    x = y;
    y = t;
}

int main() {
    int a = 2;
    int b = 1;
    swap(a, b);
    std::cout << a << " " << b; // not swapped!
    return 0;
}`,
  },
  swapByRef: {
    code: `#include <iostream>
// POST: values of x and y are exchanged
void swap(int& x, int& y) {
    int t = x;
    x = y;
    y = t;
}

int main() {
    int a = 2;
    int b = 1;
    swap(a, b);
    std::cout << a << " " << b;
    return 0;
}`,
  },
  aliasRef: {
    fragment: true,
    code: `int anakin_skywalker = 9;
int& darth_vader = anakin_skywalker; // Alias
darth_vader = 22;
std::cout << anakin_skywalker; // 22`,
  },
  refNoInit: { fragment: true, code: `int& j; // error: j must be an alias of something`, compileError: "'j' declared as reference but not initialized" },
  refLiteral: { fragment: true, code: `int& k = 5; // error: literal 5 has no address.`, compileError: "cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'" },
  incrementRef: {
    code: `#include <iostream>
void increment(int& i) {
    ++i;
}

int main() {
    int j = 5;
    increment(j);
    std::cout << j; // 6
    return 0;
}`,
  },
  incNested: {
    code: `#include <iostream>
int& inc(int& i) {
    i = i + 1;
    return i;
}

int main() {
    int x = 0;
    inc(inc(x));
    std::cout << x; // 2: inc(x) is an L-value, so it can be the argument again
    return 0;
}`,
  },
  incByValueErr: {
    code: `#include <iostream>
int increment(int& i) {
    ++i;
    return i;
}

int main() {
    int i = 0;
    increment(increment(i));
    return 0;
}`,
    compileError: "cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'",
  },
  wrapAt: {
    code: `#include <iostream>
#include <vector>

int& wrap_at(std::vector<int>& vec, int index) {
    return vec[index % vec.size()];
}

int main() {
    std::vector<int> v = {0, 1, 2, 3};
    std::cout << wrap_at(v, 2) << " "; // outputs 2
    std::cout << wrap_at(v, 6) << " "; // outputs 2
    wrap_at(v, 6) = 6;
    std::cout << wrap_at(v, 2);        // outputs 6
    return 0;
}`,
  },
  wrapAtReadOnlyErr: {
    code: `#include <iostream>
#include <vector>

int wrap_at(std::vector<int>& vec, int index) {
    return vec[index % vec.size()];
}

int main() {
    std::vector<int> v = {0, 1, 2, 3};
    wrap_at(v, 6) = 6; // compiler error
    return 0;
}`,
    compileError: 'lvalue required as left operand of assignment',
  },
  dangling: {
    code: `int& foo(int i) {
    return i;
}`,
    runtimeError: true,
  },
  vecByValue: {
    code: `#include <iostream>
#include <vector>

void by_value(std::vector<int> v) { v[0] = 99; }
void by_ref(std::vector<int>& v) { v[0] = 99; }

int main() {
    std::vector<int> v = {1, 2, 3};
    by_value(v);
    std::cout << v[0] << " ";
    by_ref(v);
    std::cout << v[0];
    return 0;
}`,
  },
  averageConstRef: {
    code: `#include <iostream>
#include <vector>

double average(const std::vector<double>& values) {
    double sum = 0;
    for (int i = 0; i < values.size(); ++i)
        sum += values[i];
    return sum / values.size();
}

int main() {
    const std::vector<double> temperatures =
        {0.9,1.3,5.1,9.1,13.2,17.1,18.8,18.6,14.7,10.6,5.2,1.8};
    std::cout << average(temperatures); // outputs 9.7
    return 0;
}`,
  },
  averageNonConstErr: {
    code: `#include <iostream>
#include <vector>

double average(std::vector<double>& values) {
    double sum = 0;
    for (int i = 0; i < values.size(); ++i)
        sum += values[i];
    return sum / values.size();
}

int main() {
    const std::vector<double> temperatures =
        {0.9,1.3,5.1,9.1,13.2,17.1,18.8,18.6,14.7,10.6,5.2,1.8};
    std::cout << average(temperatures); // compiler error
    return 0;
}`,
    compileError: "discards qualifiers",
  },
  constRefTemp: {
    fragment: true,
    code: `const int& r = 2 + 3; // a temporary object with the value 5
std::cout << r;`,
  },
  constRefWrite: {
    fragment: true,
    code: `int x = 1;
const int& r = x;
r = 5; // error: r promises not to change x`,
    compileError: "assignment of read-only reference 'r'",
  },

  // ------------------------------------------------------------------ chapter I6
  charBasics: {
    fragment: true,
    code: `char c = 'a';
std::cout << c << " " << int(c) << " " << c + 1 << " " << char(c + 1);`,
  },
  lowerLoop: { fragment: true, code: `for (char c = 'a'; c <= 'z'; ++c)\n    std::cout << c; // abcdefghijklmnopqrstuvwxyz` },
  asciiCodes: {
    fragment: true,
    code: `std::cout << int('A') << " " << int('Z') << " " << int('a') << " " << int('z') << " " << int('0') << " " << int('9') << " " << int(' ') << " " << int('~');`,
  },
  digitValue: {
    fragment: true,
    code: `char d = '7';
int v = d - '0';          // the value of the digit
char back = char(v + 1 + '0'); // the next digit as a character
std::cout << v << " " << back << " " << 'a' / 'b' << " " << 'a' - 'A';`,
  },
  caesar: {
    code: `#include <iostream>

// PRE: divisor > 0
// POST: returns the mathematically defined remainder of
//       dividend / divisor with 0 <= result < divisor
int mod(int dividend, int divisor) {
    return (dividend % divisor + divisor) % divisor;
}

// POST: if c is one of the 95 printable ASCII characters, c is
//       cyclically shifted s printable characters to the right
char shift(char c, int s) {
    if (c >= 32 && c <= 126) { // c is printable
        c = 32 + mod(c - 32 + s, 95);
    }
    return c;
}

// POST: Each character read from std::cin was shifted cyclically
//       by s characters and afterwards written to std::cout
void caesar(int s) {
    std::cin >> std::noskipws; // #include <ios>
    char next;
    while (std::cin >> next) {
        std::cout << shift(next, s);
    }
}

int main() {
    int s;
    std::cin >> s;
    // Shift input by s
    caesar(s);
    return 0;
}`,
    stdin: '3\nHello, World!',
  },
  modDemo: {
    fragment: true,
    code: `std::cout << -3 % 5 << " " << ((-3 % 5 + 5) % 5) << " " << ((32 - 32 - 3 + 95) % 95 + 32);`,
  },
  zebra: {
    code: `#include <iostream>
#include <string>

int mod(int dividend, int divisor) {
    return (dividend % divisor + divisor) % divisor;
}

// cyclic shift over all 95 printable characters (Code 9.1)
char shift(char c, int s) {
    if (c >= 32 && c <= 126) c = 32 + mod(c - 32 + s, 95);
    return c;
}

// cyclic shift over the 26 capital letters only
char shift_letter(char c, int s) {
    if (c >= 'A' && c <= 'Z') c = 'A' + mod(c - 'A' + s, 26);
    return c;
}

int main() {
    std::string word = "ZEBRA";
    std::string a = word, b = word, c = word;
    for (int i = 0; i < std::ssize(word); ++i) {
        a[i] = shift(word[i], 1);
        b[i] = shift_letter(word[i], 1);
        c[i] = shift_letter(word[i], -1);
    }
    std::cout << a << " " << b << " " << c;
    return 0;
}`,
  },
  strOps: {
    fragment: true,
    code: `std::string text = "Essen ist fertig!";
std::cout << text.size() << " " << text[0] << " ";
text[0] = 'e';
std::cout << text << "|";
std::string smiley = ":-";
smiley += ")";
std::cout << (smiley == ":-)") << (smiley == ":-(") << std::string(3, 'a');
for (int i = 0; i < std::ssize(smiley); ++i)
    std::cout << "/" << smiley[i];`,
  },
  stringAt: { fragment: true, code: `std::string s = "abc";\nstd::cout << s.at(5);`, runtimeError: true },

  strLiteralPlus: { fragment: true, includes: ['#include <string>'], code: `std::string s = "a" + "b"; // two string literals cannot be added`, compileError: "invalid operands of types 'const char [2]' and 'const char [2]' to binary 'operator+'" },
  // ------------------------------------------------------------------ chapter I7
  facRec: {
    code: `#include <iostream>
// POST: return value is n!
int fac(int n) {
    if (n <= 1) return 1;
    else return fac(n-1) * n;
}

int main() {
    std::cout << fac(4);
    return 0;
}`,
  },
  facTable: {
    code: `#include <iostream>
int fac(int n) {
    if (n <= 1) return 1;
    else return fac(n-1) * n;
}

int main() {
    for (int n = 10; n <= 13; ++n)
        std::cout << n << "! = " << fac(n) << "\\n";
    return 0;
}`,
  },
  infRec: { code: `void f() {\n    f();\n}\n\nint main() {\n    f();\n    return 0;\n}`, runtimeError: true },
  gcdRec: {
    code: `#include <iostream>
int gcd(int a, int b) {
    if (b == 0) return a;
    else return gcd(b, a % b);
}

int main() {
    std::cout << gcd(48, 18) << " " << gcd(7, 0);
    return 0;
}`,
  },
  bitStrings: {
    code: `#include <iostream>
#include <string>

void all_bit_strings(int n, std::string prefix) {
    if (std::ssize(prefix) == n) {
        std::cout << prefix << "\\n";
    } else {
        all_bit_strings(n, prefix + "0");
        all_bit_strings(n, prefix + "1");
    }
}

int main() {
    all_bit_strings(3, "");
    return 0;
}`,
  },
  bitStringsRef: {
    code: `#include <iostream>
#include <string>

void all_bit_strings(std::string& bit_string, int i) {
    if (i == std::ssize(bit_string)) {
        std::cout << bit_string << "\\n";
    }
    else {
        bit_string[i] = '0';
        all_bit_strings(bit_string, i+1);
        bit_string[i] = '1';
        all_bit_strings(bit_string, i+1);
    }
}

int main() {
    std::string bit_string = std::string(3, '*');
    all_bit_strings(bit_string, 0);
    return 0;
}`,
  },
  sumLoop: {
    code: `#include <iostream>
#include <vector>
int sum(const std::vector<int>& v) {
    int s = 0;
    for (int i = 0; i < std::ssize(v); ++i) {
        s += v[i];
    }
    return s;
}

int main() {
    std::cout << sum({-1, 4, 6, 7});
    return 0;
}`,
  },
  sumDecrease: {
    code: `#include <iostream>
#include <vector>
int sum(const std::vector<int>& v, int from) {
    if (from >= std::ssize(v))
        return 0;
    else
        return v[from] + sum(v, from + 1);
}

int main() {
    std::cout << sum({-1, 4, 6, 7}, 0);
    return 0;
}`,
  },
  sumDivide: {
    code: `#include <iostream>
#include <vector>
int sum(const std::vector<int>& v, int from, int to) {
    if (from > to)
        return 0;
    else if (from == to)
        return v.at(from);
    else {
        int middle = (from + to) / 2;
        return sum(v, from, middle) + sum(v, middle + 1, to);
    }
}

int main() {
    std::cout << sum({-1, 4, 6, 7}, 0, 3);
    return 0;
}`,
  },
  fibRec: {
    code: `#include <iostream>
int fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n-1) + fib(n-2);
}

int main() {
    std::cout << fib(4);
    return 0;
}`,
  },
  fibCount: {
    code: `#include <iostream>
int calls = 0; // counts how often fib is called
int fib(int n) {
    ++calls;
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n-1) + fib(n-2);
}

int main() {
    std::cout << fib(10) << " " << calls;
    return 0;
}`,
  },
  fibIter: {
    code: `#include <iostream>
int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    int fib2 = 0; // value two before
    int fib1 = 1; // value one before
    int fib;      // current value
    for (int i = 2; i <= n; ++i) {
        fib = fib2 + fib1; // i-th Fibonacci number
        fib2 = fib1;
        fib1 = fib;
    }
    return fib;
}

int main() {
    std::cout << fibonacci(10) << " " << fibonacci(46);
    return 0;
}`,
  },
} satisfies Record<string, Prog>;

export type ProgId = keyof typeof P;
