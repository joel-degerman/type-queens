// number -> array
type Arr<N extends number, C = any, R extends C[] = []> = R['length'] extends N
  ? R
  : Arr<N, C, [...R, C]>;

// basic arithmetic using the lengths of arrays
type D<X extends any[], Y extends any[]> = Y extends [any, ...infer ys]
  ? X extends [any, ...infer xs]
    ? D<xs, ys>
    : ['-', Y['length']]
  : ['+', X['length']];
type Diff<X extends P> = D<Arr<X[0]>, Arr<X[1]>>;
type S<X extends any[], Y extends any[]> = [...X, ...Y]['length'];
type Sum<X extends P> = S<Arr<X[0]>, Arr<X[1]>>;

// position
type P = [number, number];

// is At threatened by Q?
type T1<At extends P, Q extends P> = At[0] extends Q[0]
  ? true
  : At[1] extends Q[1]
  ? true
  : Sum<At> extends Sum<Q>
  ? true
  : Diff<At> extends Diff<Q>
  ? true
  : false;
// is At threatened by any Q in Qs?
type T2<At extends P, Qs extends P[]> = Qs extends [
  infer q extends P,
  ...infer qs extends P[]
]
  ? T1<At, q> extends false
    ? T2<At, qs>
    : true
  : false;

// util
type Step<N extends number, Qs extends P[], At extends number> = Solution<
  N,
  Qs,
  Sum<[At, 1]> extends infer A extends number ? A : 0
>;

// brute force
type Solution<
  N extends number,
  Qs extends P[] = [],
  At extends number = 0
> = At extends N
  ? false
  : Qs['length'] extends N
  ? Qs
  : T2<[At, Qs['length']], Qs> extends false
  ? Solution<N, [...Qs, [At, Qs['length']]]> extends infer A extends any[]
    ? A
    : Step<N, Qs, At>
  : Step<N, Qs, At>;

type Check<Qs extends P[], N = Qs['length']> = Qs extends [
  infer q extends P,
  ...infer qs extends P[]
]
  ? T2<q, qs> extends false
    ? Check<qs, N>
    : false
  : true;

// solves up to 15. stack overflow (ish) after that
type X = Solution<4>;

const t: Check<[[1, 0], [3, 1], [0, 2], [2, 3]]> = true;
// @ts-expect-error
const f: Check<[[1, 0], [1, 3], [2, 0], [2, 2]]> = true;
