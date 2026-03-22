# 한의사메이커

한의학사 수업 보조용 프린세스메이커 스타일 육성 시뮬레이션 게임입니다. 상고시대부터 조선까지 10개 시대, 31턴을 거치며 자신만의 의원 유형을 완성합니다.

## 주요 기능

### 육성 시뮬레이션
- **10개 시대**: 상고 → 전국 → 진한 → 위진수당 → 송 → 금원 → 명 → 청 → 고려 → 조선
- **5가지 능력치**: 의술(醫術) · 학식(學識) · 덕행(德行) · 체력(體力) · 명성(名聲)
- **7가지 행동**: 경전공부 · 진료수련 · 민간봉사 · 스승방문 · 약초채집 · 학술교류 · 휴식
- **31턴 육성**: 시대별 중요도에 따라 2~4턴 차등 배분
- **체력 관리**: 체력 0 이하 시 과로사(게임오버)
- **랜덤 선택지**: 매 턴 7개 중 5개만 랜덤 노출 (휴식은 항상 포함)

### NPC 호감도
- **15명의 역사 인물**: 복희씨, 편작, 장중경, 화타, 손사막, 유완소, 이고, 이시진, 엽천사, 허준, 이제마 등
- **시대별 NPC 2~3명** 등장, 행동에 따라 호감도 변동
- **특별 이벤트**: 호감도 일정 수준 도달 시 보너스 이벤트 해금

### 미니게임
- **맥진(脈診)**: 타이밍에 맞춰 클릭하는 리듬 게임
- **약초 분류(本草)**: 약초와 효능 매칭 퀴즈
- **환자 치료(患者)**: 증상 보고 적절한 처방 선택
- 특정 행동 선택 시 30% 확률로 발동

### 계절 시스템
- 봄(春) · 여름(夏) · 가을(秋) · 겨울(冬) 순환
- 계절별 행동 보너스/페널티
- 계절별 BGM 변화

### 캐릭터 성장
- CSS 픽셀아트 캐릭터 (수련생 → 의원 → 명의)
- 최고 스탯에 따라 들고 있는 아이템 변화
- 체력/기분에 따라 표정 변화
- 중간 칭호 획득 (良醫, 博學, 仁心, 名醫 등)
- 턴 종료 시 한 줄 일기 생성

### 엔딩
- **5가지 기본 엔딩**: 올라운더, 임상 괴물, 이론 덕후, 백성의 의원, 의학계 인플루언서
- **4가지 히든 콤보 엔딩**: 의학 아키텍트, 현장의 영웅, 의학 혁명가, 백성의 챔피언
- 닮은 역사 인물 매칭 (허준, 화타, 유완소, 손사막, 이시진, 장중경, 이제마 등)
- 만난 NPC 전원 인연 정리

### 기타
- **8bit 치프튠 BGM**: 시대/계절별 동양풍 멜로디 (Web Audio API)
- **효과음**: 행동 선택, 스탯 변동, 이벤트 발생, 시대 전환 등
- **업적 시스템**: 12개 업적 (과로사, 한 우물 파기, 불철주야 등)
- **결과 카드 저장**: html2canvas 기반 이미지 내보내기
- **플레이 기록**: localStorage 기반

## 기술 스택

- React 18 + Vite 5
- CSS Custom Properties (네오 레트로 다크 테마)
- SUIT 폰트
- Web Audio API (프로그래매틱 BGM/SFX)
- localStorage 영속 저장

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 & 배포

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── raising/           # 육성 게임 UI
│   │   ├── minigames/     # 맥진, 약초, 환자 미니게임
│   │   ├── ActivityCard, ActivitySelectScreen
│   │   ├── CharacterSprite, StatPanel, TurnIndicator
│   │   ├── EventScreen, EraTransitionScreen, DeadScreen
│   │   ├── NpcPanel, NpcEventModal, SeasonDisplay
│   │   ├── MuteButton, RaisingGamePage
│   ├── StartPage, FinalResultPage, HowToPlayPage
│   ├── HistoryPage, AchievementPage, ResultCard
├── data/
│   ├── gameConfig.json    # 10시대, 7행동, 이벤트, 시대별 오버라이드
│   ├── npcs.json          # 15명 NPC 데이터
│   ├── resultTypes.json   # 5+4 엔딩 유형
│   ├── achievements.json  # 12개 업적
│   └── stages.json        # 클래식 모드 데이터 (레거시)
├── hooks/
│   └── useRaisingGameState.js  # 턴제 상태머신
├── utils/
│   ├── audioManager.js         # Web Audio BGM/SFX
│   ├── seasonCalculator.js     # 계절 시스템
│   ├── evaluateResultType.js   # 엔딩 판정
│   ├── resultStorage.js        # 저장/불러오기
│   └── checkAchievements.js    # 업적 체크
├── App.jsx
└── index.css              # 네오 레트로 다크 테마
```

## 교과서 기반

한중의학사 교과서(주민 3차 교정)를 기반으로 시대·인물·사건·의서 데이터를 구성했습니다.
