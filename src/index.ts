#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ImageAnalyzer } from './services/imageAnalyzer.js';
import { UIGenerator } from './services/uiGenerator.js';
import { ITUCommands } from './services/ituCommands.js';
import { AdvancedImageAnalyzer } from './services/advancedImageAnalyzer.js';
import { BrandDatabase } from './services/brandDatabase.js';
import { UIValidator } from './services/uiValidator.js';
import { PremiumCodeGenerator } from './services/premiumCodeGenerator.js';

const server = new Server(
  {
    name: 'image-to-ui-mcp-server',
    version: '2.0.0',
  }
);

const imageAnalyzer = new ImageAnalyzer();
const uiGenerator = new UIGenerator();
const ituCommands = new ITUCommands();
const advancedImageAnalyzer = new AdvancedImageAnalyzer();
const brandDatabase = new BrandDatabase();
const uiValidator = new UIValidator();
const premiumCodeGenerator = new PremiumCodeGenerator();

// Available tools
const TOOLS: Tool[] = [
  {
    name: 'ITU-init',
    description: 'Initialize Image-to-UI project and create itu_requirements.md file with project configuration',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Path where to initialize the ITU project',
          default: './itu-project',
        },
        framework: {
          type: 'string',
          enum: ['react', 'vue', 'html-css', 'flutter', 'react-native'],
          description: 'Default target framework',
          default: 'react',
        },
        responsive: {
          type: 'boolean',
          description: 'Enable responsive design by default',
          default: true,
        },
        includeStyles: {
          type: 'boolean',
          description: 'Include styling code by default',
          default: true,
        },
      },
      required: [],
    },
  },
  {
    name: 'ITU-start',
    description: 'Start Image-to-UI conversion process using itu_requirements.md configuration',
    inputSchema: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the image file to convert (png, jpg, bmp)',
        },
        requirementsPath: {
          type: 'string',
          description: 'Path to itu_requirements.md file',
          default: './itu_requirements.md',
        },
        outputPath: {
          type: 'string',
          description: 'Path to save generated code files',
        },
      },
      required: ['imagePath'],
    },
  },
  {
    name: 'ITU-modify',
    description: 'Modify ITU project settings and regenerate code with custom changes',
    inputSchema: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the image file',
        },
        modifications: {
          type: 'object',
          description: 'Custom modifications to apply',
          properties: {
            framework: {
              type: 'string',
              enum: ['react', 'vue', 'html-css', 'flutter', 'react-native'],
              description: 'Override target framework',
            },
            theme: {
              type: 'string',
              enum: ['light', 'dark', 'auto'],
              description: 'Color theme preference',
            },
            colorPalette: {
              type: 'array',
              items: { type: 'string' },
              description: 'Custom color palette (hex codes)',
            },
            typography: {
              type: 'object',
              properties: {
                primaryFont: { type: 'string' },
                fontSize: { type: 'number' },
                lineHeight: { type: 'number' },
              },
            },
            layout: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['grid', 'flexbox', 'absolute', 'flow'] },
                responsive: { type: 'boolean' },
                spacing: { type: 'number' },
              },
            },
            components: {
              type: 'object',
              properties: {
                buttonStyle: { type: 'string', enum: ['rounded', 'square', 'pill'] },
                borderRadius: { type: 'number' },
                shadows: { type: 'boolean' },
                animations: { type: 'boolean' },
              },
            },
          },
        },
        requirementsPath: {
          type: 'string',
          description: 'Path to itu_requirements.md file',
          default: './itu_requirements.md',
        },
        outputPath: {
          type: 'string',
          description: 'Path to save modified code files',
        },
      },
      required: ['imagePath', 'modifications'],
    },
  },
  {
    name: 'ITU-status',
    description: 'Check current ITU project status and configuration',
    inputSchema: {
      type: 'object',
      properties: {
        requirementsPath: {
          type: 'string',
          description: 'Path to itu_requirements.md file',
          default: './itu_requirements.md',
        },
      },
      required: [],
    },
  },
  {
    name: 'ITU-premium',
    description: 'Generate pixel-perfect UI code with advanced analysis, brand optimization, and quality validation',
    inputSchema: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the image file to convert (png, jpg, bmp)',
        },
        options: {
          type: 'object',
          description: 'Advanced generation options',
          properties: {
            framework: {
              type: 'string',
              enum: ['react', 'vue', 'html', 'flutter', 'react-native'],
              description: 'Target framework',
              default: 'html',
            },
            typescript: {
              type: 'boolean',
              description: 'Generate TypeScript code',
              default: false,
            },
            responsive: {
              type: 'boolean',
              description: 'Enable responsive design',
              default: true,
            },
            darkMode: {
              type: 'boolean',
              description: 'Include dark/light mode support',
              default: true,
            },
            accessibility: {
              type: 'boolean',
              description: 'Include accessibility features (WCAG 2.1)',
              default: true,
            },
            pixelPerfect: {
              type: 'boolean',
              description: 'Enable pixel-perfect measurement',
              default: true,
            },
            brandOptimized: {
              type: 'boolean',
              description: 'Enable brand recognition and optimization',
              default: true,
            },
            performanceOptimized: {
              type: 'boolean',
              description: 'Enable performance optimizations',
              default: true,
            },
          },
        },
        outputPath: {
          type: 'string',
          description: 'Path to save generated premium code files',
        },
      },
      required: ['imagePath'],
    },
  },
  {
    name: 'ITU-validate',
    description: 'Validate generated UI against original image with detailed quality metrics',
    inputSchema: {
      type: 'object',
      properties: {
        originalImagePath: {
          type: 'string',
          description: 'Path to the original image file',
        },
        generatedCodePath: {
          type: 'string',
          description: 'Path to the generated code file to validate',
        },
        analysisResultPath: {
          type: 'string',
          description: 'Path to saved analysis result (optional)',
        },
      },
      required: ['originalImagePath', 'generatedCodePath'],
    },
  },
  {
    name: 'ITU-analyze',
    description: 'Perform advanced image analysis with pixel-perfect measurements and brand detection',
    inputSchema: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the image file to analyze (png, jpg, bmp)',
        },
        saveAnalysis: {
          type: 'boolean',
          description: 'Save analysis result to file',
          default: true,
        },
        outputPath: {
          type: 'string',
          description: 'Path to save analysis results',
        },
      },
      required: ['imagePath'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('No arguments provided');
  }

  try {
    switch (name) {
      case 'ITU-init':
        const initResult = await ituCommands.init(
          args.projectPath as string,
          args.framework as string,
          args.responsive as boolean,
          args.includeStyles as boolean
        );
        
        return {
          content: [
            {
              type: 'text',
              text: initResult,
            },
          ],
        };

      case 'ITU-start':
        const startResult = await ituCommands.start(
          args.imagePath as string,
          args.requirementsPath as string,
          args.outputPath as string
        );
        
        return {
          content: [
            {
              type: 'text',
              text: startResult,
            },
          ],
        };

      case 'ITU-modify':
        const modifyResult = await ituCommands.modify(
          args.imagePath as string,
          args.modifications as any,
          args.requirementsPath as string,
          args.outputPath as string
        );
        
        return {
          content: [
            {
              type: 'text',
              text: modifyResult,
            },
          ],
        };

      case 'ITU-status':
        const statusResult = await ituCommands.status(
          args.requirementsPath as string
        );
        
        return {
          content: [
            {
              type: 'text',
              text: statusResult,
            },
          ],
        };

      case 'ITU-premium':
        console.log('🎨 Premium UI 생성 시작...');
        
        // 1. 고급 이미지 분석
        const analysisResult = await advancedImageAnalyzer.analyzeImageAdvanced(
          args.imagePath as string
        );
        
        // 2. 프리미엄 코드 생성
        const generatedCode = await premiumCodeGenerator.generatePixelPerfectCode(
          analysisResult,
          args.options as any || {
            framework: 'html',
            responsive: true,
            darkMode: true,
            accessibility: true,
            pixelPerfect: true,
            brandOptimized: true,
            performanceOptimized: true
          }
        );
        
        // 3. 파일 저장
        const outputDir = args.outputPath as string || './premium-output';
        const fs = require('fs-extra');
        const path = require('path');
        
        await fs.ensureDir(outputDir);
        
        for (const file of generatedCode.files) {
          const fullPath = path.join(outputDir, file.path);
          await fs.ensureDir(path.dirname(fullPath));
          await fs.writeFile(fullPath, file.content, 'utf-8');
        }
        
        for (const asset of generatedCode.assets) {
          const fullPath = path.join(outputDir, asset.path);
          await fs.ensureDir(path.dirname(fullPath));
          await fs.writeFile(fullPath, asset.content);
        }
        
        // 4. 결과 리포트
        const report = `✅ Premium UI 생성 완료!

📊 품질 메트릭:
• 코드 품질: ${generatedCode.qualityMetrics.codeQuality}/100
• 브랜드 정확도: ${generatedCode.qualityMetrics.brandAccuracy}/100
• 픽셀 완벽도: ${generatedCode.qualityMetrics.pixelPerfection}/100
• 접근성: ${generatedCode.qualityMetrics.accessibility}/100
• 성능: ${generatedCode.qualityMetrics.performance}/100
• 유지보수성: ${generatedCode.qualityMetrics.maintainability}/100

📁 생성된 파일:
${generatedCode.files.map(f => `• ${f.path} - ${f.description}`).join('\n')}

📋 설치 가이드:
${generatedCode.instructions.join('\n')}

🎯 브랜드 정보:
• 감지된 브랜드: ${analysisResult.brandIdentification.detectedBrand}
• 신뢰도: ${(analysisResult.brandIdentification.confidence * 100).toFixed(1)}%

📏 픽셀 측정:
• 이미지 크기: ${analysisResult.pixelMeasurements.dimensions.width}x${analysisResult.pixelMeasurements.dimensions.height}px
• 색상 개수: ${analysisResult.preciseColorPalette.dominant.length}개
• 컴포넌트 개수: ${analysisResult.componentStructure.children?.length || 0}개`;
        
        return {
          content: [
            {
              type: 'text',
              text: report,
            },
          ],
        };

      case 'ITU-validate':
        console.log('🔍 UI 검증 시작...');
        
        // 분석 결과 로드 또는 새로 분석
        let validationAnalysis;
        if (args.analysisResultPath) {
          const fs = require('fs-extra');
          validationAnalysis = JSON.parse(await fs.readFile(args.analysisResultPath as string, 'utf-8'));
        } else {
          validationAnalysis = await advancedImageAnalyzer.analyzeImageAdvanced(
            args.originalImagePath as string
          );
        }
        
        // UI 검증 수행
        const validationResult = await uiValidator.validateUI(
          args.originalImagePath as string,
          args.generatedCodePath as string,
          validationAnalysis
        );
        
        // 실시간 개선 제안
        const improvements = await uiValidator.generateRealTimeImprovements(
          validationResult,
          args.generatedCodePath as string
        );
        
        const validationReport = `🔍 UI 검증 결과

🎯 종합 점수: ${validationResult.overallScore}/100 (신뢰도: ${validationResult.confidence}%)

📊 세부 점수:
• 시각적 유사도: ${validationResult.breakdown.visualSimilarity.toFixed(1)}/100
• 레이아웃 정확도: ${validationResult.breakdown.layoutAccuracy.toFixed(1)}/100
• 색상 일치도: ${validationResult.breakdown.colorMatching.toFixed(1)}/100
• 타이포그래피: ${validationResult.breakdown.typographyMatch.toFixed(1)}/100
• 인터랙션 요소: ${validationResult.breakdown.interactionElements.toFixed(1)}/100
• 브랜드 일관성: ${validationResult.breakdown.brandConsistency.toFixed(1)}/100

⚠️ 발견된 문제점 (${validationResult.issues.length}개):
${validationResult.issues.map(issue => 
  `• [${issue.severity.toUpperCase()}] ${issue.description}\n  💡 해결 방법: ${issue.suggestion}`
).join('\n\n')}

🔧 실시간 개선 제안:
${improvements.map(imp => `• ${imp}`).join('\n')}

✨ 일반적인 개선 방법:
${validationResult.improvements.map(imp => `• ${imp}`).join('\n')}`;
        
        return {
          content: [
            {
              type: 'text',
              text: validationReport,
            },
          ],
        };

      case 'ITU-analyze':
        console.log('🔬 고급 이미지 분석 시작...');
        
        const detailedAnalysis = await advancedImageAnalyzer.analyzeImageAdvanced(
          args.imagePath as string
        );
        
        // 분석 결과 저장
        if (args.saveAnalysis) {
          const outputPath = args.outputPath as string || './analysis-result.json';
          const fs = require('fs-extra');
          const path = require('path');
          
          await fs.ensureDir(path.dirname(outputPath));
          await fs.writeFile(outputPath, JSON.stringify(detailedAnalysis, null, 2), 'utf-8');
        }
        
        const analysisReport = `🔬 고급 이미지 분석 완료

📏 픽셀 측정 결과:
• 이미지 크기: ${detailedAnalysis.pixelMeasurements.dimensions.width}x${detailedAnalysis.pixelMeasurements.dimensions.height}px
• DPI: ${detailedAnalysis.pixelMeasurements.dpi}
• 간격 스케일: [${detailedAnalysis.pixelMeasurements.spacing.scale.join(', ')}]px

🎨 브랜드 식별:
• 감지된 브랜드: ${detailedAnalysis.brandIdentification.detectedBrand}
• 신뢰도: ${(detailedAnalysis.brandIdentification.confidence * 100).toFixed(1)}%
• 주요 색상: ${detailedAnalysis.brandIdentification.brandAssets?.colors?.primary || 'N/A'}

🧩 컴포넌트 구조:
• 타입: ${detailedAnalysis.componentStructure.type}
• 하위 요소: ${detailedAnalysis.componentStructure.children?.length || 0}개
• 레이아웃: ${detailedAnalysis.componentStructure.layout}

🎨 정밀 색상 분석:
• 주요 색상: ${detailedAnalysis.preciseColorPalette.dominant.length}개
• 보조 색상: ${detailedAnalysis.preciseColorPalette.secondary.length}개
• 강조 색상: ${detailedAnalysis.preciseColorPalette.accent.length}개

⚡ 인터랙션 요소:
• 버튼: ${detailedAnalysis.interactionElements.filter(el => el.type === 'button').length}개
• 링크: ${detailedAnalysis.interactionElements.filter(el => el.type === 'link').length}개
• 입력 필드: ${detailedAnalysis.interactionElements.filter(el => el.type === 'input').length}개

📊 분석 품질:
• 전체 점수: ${detailedAnalysis.analysisQuality.overallScore}/100
• 신뢰도: ${(detailedAnalysis.analysisQuality.confidence * 100).toFixed(1)}%
• 처리 시간: ${detailedAnalysis.analysisQuality.processingTime}ms`;
        
        return {
          content: [
            {
              type: 'text',
              text: analysisReport,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🎨 Image-to-UI Premium MCP Server v2.0 running on stdio\n📦 Available commands: ITU-init, ITU-start, ITU-modify, ITU-status, ITU-premium, ITU-validate, ITU-analyze');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});