# ITU MCP Server 사용 예제

## 기본 워크플로우

### 1. 프로젝트 초기화
```bash
# Claude Code에서 실행:
ITU-init --projectPath ./my-app --framework react
```

결과:
- `./my-app/itu_requirements.md` 파일 생성
- 기본 설정으로 구성된 프로젝트 초기화

### 2. 이미지 변환
```bash
ITU-start --imagePath ./design-mockup.png
```

결과:
- 이미지 분석 및 UI 요소 추출
- React 컴포넌트 코드 생성
- `./my-app/generated/` 폴더에 파일 저장

### 3. 설정 수정
```bash
ITU-modify --imagePath ./design-mockup.png --modifications '{
  "framework": "vue",
  "theme": "dark", 
  "colorPalette": ["#121212", "#ffffff", "#bb86fc"],
  "components": {
    "buttonStyle": "pill",
    "borderRadius": 20,
    "shadows": false
  }
}'
```

## 실제 사용 시나리오

### 시나리오 1: 모바일 앱 디자인 변환

1. **Figma 디자인 내보내기**
   - 디자인을 PNG로 내보내기
   - 해상도: 375x812 (iPhone 크기)

2. **프로젝트 초기화**
   ```bash
   ITU-init --projectPath ./mobile-app --framework react-native --responsive true
   ```

3. **변환 실행**
   ```bash
   ITU-start --imagePath ./mobile-design.png
   ```

4. **모바일 최적화 설정**
   ```bash
   ITU-modify --imagePath ./mobile-design.png --modifications '{
     "layout": {
       "type": "flexbox",
       "responsive": true,
       "spacing": 12
     },
     "typography": {
       "fontSize": 14,
       "lineHeight": 1.4
     },
     "components": {
       "buttonStyle": "rounded",
       "borderRadius": 8
     }
   }'
   ```

### 시나리오 2: 웹 대시보드 변환

1. **프로젝트 설정**
   ```bash
   ITU-init --projectPath ./dashboard --framework react
   ```

2. **대시보드 디자인 변환**
   ```bash
   ITU-start --imagePath ./dashboard-design.png
   ```

3. **다크 테마 적용**
   ```bash
   ITU-modify --imagePath ./dashboard-design.png --modifications '{
     "theme": "dark",
     "colorPalette": ["#1a1a1a", "#ffffff", "#007acc", "#28a745", "#dc3545"],
     "components": {
       "shadows": true,
       "animations": true
     }
   }'
   ```

### 시나리오 3: 다양한 프레임워크로 변환

1. **초기 변환 (React)**
   ```bash
   ITU-init --framework react
   ITU-start --imagePath ./design.png
   ```

2. **Vue 버전 생성**
   ```bash
   ITU-modify --imagePath ./design.png --modifications '{
     "framework": "vue"
   }' --outputPath ./vue-version
   ```

3. **HTML/CSS 버전 생성**
   ```bash
   ITU-modify --imagePath ./design.png --modifications '{
     "framework": "html-css"
   }' --outputPath ./html-version
   ```

## 고급 설정 예제

### 커스텀 디자인 시스템
```bash
ITU-modify --imagePath ./design.png --modifications '{
  "colorPalette": [
    "#f8f9fa",
    "#212529", 
    "#007bff",
    "#28a745",
    "#dc3545",
    "#ffc107",
    "#17a2b8"
  ],
  "typography": {
    "primaryFont": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    "fontSize": 16,
    "lineHeight": 1.6
  },
  "layout": {
    "type": "grid",
    "responsive": true,
    "spacing": 24
  },
  "components": {
    "buttonStyle": "rounded",
    "borderRadius": 6,
    "shadows": true,
    "animations": true
  }
}'
```

### 접근성 최적화 설정
```bash
ITU-modify --imagePath ./design.png --modifications '{
  "typography": {
    "fontSize": 18,
    "lineHeight": 1.7
  },
  "colorPalette": [
    "#ffffff",
    "#1a1a1a",
    "#0066cc",
    "#006600", 
    "#cc0000"
  ],
  "components": {
    "borderRadius": 4,
    "shadows": false
  }
}'
```

## 프로젝트 상태 확인

```bash
ITU-status
```

출력 예제:
```
📊 ITU Project Status

🏗️  Project Info
   Name: my-app
   Version: 1.0.0
   Created: 2024-01-15
   Updated: 2024-01-15

⚙️  Settings
   Framework: react
   Responsive: Yes
   Include Styles: Yes
   Output Path: ./my-app/generated

🎨 Design
   Theme: dark
   Button Style: pill
   Border Radius: 20px
   Shadows: No
   Animations: No

📈 History
   Images Processed: 3
   Files Generated: 3
   Last Modified: 2024-01-15
```

## 팁과 베스트 프랙티스

1. **고해상도 이미지 사용**: 더 정확한 분석을 위해 최소 1200px 이상의 이미지 사용
2. **명확한 디자인**: 요소 간 경계가 명확한 디자인이 더 잘 분석됨
3. **단계별 접근**: 복잡한 디자인은 섹션별로 나누어 변환
4. **설정 백업**: `itu_requirements.md` 파일을 버전 관리에 포함
5. **반복적 개선**: ITU-modify로 점진적으로 결과를 개선