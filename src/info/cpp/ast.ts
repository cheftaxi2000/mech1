export interface Ty {
  /** `int`, `unsigned`, `double`, `float`, `bool`, `char`, `void`, `string`, `vector` */
  name: string;
  args?: Ty[];
  isConst: boolean;
  isRef: boolean;
}

export type Expr =
  | { k: 'num'; v: number; isDouble: boolean; isUnsigned: boolean; src: string; line: number }
  | { k: 'char'; v: string; src: string; line: number }
  | { k: 'str'; v: string; src: string; line: number }
  | { k: 'bool'; v: boolean; src: string; line: number }
  | { k: 'id'; name: string; src: string; line: number }
  | { k: 'unary'; op: '-' | '+' | '!' | '++' | '--'; e: Expr; src: string; line: number }
  | { k: 'postfix'; op: '++' | '--'; e: Expr; src: string; line: number }
  | { k: 'binary'; op: string; l: Expr; r: Expr; src: string; line: number }
  | { k: 'assign'; op: string; l: Expr; r: Expr; src: string; line: number }
  | { k: 'cond'; c: Expr; a: Expr; b: Expr; src: string; line: number }
  | { k: 'call'; name: string; args: Expr[]; src: string; line: number }
  | { k: 'method'; obj: Expr; name: string; args: Expr[]; src: string; line: number }
  | { k: 'index'; base: Expr; idx: Expr; src: string; line: number }
  | { k: 'cast'; ty: Ty; e: Expr; src: string; line: number }
  | { k: 'initlist'; items: Expr[]; src: string; line: number }
  | { k: 'ctor'; ty: Ty; args: Expr[]; src: string; line: number };

export interface DeclItem { name: string; init?: Expr; /** constructor-style arguments: `vector<int> v(3, 0);` */ ctor?: Expr[]; line: number }

export type Stmt =
  | { k: 'decl'; ty: Ty; items: DeclItem[]; line: number }
  | { k: 'expr'; e: Expr; line: number }
  | { k: 'block'; body: Stmt[]; line: number; endLine: number }
  | { k: 'if'; c: Expr; then: Stmt; else?: Stmt; line: number }
  | { k: 'while'; c: Expr; body: Stmt; line: number }
  | { k: 'do'; body: Stmt; c: Expr; line: number; condLine: number }
  | { k: 'for'; init?: Stmt; c?: Expr; step?: Expr; body: Stmt; line: number }
  | { k: 'return'; e?: Expr; line: number }
  | { k: 'break'; line: number }
  | { k: 'continue'; line: number }
  | { k: 'switch'; e: Expr; cases: { label: Expr | null; body: Stmt[]; line: number }[]; line: number }
  | { k: 'empty'; line: number };

export interface Param { ty: Ty; name: string }
export interface FuncDef { name: string; ret: Ty; params: Param[]; body: Stmt & { k: 'block' }; line: number }
export interface Program { funcs: FuncDef[]; globals: (Stmt & { k: 'decl' })[]; includes: string[] }
