import { isLeft, isRight, left, mapLeft, mapRight, right } from '../../../src/shared/domain/Either';

describe('Either', () => {
  it('left() cria Left com _tag correto', () => {
    const e = left('erro');
    expect(e._tag).toBe('Left');
    expect(isLeft(e)).toBe(true);
    expect(isRight(e)).toBe(false);
  });

  it('right() cria Right com _tag correto', () => {
    const e = right(42);
    expect(e._tag).toBe('Right');
    expect(isRight(e)).toBe(true);
    expect(isLeft(e)).toBe(false);
  });

  it('mapRight transforma Right', () => {
    const mapped = mapRight(right(3), (n) => n * 2);
    expect(isRight(mapped) && mapped.value).toBe(6);
  });

  it('mapRight preserva Left', () => {
    const e = left('err') as ReturnType<typeof left<string>>;
    const mapped = mapRight(e as Parameters<typeof mapRight>[0], () => 0);
    expect(isLeft(mapped)).toBe(true);
  });

  it('mapLeft transforma Left', () => {
    const mapped = mapLeft(left('erro'), (s) => s.length);
    expect(isLeft(mapped) && mapped.value).toBe(4);
  });

  it('mapLeft preserva Right', () => {
    const e = right(1);
    const mapped = mapLeft(e as Parameters<typeof mapLeft>[0], () => 0);
    expect(isRight(mapped)).toBe(true);
  });
});
