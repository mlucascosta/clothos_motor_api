export class Left<L> {
  readonly _tag = 'Left' as const;
  constructor(readonly value: L) {}
}

export class Right<R> {
  readonly _tag = 'Right' as const;
  constructor(readonly value: R) {}
}

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(value: L): Either<L, never> => new Left(value);
export const right = <R>(value: R): Either<never, R> => new Right(value);

export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e._tag === 'Left';
export const isRight = <L, R>(e: Either<L, R>): e is Right<R> => e._tag === 'Right';

export const mapRight = <L, R, B>(e: Either<L, R>, fn: (v: R) => B): Either<L, B> =>
  isRight(e) ? right(fn(e.value)) : e;

export const mapLeft = <L, R, B>(e: Either<L, R>, fn: (v: L) => B): Either<B, R> =>
  isLeft(e) ? left(fn(e.value)) : e;
