# 한의사메이커

한의학사 수업 보조용 웹 육성 시뮬레이션 게임입니다. 상고시대부터 조선까지 10개 시대를 거치며 자신만의 의원 유형을 완성합니다.

## 주요 기능

- **7개 시대 시뮬레이션**: 춘추전국 → 진한 → 수당 → 송 → 금원 → 명청민국 → 조선
- **4가지 성향 점수**: 학술(學術) · 임상(臨床) · 문헌(文獻) · 민생(民生)
- **교과서 기반 콘텐츠**: 한의대 의학사 교과서 핵심 인물·문헌·개념 수록 (장중경, 화타, 이제마 등)
- **랜덤 선택지**: 시대별 6~8개 풀에서 매회 4개를 랜덤 추출 — 리플레이 가치 향상
- **랜덤 이벤트**: 50% 확률로 시대별 변수 발생, 점수 보정
- **최종 유형 판정**: 16종 의원 유형 + 닮은 역사 인물 매칭
- **결과 카드 저장**: html2canvas 기반 이미지 내보내기
- **플레이 기록**: localStorage 기반 이전 결과 열람
- **업적 시스템**: 특정 조건 달성 시 업적 해금
- **URL 라우팅**: hash 기반 (`#/stage`, `#/history` 등) — 뒤로가기/직접 진입 지원

## 기술 스택

- React 18 + Vite 5
- CSS Custom Properties 디자인 시스템
- MaruBuri (serif) + Pretendard (sans-serif) 폰트
- localStorage 영속 저장
- GitHub Pages 배포

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 & 배포

```bash
npm run build    # dist/ 폴더에 정적 빌드
npm run preview  # 빌드 결과 로컬 프리뷰
```

## 프로젝트 구조

```
src/
├── components/      # 페이지 및 UI 컴포넌트
├── data/            # stages.json, resultTypes.json, achievements.json
├── hooks/           # useGameState (중앙 게임 상태 관리)
├── utils/           # 유형 판정, 저장, 업적 체크
├── App.jsx          # 화면 라우팅
└── index.css        # 전체 스타일
```
