# Image-to-UI MCP Server

이미지를 분석하여 UI/UX 코드로 변환하는 MCP (Model Context Protocol) 서버입니다.

## 기능

- 🖼️ PNG, JPG, BMP 이미지 파일 분석
- 🎨 UI 요소 및 디자인 시스템 추출
- 💻 React, Vue, HTML/CSS, Flutter, React Native 코드 생성
- 📱 반응형 디자인 지원
- 🎯 프로젝트별 설정 관리 (itu_requirements.md)

## 명령어

### `ITU-init`
프로젝트를 초기화하고 `itu_requirements.md` 파일을 생성합니다.

```bash
# 기본 설정으로 초기화
ITU-init

# 커스텀 설정으로 초기화
ITU-init --projectPath ./my-project --framework vue --responsive true
```

### `ITU-start`
이미지를 분석하여 UI 코드를 생성합니다.

```bash
# 기본 설정으로 변환
ITU-start --imagePath ./design.png

# 커스텀 출력 경로 지정
ITU-start --imagePath ./design.png --outputPath ./custom-output
```

### `ITU-modify`
프로젝트 설정을 수정하고 코드를 재생성합니다.

```bash
ITU-modify --imagePath ./design.png --modifications '{
  "framework": "react",
  "theme": "dark",
  "colorPalette": ["#1a1a1a", "#ffffff", "#007acc"],
  "components": {
    "buttonStyle": "pill",
    "borderRadius": 12,
    "shadows": true
  }
}'
```

### `ITU-status`
현재 프로젝트 상태를 확인합니다.

```bash
ITU-status
```

## 설치 및 설정

### 1. 프로젝트 설치
```bash
git clone <repository-url>
cd ImageToUI
npm install
```

### 2. 환경변수 설정 (선택사항)
AI 기반 분석을 위해 OpenAI API 키를 설정할 수 있습니다:

```bash
export OPENAI_API_KEY=your-api-key-here
```

### 3. 빌드 및 실행
```bash
# MCP 서버 실행
npm run build
npm start

# 웹 인터페이스 실행 (선택사항)
npm run web
```

### 4. MCP 클라이언트 설정
Claude Desktop 등의 MCP 클라이언트에서 서버를 등록합니다:

```json
{
  "mcpServers": {
    "image-to-ui": {
      "command": "node",
      "args": ["/path/to/ImageToUI/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 사용 방법

### 방법 1: 웹 인터페이스 (권장)

1. **웹 서버 실행**
   ```bash
   npm run web
   ```

2. **브라우저에서 접속**
   - http://localhost:3000 으로 이동
   - 직관적인 웹 UI에서 이미지 업로드 및 설정
   - 생성된 명령어를 Claude Code에서 실행

### 방법 2: 직접 명령어 사용

1. **초기화**: `ITU-init`으로 프로젝트 설정 생성
2. **변환**: `ITU-start`로 이미지를 UI 코드로 변환
3. **수정**: `ITU-modify`로 설정 변경 및 재생성
4. **확인**: `ITU-status`로 프로젝트 상태 확인

## 지원 형식

### 입력 이미지
- PNG (.png)
- JPEG (.jpg, .jpeg)
- BMP (.bmp)

### 출력 프레임워크
- React (.jsx)
- Vue (.vue) 
- HTML/CSS (.html)
- Flutter (.dart)
- React Native (.jsx)

## 예시

### 1. 새 프로젝트 시작
```bash
# 프로젝트 초기화
ITU-init --framework react --responsive true

# 이미지 변환
ITU-start --imagePath ./mockup.png

# 결과 확인
ITU-status
```

### 2. 디자인 시스템 커스터마이징
```bash
ITU-modify --imagePath ./mockup.png --modifications '{
  "theme": "dark",
  "colorPalette": ["#1a1a1a", "#ffffff", "#007acc", "#28a745"],
  "typography": {
    "primaryFont": "Inter, sans-serif",
    "fontSize": 16
  },
  "components": {
    "buttonStyle": "rounded",
    "borderRadius": 8,
    "shadows": true,
    "animations": true
  }
}'
```

## 구조

```
ImageToUI/
├── src/
│   ├── index.ts              # MCP 서버 메인 파일
│   └── services/
│       ├── imageAnalyzer.ts  # 이미지 분석 서비스
│       ├── uiGenerator.ts    # UI 코드 생성 서비스
│       └── ituCommands.ts    # ITU 명령어 처리
├── dist/                     # 컴파일된 JavaScript 파일
├── package.json
└── tsconfig.json
```

## 라이선스

MIT License