# scene-state-core

3D 씬 에디터를 위한 상태 관리 엔진. 불변 상태, 커맨드 패턴 기반 undo/redo, React 바인딩을 제공하는 모노레포입니다.

## 패키지 구성

| 패키지 | 설명 |
|--------|------|
| `@ssc/core` | 상태 엔진 (변이, 커맨드, 히스토리, 마이그레이션) |
| `@ssc/react` | React 훅 및 컨텍스트 프로바이더 |
| `@ssc/devtools` | 개발 도구 (개발 중) |
| `apps/playground` | Three.js + React Three Fiber 데모 앱 |

## 핵심 기술 포인트

### 1. 불변 상태 (Immutable State)

모든 상태 변이는 순수 함수로 구현되며, 기존 객체를 수정하지 않고 새 상태를 반환합니다.

```typescript
// 상태 구조 (v4 스키마)
type State = {
  version: 4;
  entities: Record<EntityId, { name: string }>;
  components: {
    transform?: Record<EntityId, { position: Vec3; rotation: Vec3; scale: Vec3 }>;
    mesh?: Record<EntityId, MeshRef>;
    material?: Record<EntityId, MaterialRef>;
  };
};
```

엔티티와 컴포넌트를 분리한 ECS(Entity-Component System) 구조로, 유연한 확장이 가능합니다.

### 2. 커맨드 패턴 (Command Pattern)

모든 상태 변경은 `execute` / `undo` 를 가진 커맨드 객체로 표현됩니다.

```typescript
interface Command {
  type: string;
  execute(state: State): State;
  undo(state: State): State;
}
```

`CompositeCommand`로 여러 커맨드를 원자적으로 묶을 수 있으며, `group()` 헬퍼로 트랜잭션을 구성합니다.

### 3. Store (Pub/Sub)

`Store`는 상태 보관 + 변경 알림의 역할을 합니다. 리스너에게는 변경된 엔티티 ID 집합(`ChangeSet`)을 함께 전달해 불필요한 리렌더를 방지합니다.

```typescript
store.subscribe(({ prev, next, changes }) => {
  // changes: ReadonlySet<EntityId> - 변경된 엔티티만 포함
});
```

### 4. HistoryManager (Undo/Redo)

undo/redo 스택을 관리하며, 체크포인트 기반 스냅샷과 히스토리 분기를 지원합니다.

```typescript
historyManager.execute(command);       // 커맨드 실행 + undo 스택 적재
historyManager.undo();                 // 되돌리기
historyManager.redo();                 // 다시 실행
historyManager.group("label", (c) => {
  c(new SetTransformCommand(...));
  c(new SetMeshCommand(...));
});                                    // 원자적 그룹 커맨드
historyManager.createCheckpoint("v1"); // 스냅샷 저장
historyManager.jumpToCheckpoint("v1"); // 스냅샷으로 복원
```

### 5. 변경 감지 (Change Detection)

`diff()` 계열 함수가 이전/이후 상태를 비교해 변경된 엔티티 ID만 추출합니다. React 훅은 이를 활용해 셀렉터 + 동등성 비교로 구독 범위를 최소화합니다.

```typescript
const diffResult = diffTransform(prev, next); // Set<EntityId>
```

### 6. 불변식 검사 (Invariants)

상태 변이 직후(`onupdate`)와 역직렬화 시(`onload`) 두 단계로 나뉜 검증 시스템입니다.

- `onupdate`: 잘못된 상태 진입 차단 (고아 컴포넌트, 중복 이름 등)
- `onload`: 오래된 데이터 복구를 위한 완화된 검사

### 7. 마이그레이션 (Schema Migration)

Zod 스키마 v0 ~ v4의 자동 업그레이드 파이프라인. 역직렬화 시 현재 버전으로 자동 변환됩니다.

### 8. React 바인딩

코어 엔진은 프레임워크에 독립적이며, `@ssc/react`가 얇은 어댑터 역할을 합니다.

```tsx
// 상태 구독 (셀렉터 + 동등성 비교)
const { sceneState } = useSceneState(
  (s) => s.components.transform?.[id],
  (a, b) => a?.position === b?.position
);

// 커맨드 디스패치
const { dispatch, group } = useCommand();
dispatch(new AddEntityCommand("id", "Cube"));

// 히스토리
const { historyManager } = useHistory();
historyManager.undo();
```

## 시작하기

```bash
pnpm install
pnpm build        # 전체 빌드
pnpm test         # 전체 테스트
pnpm dev          # playground 개발 서버
```

## 프로젝트 구조

```
scene-state-core/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── state/        # 상태 타입, Store, 변이 함수, 불변식
│   │       ├── command/      # 커맨드 인터페이스 및 구현체
│   │       ├── history/      # HistoryManager
│   │       ├── migration/    # Zod 스키마 및 마이그레이션
│   │       └── transform/    # 3D 변환 유틸리티
│   ├── react/
│   │   └── src/
│   │       ├── components/   # SceneStateProvider
│   │       └── hooks/        # useSceneState, useCommand, useHistory
│   └── devtools/
└── apps/
    └── playground/           # Vite + React + Three.js 데모
```

## 기술 스택

- TypeScript 5.9 / pnpm / Turborepo
- 빌드: tsup / Vite
- 테스트: Vitest
- 스키마 검증: Zod
- 데모: React Three Fiber, Drei, Jotai
