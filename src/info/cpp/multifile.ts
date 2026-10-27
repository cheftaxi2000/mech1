/** The files of the separate-compilation example (notes Code 6.5–6.9). The tests build them with g++; the lesson shows the same text. */
export const MULTIFILE = {
  'mymath.cpp': `#include <cassert>
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
}`,
  'callpow2.cpp': `#include <iostream>
#include "mymath.cpp"

int main() {
    std::cout << pow( 2.0, -2) << "\\n";
    std::cout << pow( 1.5, 2) << "\\n";
    std::cout << pow( 5.0, 1) << "\\n";
    std::cout << pow(-2.0, 9) << "\\n";
    return 0;
}`,
  'callpow3.cpp': `#include <iostream>
// (forward) declaration:
double pow(double b, int e);

int main() {
    std::cout << pow(2,-2) << "\\n";
    return 0;
}`,
  'mymath.h': `// PRE: e >= 0 || b != 0.0
// POST: return value is b^e
double pow(double b, int e);`,
  'callpow4.cpp': `#include <iostream>
#include "mymath.h"

int main() {
    std::cout << pow( 2.0, -2) << "\\n";
    std::cout << pow( 1.5, 2) << "\\n";
    std::cout << pow( 5.0, 1) << "\\n";
    std::cout << pow(-2.0, 9) << "\\n";
    return 0;
}`,
} as const;
