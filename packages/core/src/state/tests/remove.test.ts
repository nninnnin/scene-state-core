import { describe, expect, it } from 'vitest';
import { addEntity, createEmptyState, removeEntity } from '../';

describe('removeEntity', () => {
  it('불변성을 보장하며 엔티티를 제거한다', () => {
    const s1 = createEmptyState();
    const s2 = addEntity(s1, 'e1', 'First');
    const s3 = addEntity(s2, 'e2', 'Second');

    const s4 = removeEntity(s3, 'e1');

    // 변경된 데이터 확인
    expect(s4.entities['e1']).toBeUndefined();
    expect(s4.entities['e2']).toEqual({
      name: 'Second',
    });

    // 불변성 확인
    expect(s4).not.toBe(s3);
    expect(s4.entities).not.toBe(s3.entities);

    // 엔티티 제거 이전 상태 보존
    expect(s3.entities['e1']).toEqual({ name: 'First' });
  });

  it('전달된 id가 존재하지 않을 때에는 아무 동작도 하지 않는다(no-op, no operation)', () => {
    const s1 = createEmptyState();
    const s2 = addEntity(s1, 'e1', 'First');
    const s3 = removeEntity(s2, 'missing');

    // 최상위 객체의 레퍼런스가 동일하다
    expect(s3).toBe(s2);

    // 내부 객체의 레퍼런스가 동일하다
    expect(s3.entities).toBe(s2.entities);

    // 내부 엔트리도 동일하다
    expect(s3.entities['e1']).toEqual({ name: 'First' });
  });

  it('마지막 엔티티를 삭제하면 새로운 레퍼런스의 Map을 리턴한다', () => {
    const s1 = createEmptyState();
    const s2 = addEntity(s1, 'e1', 'First');

    const s3 = removeEntity(s2, 'e1');

    // 비어있는 객체가 되었는지 확인
    expect(s3.entities).not.toBe({});

    // 참조가 다른 새로운 객체 (Immutability)
    expect(s3).not.toBe(s2);
    expect(s3.entities).not.toBe(s2.entities);
  });
});
