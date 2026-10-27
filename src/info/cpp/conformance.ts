import type { Prog } from './programs';

/**
 * Small fragments that pin down C++ semantics the interpreter must get right. They are not shown in lessons; they are
 * compiled with g++ and compared with the interpreter, so the traces in the lessons can be trusted.
 */
export const CONFORMANCE: Record<string, Prog> = {
  intDivision: { fragment: true, code: 'std::cout << 7 / 2 << " " << -7 / 2 << " " << 7 / -2 << " " << 7 % 3 << " " << -7 % 3 << " " << 7 % -3;' },
  doubleDivision: { fragment: true, code: 'std::cout << 7.0 / 2 << " " << 7 / 2.0 << " " << 1.0 / 3 << " " << 2 / 3 * 3.0 << " " << 2 * 3.0 / 3;' },
  doublePrinting: { fragment: true, code: 'std::cout << 100000.0 << " " << 1000000.0 << " " << 1234567.0 << " " << 0.0001 << " " << 0.00001 << " " << 3.14159265358979 << " " << 1e100 << " " << 2.5e-7 << " " << 12345.6789;' },
  floatVsDouble: { fragment: true, code: 'float f = 0.1f; double d = 0.1; std::cout << f << " " << d << " " << (f == d) << " " << (0.1 + 0.2 == 0.3) << " " << (0.5 + 0.25 == 0.75);' },
  intTruncation: { fragment: true, code: 'int x = 3.99; int y = -3.99; int z = 1e3; std::cout << x << " " << y << " " << z;' },
  unsignedWrap: { fragment: true, code: 'unsigned u = 0; u = u - 1; unsigned v = 4000000000u; v = v + 500000000u; std::cout << u << " " << v;' },
  signedVsUnsigned: { fragment: true, code: 'int a = -1; unsigned b = 1; std::cout << (a < b) << " " << (a < 1) << " " << (-1 < 1u);' },
  intWrap: { fragment: true, code: 'int m = 2147483647; unsigned u = m; u = u + 1; std::cout << m << " " << u << " " << static_cast<int>(u);' },
  charArithmetic: { fragment: true, code: "char c = 'a'; c = c + 1; int i = 'a' + 1; std::cout << c << \" \" << i << \" \" << 'a' << \" \" << static_cast<int>('A') << \" \" << (char)('A' + 2);" },
  boolOutput: { fragment: true, code: 'bool t = true; bool f = false; std::cout << t << f << (3 > 2) << (3 < 2) << !t << (5 && 0) << (5 || 0);' },
  precedence: { fragment: true, code: 'std::cout << 1 + 2 * 3 << " " << (1 + 2) * 3 << " " << 10 - 4 - 3 << " " << 100 / 10 / 5 << " " << 2 * 3 % 4 << " " << -2 * -3 << " " << 1 + 2 << 3;' },
  logic: { fragment: true, code: 'int x = 5; std::cout << (x > 3 && x < 10) << (x < 3 || x > 4) << !(x == 5) << (x > 3 == 1) << (1 < 2 < 3) << (3 > 2 > 1);' },
  assignExpr: { fragment: true, code: 'int x; int y = 2; std::cout << (x = y) << " " << x; int a; int b; a = (b = 3); std::cout << " " << a << b; int c = 1; c += 4; c *= 3; c -= 5; c /= 2; c %= 4; std::cout << " " << c;' },
  incDec: { fragment: true, code: 'int i = 5; int a = i++; int b = ++i; int c = i--; int d = --i; std::cout << a << b << c << d << i;' },
  compoundTypes: { fragment: true, code: 'int x = 7; x /= 2.0; double d = 7; d /= 2; std::cout << x << " " << d;' },
  ternary: { fragment: true, code: 'int a = 3, b = 8; std::cout << (a > b ? a : b) << (a < b ? "yes" : "no");' },
  ifElse: { fragment: true, code: 'int x = 5; if (x > 3) { std::cout << "big"; } else { std::cout << "small"; } if (x % 2 == 0) std::cout << "even"; else std::cout << "odd";' },
  whileLoop: { fragment: true, code: 'int i = 1; int s = 0; while (i <= 5) { s += i; ++i; } std::cout << s << " " << i;' },
  forLoop: { fragment: true, code: 'for (int i = 0; i < 4; ++i) { std::cout << i << ","; } int s = 0; for (int i = 1; i <= 10; i += 3) s += i; std::cout << s;' },
  doWhile: { fragment: true, code: 'int n = 0; do { n += 2; } while (n < 5); std::cout << n;' },
  breakContinue: { fragment: true, code: 'for (int i = 0; i < 10; ++i) { if (i % 2 == 0) continue; if (i > 7) break; std::cout << i; }' },
  nestedLoops: { fragment: true, code: 'for (int i = 1; i <= 3; ++i) { for (int j = 1; j <= i; ++j) std::cout << i * j << " "; std::cout << "|"; }' },
  scopeShadow: { fragment: true, code: 'int x = 1; { int x = 2; std::cout << x; } std::cout << x; for (int x = 5; x < 6; ++x) std::cout << x; std::cout << x;' },
  switchStmt: { fragment: true, code: 'for (int d = 1; d <= 4; ++d) { switch (d) { case 1: std::cout << "one "; break; case 2: std::cout << "two "; case 3: std::cout << "three "; break; default: std::cout << "other "; } }' },
  mathFunctions: { fragment: true, includes: ['#include <cmath>'], code: 'std::cout << std::sqrt(16.0) << " " << std::pow(2, 10) << " " << std::abs(-3) << " " << std::fabs(-2.5) << " " << std::floor(2.7) << " " << std::ceil(2.1) << " " << std::sqrt(2);' },
  minMax: { fragment: true, includes: ['#include <algorithm>'], code: 'std::cout << std::min(3, 7) << std::max(3, 7) << std::max(2.5, 1.0);' },
  functions: { code: `#include <iostream>
int square(int n) { return n * n; }
int add(int a, int b) { return a + b; }
void hello() { std::cout << "hi "; }
int main() { hello(); std::cout << square(add(2, 3)) << " " << square(-4); return 0; }`, },
  passByValue: { code: `#include <iostream>
void inc(int x) { x = x + 1; }
int main() { int a = 5; inc(a); std::cout << a; return 0; }`, },
  passByReference: { code: `#include <iostream>
void inc(int& x) { x = x + 1; }
void swap2(int& a, int& b) { int t = a; a = b; b = t; }
int main() { int a = 5; inc(a); int p = 1, q = 2; swap2(p, q); std::cout << a << p << q; return 0; }`, },
  recursion: { code: `#include <iostream>
int fac(int n) { if (n <= 1) { return 1; } return n * fac(n - 1); }
int gcd(int a, int b) { if (b == 0) return a; return gcd(b, a % b); }
int main() { std::cout << fac(5) << " " << gcd(48, 18); return 0; }`, },
  stringsOutput: { fragment: true, code: 'std::cout << "a\\tb\\n" << "quote\\"" << \'x\' << 1 << 2.5 << "\\\\";' },
  inputOutput: { fragment: true, stdin: '12 7\n', code: 'int a, b; std::cin >> a >> b; std::cout << a + b << " " << a * b;' },
  constants: { fragment: true, code: 'const int c = 299792458; const double pi = 3.14159; std::cout << c << " " << pi * 2;' },
  intOverflowMul: { fragment: true, code: 'int a = 65536; unsigned u = a; unsigned w = u * u; std::cout << w << " " << 46341u * 46341u;' },
};
