import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import OpenAI from 'openai';

export interface ImageAnalysisResult {
  dimensions: {
    width: number;
    height: number;
  };
  elements: UIElement[];
  layout: LayoutInfo;
  colorPalette: string[];
  typography: TypographyInfo;
  designSystem: DesignSystemInfo;
}

export interface UIElement {
  type: 'button' | 'input' | 'text' | 'image' | 'container' | 'header' | 'footer' | 'navigation' | 'card';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content?: string;
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
  };
  attributes?: Record<string, any>;
}

export interface LayoutInfo {
  type: 'grid' | 'flexbox' | 'absolute' | 'flow';
  direction: 'row' | 'column';
  alignment: string;
  spacing: number;
  responsive: boolean;
}

export interface TypographyInfo {
  primaryFont: string;
  secondaryFont?: string;
  headingSizes: number[];
  bodySize: number;
  lineHeight: number;
}

export interface DesignSystemInfo {
  theme: 'light' | 'dark' | 'mixed';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadows: boolean;
  animations: boolean;
}

export class ImageAnalyzer {
  private openai?: OpenAI;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async analyzeImage(
    imagePath: string,
    mode: 'layout' | 'components' | 'full' = 'full'
  ): Promise<ImageAnalysisResult> {
    // Validate file exists and is an image
    if (!await fs.pathExists(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.bmp'].includes(ext)) {
      throw new Error(`Unsupported image format: ${ext}`);
    }

    // Get image metadata
    const imageBuffer = await fs.readFile(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions');
    }

    // Basic analysis without AI
    let analysisResult: ImageAnalysisResult = {
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
      elements: [],
      layout: {
        type: 'flow',
        direction: 'column',
        alignment: 'center',
        spacing: 16,
        responsive: true,
      },
      colorPalette: [],
      typography: {
        primaryFont: 'system-ui, sans-serif',
        headingSizes: [32, 24, 20, 18],
        bodySize: 16,
        lineHeight: 1.5,
      },
      designSystem: {
        theme: 'light',
        borderRadius: 'medium',
        shadows: true,
        animations: false,
      },
    };

    // Extract dominant colors
    analysisResult.colorPalette = await this.extractColorPalette(imageBuffer);

    // AI-powered analysis if OpenAI is available
    if (this.openai) {
      try {
        analysisResult = await this.analyzeWithAI(imageBuffer, analysisResult, mode);
      } catch (error) {
        console.warn('AI analysis failed, using basic analysis:', error);
        // Continue with basic analysis
      }
    }

    // If no AI, create some basic elements based on image characteristics
    if (analysisResult.elements.length === 0) {
      analysisResult.elements = this.generateBasicElements(analysisResult);
    }

    return analysisResult;
  }

  private async extractColorPalette(imageBuffer: Buffer): Promise<string[]> {
    try {
      // Resize image and extract dominant colors using sharp
      const { data } = await sharp(imageBuffer)
        .resize(50, 50)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const colorMap = new Map<string, number>();
      
      // Sample colors from the resized image
      for (let i = 0; i < data.length; i += 3) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Round to nearest 16 to group similar colors
        const roundedR = Math.round(r / 16) * 16;
        const roundedG = Math.round(g / 16) * 16;
        const roundedB = Math.round(b / 16) * 16;
        
        const color = `rgb(${roundedR}, ${roundedG}, ${roundedB})`;
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }

      // Get top 5 colors
      return Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color);
    } catch (error) {
      console.warn('Color extraction failed:', error);
      return ['#ffffff', '#000000', '#f0f0f0', '#333333', '#007bff'];
    }
  }

  private async analyzeWithAI(
    imageBuffer: Buffer,
    basicResult: ImageAnalysisResult,
    mode: string
  ): Promise<ImageAnalysisResult> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `Analyze this UI/UX image and provide detailed information about:
1. UI elements (buttons, inputs, text, images, containers, etc.) with their positions and styles
2. Layout structure (grid, flexbox, flow)
3. Typography information
4. Design system characteristics
5. Color scheme and theme

Mode: ${mode}
Image dimensions: ${basicResult.dimensions.width}x${basicResult.dimensions.height}

Return a JSON object matching this structure:
{
  "elements": [
    {
      "type": "button|input|text|image|container|header|footer|navigation|card",
      "position": {"x": 0, "y": 0, "width": 100, "height": 40},
      "content": "text content if applicable",
      "styles": {
        "backgroundColor": "#color",
        "color": "#color",
        "fontSize": 16,
        "fontWeight": "normal|bold",
        "borderRadius": 4,
        "padding": 8,
        "margin": 4
      },
      "attributes": {}
    }
  ],
  "layout": {
    "type": "grid|flexbox|absolute|flow",
    "direction": "row|column",
    "alignment": "start|center|end|stretch",
    "spacing": 16,
    "responsive": true
  },
  "typography": {
    "primaryFont": "font-family",
    "headingSizes": [32, 24, 20, 18],
    "bodySize": 16,
    "lineHeight": 1.5
  },
  "designSystem": {
    "theme": "light|dark|mixed",
    "borderRadius": "none|small|medium|large",
    "shadows": true,
    "animations": false
  }
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    try {
      const aiAnalysis = JSON.parse(content);
      
      // Merge AI analysis with basic result
      return {
        ...basicResult,
        elements: aiAnalysis.elements || basicResult.elements,
        layout: { ...basicResult.layout, ...aiAnalysis.layout },
        typography: { ...basicResult.typography, ...aiAnalysis.typography },
        designSystem: { ...basicResult.designSystem, ...aiAnalysis.designSystem },
      };
    } catch (parseError) {
      console.warn('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }
  }

  private generateBasicElements(result: ImageAnalysisResult): UIElement[] {
    const { width, height } = result.dimensions;
    const elements: UIElement[] = [];

    // Create basic layout based on aspect ratio and size
    if (width > height * 1.5) {
      // Wide layout - likely header/nav
      elements.push({
        type: 'header',
        position: { x: 0, y: 0, width, height: Math.min(80, height * 0.15) },
        styles: {
          backgroundColor: result.colorPalette[0] || '#ffffff',
          color: result.colorPalette[1] || '#000000',
          padding: 16,
        },
      });
    }

    // Add main content area
    const mainY = elements.length > 0 ? 80 : 0;
    elements.push({
      type: 'container',
      position: { 
        x: 0, 
        y: mainY, 
        width, 
        height: height - mainY 
      },
      styles: {
        backgroundColor: result.colorPalette[2] || '#f8f9fa',
        padding: 20,
      },
    });

    return elements;
  }
}