/**
 * Representa o resultado esquerdo (falha) de uma operação Either.
 * Contém um valor do tipo esquerdo que tipicamente representa um erro ou falha.
 *
 * @template L O tipo do valor que representa a falha
 *
 * @example
 * const errorResult = new Left(new Error('Algo deu errado'));
 */
export class Left<L> {
  readonly _tag = 'Left' as const;
  constructor(readonly value: L) {}
}

/**
 * Representa o resultado direito (sucesso) de uma operação Either.
 * Contém um valor do tipo direito que tipicamente representa o resultado bem-sucedido.
 *
 * @template R O tipo do valor que representa o sucesso
 *
 * @example
 * const successResult = new Right({ id: 123, name: 'Acme' });
 */
export class Right<R> {
  readonly _tag = 'Right' as const;
  constructor(readonly value: R) {}
}

/**
 * Tipo discriminado que representa o resultado de uma computação que pode falhar.
 * Implementa o padrão Either funcional: uma operação pode resultar em Left (falha) ou Right (sucesso).
 *
 * @template L O tipo da falha (lado esquerdo)
 * @template R O tipo do sucesso (lado direito)
 *
 * @example
 * type Result = Either<Error, string>;
 * const fail: Result = left(new Error('Falha'));
 * const success: Result = right('Sucesso!');
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Constrói um valor Either representando uma falha (Left).
 *
 * @template L O tipo da falha
 * @param value O valor da falha
 * @returns Um Either contendo a falha
 *
 * @example
 * const error = left(new SourceError('TIMEOUT', 'api-provider'));
 */
export const left = <L>(value: L): Either<L, never> => new Left(value);

/**
 * Constrói um valor Either representando um sucesso (Right).
 *
 * @template R O tipo do sucesso
 * @param value O valor do sucesso
 * @returns Um Either contendo o sucesso
 *
 * @example
 * const data = right({ status: 200, body: { id: 1 } });
 */
export const right = <R>(value: R): Either<never, R> => new Right(value);

/**
 * Verifica se um Either é do tipo Left (falha).
 * Funciona como type guard para narrowing de tipo.
 *
 * @template L O tipo da falha
 * @template R O tipo do sucesso
 * @param e O Either a verificar
 * @returns true se e for Left, false caso contrário
 *
 * @example
 * const result: Either<Error, string> = ...;
 * if (isLeft(result)) {
 *   console.error('Falha:', result.value);
 * }
 */
export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e._tag === 'Left';

/**
 * Verifica se um Either é do tipo Right (sucesso).
 * Funciona como type guard para narrowing de tipo.
 *
 * @template L O tipo da falha
 * @template R O tipo do sucesso
 * @param e O Either a verificar
 * @returns true se e for Right, false caso contrário
 *
 * @example
 * const result: Either<Error, string> = ...;
 * if (isRight(result)) {
 *   console.log('Sucesso:', result.value);
 * }
 */
export const isRight = <L, R>(e: Either<L, R>): e is Right<R> => e._tag === 'Right';

/**
 * Aplica uma função de transformação ao valor Right.
 * Se o Either for Left, retorna-o imutavelmente.
 *
 * @template L O tipo da falha
 * @template R O tipo original do sucesso
 * @template B O novo tipo do sucesso após transformação
 * @param e O Either a transformar
 * @param fn Função que transforma R em B
 * @returns Um novo Either contendo o valor transformado (Right) ou a falha original (Left)
 *
 * @example
 * const result: Either<Error, number> = right(5);
 * const mapped = mapRight(result, (n) => n * 2);
 * // mapped é right(10)
 */
export const mapRight = <L, R, B>(e: Either<L, R>, fn: (v: R) => B): Either<L, B> =>
  isRight(e) ? right(fn(e.value)) : e;

/**
 * Aplica uma função de transformação ao valor Left.
 * Se o Either for Right, retorna-o imutavelmente.
 *
 * @template L O tipo original da falha
 * @template R O tipo do sucesso
 * @template B O novo tipo da falha após transformação
 * @param e O Either a transformar
 * @param fn Função que transforma L em B
 * @returns Um novo Either contendo a falha transformada (Left) ou o sucesso original (Right)
 *
 * @example
 * const result: Either<Error, string> = left(new Error('Timeout'));
 * const mapped = mapLeft(result, (err) => ({ message: err.message }));
 * // mapped é left({ message: 'Timeout' })
 */
export const mapLeft = <L, R, B>(e: Either<L, R>, fn: (v: L) => B): Either<B, R> =>
  isLeft(e) ? left(fn(e.value)) : e;
