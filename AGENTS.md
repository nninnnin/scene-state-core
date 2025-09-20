## Purpose
- 본 문서는 자동/반자동 에이전트와 협업자가 본 리포에서 작업할 때 따를 운영 지침을 명시합니다.
- 변경은 작고 국소적으로, 기존 스타일과 합치되게 수행합니다.

## Scope & Precedence
- 이 파일이 위치한 디렉터리 트리 전체에 적용됩니다.
- 더 깊은 경로에 별도 AGENTS.md가 있는 경우 그 지침이 우선합니다.
- 휴먼 사용자의 직접 지시가 항상 최우선입니다.

## Tech Stack
- Language: TypeScript (공용 설정: `tsconfig.base.json`)
- Package manager: pnpm (workspace: `pnpm-workspace.yaml`)
- Test: Vitest (`vitest.config.ts`)
- Lint/Format: ESLint (`eslintrc.cjs`), Prettier (`prettier.config.cjs`)
- Task runner: Turborepo (`turbo.json`)

## Commands
- 설치: `pnpm install`
- 전체 테스트: `pnpm -w test`
- 패키지 단위 테스트 예: `pnpm -C packages/core test`
- 전체 빌드: `pnpm -w build`

## Conventions
- 타입 안전: any 남용 금지, 도메인 타입 우선 사용.
- 불변 업데이트: 상태/데이터는 불변 패턴으로 갱신.
- 네이밍: 타입/인터페이스 PascalCase, 함수/변수 camelCase.
- 임포트: 기존 상대 경로 컨벤션 유지, 임의 alias 도입 금지.
- 주석: 의도/엣지 케이스 중심 최소화. 과도한 주석 금지.

## Change Policy
- 요청 범위 밖 대규모 리팩터링·일괄 포맷 변경 금지.
- 새 의존성 추가 금지(명시적 승인 없으면).
- 공개 API 변경 시 브레이킹 여부 명시 및 마이그레이션 노트 제공.
- 파일/폴더 이동은 필요 최소화.

## Testing
- 기능 추가/버그 수정 시 최소 1개 단위 테스트를 해당 패키지 내에 추가.
- 실패 경로 포함 검증, 타입체크 통과 보장.

## Monorepo Notes
- 패키지 경계 내에서 변경하고, Turborepo 캐시/파이프라인을 고려.
- 루트 설정(tsconfig/eslint/prettier)을 우선 참조, 충돌 시 패키지별 설정을 따름.

## Roadmap
- 코어 설계/학습 로드맵은 `docs/ROADMAP.md`를 참고하세요.
