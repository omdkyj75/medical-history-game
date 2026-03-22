# 프린세스메이커 스타일 한의학 육성 시뮬레이션 변환 계획

## 핵심 변경 요약
- 기존 선형 7단계 → **7시대 × 시대당 3~4턴 = 총 25턴** 턴제 육성 시뮬레이션
- 스탯 4개 → **5개**: 의술(醫術), 학식(學識), 덕행(德行), 체력(體力), 명성(名聲)
- 턴마다 **7가지 행동** 중 선택: 경전공부, 진료수련, 민간봉사, 스승방문, 야초채집, 학술교류, 휴식
- 체력(Stamina)을 자원 관리 요소로 활용 (프메 스타일)
- 기존 퀴즈/업적/저장 시스템 유지

---

## Phase 1: 데이터 구조 설계 및 작성

### 새 파일: `src/data/gameConfig.json`
```
gameMeta: 게임 제목/설명
stats: 5개 스탯 정의 (키, 라벨, 초기값, 최대값)
activities: 7개 행동 (id, title, baseDelta, description)
eras: 7개 시대별 설정
  - turns 수, learningPoint, keywords
  - activityOverrides: 시대별 행동 맛텍스트/보너스
  - events: 시대별 랜덤 이벤트 (선택지 포함)
  - transitionScene: 시대 전환 씬
```

### 수정: `src/data/resultTypes.json`
- 5개 스탯 기반으로 엔딩 조건 재조정
- 콤보 엔딩 조건 업데이트

### 수정: `src/data/achievements.json`
- 새 업적 추가: 체력 고갈, 모든 행동 사용, 한 행동 10회+ 등

---

## Phase 2: 핵심 게임 로직

### 새 파일: `src/hooks/useRaisingGameState.js`
- 상태: eraIndex, turnIndex, phase, stats, turnHistory
- phase 상태머신: `activity-select` → `activity-result` → `event` → `era-transition` → `final`
- 턴 흐름: 행동 선택 → 스탯 변경 → 이벤트 체크 → 다음 턴/시대
- 체력 0 이하 시 강제 휴식 또는 페널티

### 수정: `src/utils/evaluateResultType.js`
- 4개 → 5개 스탯 키 기반으로 변경
- 콤보/균형/최고치 판정 로직은 유지, 임계값만 조정

### 수정: `src/utils/resultStorage.js`
- 저장 스키마에 version 필드 추가 (기존 세이브 호환)
- 5개 스탯 + 턴별 히스토리 저장

### 수정: `src/utils/checkAchievements.js`
- 새 조건 타입 추가: activity-count, stamina-zero, all-activities-used

---

## Phase 3: 행동 선택 UI

### 새 컴포넌트:
- `RaisingGamePage.jsx` — 메인 래퍼, phase에 따라 하위 화면 렌더링
- `ActivitySelectScreen.jsx` — 시대 정보 + 스탯 패널 + 7개 행동 카드 그리드
- `ActivityCard.jsx` — 개별 행동 카드 (이름, 설명, +/- 스탯 미리보기)
- `StatPanel.jsx` — 프메 스타일 5개 스탯 바 표시
- `TurnIndicator.jsx` — "춘추전국 2/3턴" 같은 진행 표시

### 수정:
- `App.jsx` — 새 raising 화면 라우팅 추가
- `StartPage.jsx` — "육성 시뮬레이션" 버튼 추가 (기존 클래식 모드 유지 가능)

---

## Phase 4: 턴 결과 & 이벤트

### 새 컴포넌트:
- `ActivityResultScreen.jsx` — 행동 결과, 스탯 변동 표시
- `EventScreen.jsx` — 랜덤 이벤트, 선택지 표시
- `StaminaWarning.jsx` — 체력 부족 경고

---

## Phase 5: 시대 전환 & 최종 결과

### 새 컴포넌트:
- `EraTransitionScreen.jsx` — 시대 전환 씬 (역사 설명 + 다음 시대 소개)

### 수정:
- `FinalResultPage.jsx` — 5개 스탯 표시로 업데이트
- `ResultCard.jsx` — 5개 스탯 반영
- `ScoreBar.jsx` / `ScoreBarGroup.jsx` — 5개 스탯 + 체력 특수 렌더링
- `ProgressPage.jsx` — 턴별 히스토리로 변경

---

## Phase 6: 업적 & 히스토리 & 마무리

### 수정:
- `HowToPlayPage.jsx` — 새 게임 설명으로 내용 교체
- `HistoryPage.jsx` — 새 세이브 포맷 대응
- `index.css` — 새 컴포넌트 스타일 추가 (행동 카드 그리드, 스탯 패널, 턴 표시 등)

---

## 설계 원칙
- **기존 코드 병행 유지**: 클래식 모드로 기존 게임 접근 가능
- **공유 인프라 활용**: 퀴즈, 업적 토스트, 결과 카드 익스포트 등 재사용
- **체력 = 자원 관리**: 대부분 행동은 체력 -2, 휴식은 +4. 4~5턴마다 휴식 필요
- **시대별 맛텍스트**: 같은 행동이라도 시대마다 다른 설명과 보너스
- **이벤트에 선택지**: 기존 수동 이벤트 → 미니 선택 이벤트로 업그레이드

## 스탯 색상
- 의술: #8b5e3c (갈색)
- 학식: #4a6a8f (파란색)
- 덕행: #3d7a66 (녹색)
- 체력: #b85c38 (주황색)
- 명성: #8a7232 (금색)
