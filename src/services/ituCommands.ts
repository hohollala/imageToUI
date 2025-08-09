import fs from 'fs-extra';
import path from 'path';
import { ImageAnalyzer, ImageAnalysisResult } from './imageAnalyzer.js';
import { UIGenerator } from './uiGenerator.js';

export interface ITURequirements {
  project: {
    name: string;
    version: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  settings: {
    framework: 'react' | 'vue' | 'html-css' | 'flutter' | 'react-native';
    responsive: boolean;
    includeStyles: boolean;
    outputPath: string;
  };
  design: {
    theme: 'light' | 'dark' | 'auto';
    colorPalette: string[];
    typography: {
      primaryFont: string;
      fontSize: number;
      lineHeight: number;
    };
    layout: {
      type: 'grid' | 'flexbox' | 'absolute' | 'flow';
      responsive: boolean;
      spacing: number;
    };
    components: {
      buttonStyle: 'rounded' | 'square' | 'pill';
      borderRadius: number;
      shadows: boolean;
      animations: boolean;
    };
  };
  history: {
    images: string[];
    outputs: string[];
    lastModified: string;
  };
}

export interface ITUModifications {
  framework?: string;
  theme?: string;
  colorPalette?: string[];
  typography?: {
    primaryFont?: string;
    fontSize?: number;
    lineHeight?: number;
  };
  layout?: {
    type?: string;
    responsive?: boolean;
    spacing?: number;
  };
  components?: {
    buttonStyle?: string;
    borderRadius?: number;
    shadows?: boolean;
    animations?: boolean;
  };
}

export class ITUCommands {
  private imageAnalyzer: ImageAnalyzer;
  private uiGenerator: UIGenerator;

  constructor() {
    this.imageAnalyzer = new ImageAnalyzer();
    this.uiGenerator = new UIGenerator();
  }

  async init(
    projectPath: string = './itu-project',
    framework: string = 'react',
    responsive: boolean = true,
    includeStyles: boolean = true
  ): Promise<string> {
    // Create project directory if it doesn't exist
    await fs.ensureDir(projectPath);
    
    const requirementsPath = path.join(projectPath, 'itu_requirements.md');
    
    // Create default requirements
    const requirements: ITURequirements = {
      project: {
        name: path.basename(projectPath),
        version: '1.0.0',
        description: 'Image-to-UI conversion project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      settings: {
        framework: framework as any,
        responsive,
        includeStyles,
        outputPath: path.join(projectPath, 'generated'),
      },
      design: {
        theme: 'light',
        colorPalette: ['#ffffff', '#000000', '#007bff', '#28a745', '#dc3545'],
        typography: {
          primaryFont: 'system-ui, -apple-system, sans-serif',
          fontSize: 16,
          lineHeight: 1.5,
        },
        layout: {
          type: 'flexbox',
          responsive: true,
          spacing: 16,
        },
        components: {
          buttonStyle: 'rounded',
          borderRadius: 8,
          shadows: true,
          animations: false,
        },
      },
      history: {
        images: [],
        outputs: [],
        lastModified: new Date().toISOString(),
      },
    };

    // Generate markdown content
    const markdownContent = this.generateRequirementsMarkdown(requirements);
    
    // Write requirements file
    await fs.writeFile(requirementsPath, markdownContent, 'utf-8');
    
    // Create output directory
    await fs.ensureDir(requirements.settings.outputPath);
    
    return `✅ ITU project initialized successfully!

📁 Project: ${projectPath}
📄 Requirements: ${requirementsPath}
🎯 Framework: ${framework}
📱 Responsive: ${responsive ? 'Yes' : 'No'}
🎨 Styles: ${includeStyles ? 'Included' : 'Excluded'}

Next steps:
1. Review and customize itu_requirements.md
2. Use ITU-start with your image file
3. Use ITU-modify for custom changes`;
  }

  async start(
    imagePath: string,
    requirementsPath: string = './itu_requirements.md',
    outputPath?: string
  ): Promise<string> {
    // Load requirements
    const requirements = await this.loadRequirements(requirementsPath);
    
    // Analyze image
    const analysis = await this.imageAnalyzer.analyzeImage(imagePath, 'full');
    
    // Apply requirements to analysis
    const enhancedAnalysis = this.applyRequirementsToAnalysis(analysis, requirements);
    
    // Generate code
    const code = await this.uiGenerator.generateCode(
      enhancedAnalysis,
      requirements.settings.framework,
      {
        includeStyles: requirements.settings.includeStyles,
        responsive: requirements.settings.responsive,
      }
    );

    // Save output
    const finalOutputPath = outputPath || requirements.settings.outputPath;
    await fs.ensureDir(finalOutputPath);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `ui-${timestamp}.${this.getFileExtension(requirements.settings.framework)}`;
    const fullOutputPath = path.join(finalOutputPath, filename);
    
    await fs.writeFile(fullOutputPath, code, 'utf-8');
    
    // Update requirements history
    requirements.history.images.push(imagePath);
    requirements.history.outputs.push(fullOutputPath);
    requirements.history.lastModified = new Date().toISOString();
    requirements.project.updatedAt = new Date().toISOString();
    
    await this.saveRequirements(requirements, requirementsPath);
    
    return `✅ Image-to-UI conversion completed!

📸 Input: ${imagePath}
📁 Output: ${fullOutputPath}
🎯 Framework: ${requirements.settings.framework}
📐 Dimensions: ${analysis.dimensions.width}x${analysis.dimensions.height}
🎨 Elements: ${analysis.elements.length} components detected

Generated code saved to: ${fullOutputPath}`;
  }

  async modify(
    imagePath: string,
    modifications: ITUModifications,
    requirementsPath: string = './itu_requirements.md',
    outputPath?: string
  ): Promise<string> {
    // Load current requirements
    let requirements = await this.loadRequirements(requirementsPath);
    
    // Apply modifications
    requirements = this.applyModifications(requirements, modifications);
    
    // Save updated requirements
    await this.saveRequirements(requirements, requirementsPath);
    
    // Re-run conversion with new settings
    return await this.start(imagePath, requirementsPath, outputPath);
  }

  async status(requirementsPath: string = './itu_requirements.md'): Promise<string> {
    try {
      const requirements = await this.loadRequirements(requirementsPath);
      
      return `📊 ITU Project Status

🏗️  **Project Info**
   Name: ${requirements.project.name}
   Version: ${requirements.project.version}
   Created: ${new Date(requirements.project.createdAt).toLocaleDateString()}
   Updated: ${new Date(requirements.project.updatedAt).toLocaleDateString()}

⚙️  **Settings**
   Framework: ${requirements.settings.framework}
   Responsive: ${requirements.settings.responsive ? 'Yes' : 'No'}
   Include Styles: ${requirements.settings.includeStyles ? 'Yes' : 'No'}
   Output Path: ${requirements.settings.outputPath}

🎨 **Design**
   Theme: ${requirements.design.theme}
   Button Style: ${requirements.design.components.buttonStyle}
   Border Radius: ${requirements.design.components.borderRadius}px
   Shadows: ${requirements.design.components.shadows ? 'Yes' : 'No'}
   Animations: ${requirements.design.components.animations ? 'Yes' : 'No'}

📈 **History**
   Images Processed: ${requirements.history.images.length}
   Files Generated: ${requirements.history.outputs.length}
   Last Modified: ${new Date(requirements.history.lastModified).toLocaleDateString()}`;
      
    } catch (error) {
      return `❌ No ITU project found at: ${requirementsPath}

Use ITU-init to initialize a new project.`;
    }
  }

  private async loadRequirements(requirementsPath: string): Promise<ITURequirements> {
    if (!await fs.pathExists(requirementsPath)) {
      throw new Error(`Requirements file not found: ${requirementsPath}`);
    }
    
    const content = await fs.readFile(requirementsPath, 'utf-8');
    return this.parseRequirementsMarkdown(content);
  }

  private async saveRequirements(requirements: ITURequirements, requirementsPath: string): Promise<void> {
    const content = this.generateRequirementsMarkdown(requirements);
    await fs.writeFile(requirementsPath, content, 'utf-8');
  }

  private generateRequirementsMarkdown(requirements: ITURequirements): string {
    return `# ITU Requirements

## Project Information
- **Name**: ${requirements.project.name}
- **Version**: ${requirements.project.version}
- **Description**: ${requirements.project.description}
- **Created**: ${requirements.project.createdAt}
- **Updated**: ${requirements.project.updatedAt}

## Settings
- **Framework**: ${requirements.settings.framework}
- **Responsive**: ${requirements.settings.responsive}
- **Include Styles**: ${requirements.settings.includeStyles}
- **Output Path**: ${requirements.settings.outputPath}

## Design System

### Theme
- **Color Theme**: ${requirements.design.theme}
- **Color Palette**: ${requirements.design.colorPalette.join(', ')}

### Typography
- **Primary Font**: ${requirements.design.typography.primaryFont}
- **Font Size**: ${requirements.design.typography.fontSize}px
- **Line Height**: ${requirements.design.typography.lineHeight}

### Layout
- **Type**: ${requirements.design.layout.type}
- **Responsive**: ${requirements.design.layout.responsive}
- **Spacing**: ${requirements.design.layout.spacing}px

### Components
- **Button Style**: ${requirements.design.components.buttonStyle}
- **Border Radius**: ${requirements.design.components.borderRadius}px
- **Shadows**: ${requirements.design.components.shadows}
- **Animations**: ${requirements.design.components.animations}

## History
- **Images Processed**: ${requirements.history.images.length}
- **Last Modified**: ${requirements.history.lastModified}

### Recent Images
${requirements.history.images.slice(-5).map(img => `- ${img}`).join('\n') || '- None'}

### Recent Outputs
${requirements.history.outputs.slice(-5).map(out => `- ${out}`).join('\n') || '- None'}

---
*This file is automatically generated and managed by ITU MCP Server*
`;
  }

  private parseRequirementsMarkdown(content: string): ITURequirements {
    // Basic parsing - in a real implementation, you'd use a proper markdown parser
    const lines = content.split('\n');
    
    // Extract values using regex patterns
    const extractValue = (pattern: RegExp): string => {
      const line = lines.find(l => pattern.test(l));
      return line ? line.split(':')[1]?.trim() || '' : '';
    };

    const extractBoolean = (pattern: RegExp): boolean => {
      const value = extractValue(pattern);
      return value.toLowerCase() === 'true';
    };

    const extractNumber = (pattern: RegExp): number => {
      const value = extractValue(pattern);
      return parseInt(value) || 0;
    };

    return {
      project: {
        name: extractValue(/\*\*Name\*\*/),
        version: extractValue(/\*\*Version\*\*/),
        description: extractValue(/\*\*Description\*\*/),
        createdAt: extractValue(/\*\*Created\*\*/),
        updatedAt: extractValue(/\*\*Updated\*\*/),
      },
      settings: {
        framework: extractValue(/\*\*Framework\*\*/) as any || 'react',
        responsive: extractBoolean(/\*\*Responsive\*\*/),
        includeStyles: extractBoolean(/\*\*Include Styles\*\*/),
        outputPath: extractValue(/\*\*Output Path\*\*/) || './generated',
      },
      design: {
        theme: extractValue(/\*\*Color Theme\*\*/) as any || 'light',
        colorPalette: extractValue(/\*\*Color Palette\*\*/).split(', ').filter(Boolean),
        typography: {
          primaryFont: extractValue(/\*\*Primary Font\*\*/),
          fontSize: extractNumber(/\*\*Font Size\*\*/),
          lineHeight: parseFloat(extractValue(/\*\*Line Height\*\*/)) || 1.5,
        },
        layout: {
          type: extractValue(/\*\*Type\*\*/) as any || 'flexbox',
          responsive: extractBoolean(/\*\*Responsive\*\*/),
          spacing: extractNumber(/\*\*Spacing\*\*/),
        },
        components: {
          buttonStyle: extractValue(/\*\*Button Style\*\*/) as any || 'rounded',
          borderRadius: extractNumber(/\*\*Border Radius\*\*/),
          shadows: extractBoolean(/\*\*Shadows\*\*/),
          animations: extractBoolean(/\*\*Animations\*\*/),
        },
      },
      history: {
        images: [],
        outputs: [],
        lastModified: extractValue(/\*\*Last Modified\*\*/),
      },
    };
  }

  private applyModifications(requirements: ITURequirements, modifications: ITUModifications): ITURequirements {
    const updated = { ...requirements };
    
    if (modifications.framework) {
      updated.settings.framework = modifications.framework as any;
    }
    
    if (modifications.theme) {
      updated.design.theme = modifications.theme as any;
    }
    
    if (modifications.colorPalette) {
      updated.design.colorPalette = modifications.colorPalette;
    }
    
    if (modifications.typography) {
      updated.design.typography = { ...updated.design.typography, ...modifications.typography };
    }
    
    if (modifications.layout) {
      updated.design.layout = { 
        ...updated.design.layout, 
        ...modifications.layout,
        type: modifications.layout.type as 'grid' | 'flexbox' | 'absolute' | 'flow'
      };
    }
    
    if (modifications.components) {
      updated.design.components = { 
        ...updated.design.components, 
        ...modifications.components,
        buttonStyle: modifications.components.buttonStyle as 'rounded' | 'square' | 'pill'
      };
    }
    
    updated.project.updatedAt = new Date().toISOString();
    
    return updated;
  }

  private applyRequirementsToAnalysis(analysis: ImageAnalysisResult, requirements: ITURequirements): ImageAnalysisResult {
    return {
      ...analysis,
      colorPalette: requirements.design.colorPalette.length > 0 
        ? requirements.design.colorPalette 
        : analysis.colorPalette,
      typography: {
        ...analysis.typography,
        primaryFont: requirements.design.typography.primaryFont,
        bodySize: requirements.design.typography.fontSize,
        lineHeight: requirements.design.typography.lineHeight,
      },
      layout: {
        ...analysis.layout,
        type: requirements.design.layout.type,
        spacing: requirements.design.layout.spacing,
        responsive: requirements.design.layout.responsive,
      },
      designSystem: {
        ...analysis.designSystem,
        theme: requirements.design.theme as 'light' | 'dark' | 'mixed',
        borderRadius: this.getBorderRadiusSize(requirements.design.components.borderRadius),
        shadows: requirements.design.components.shadows,
        animations: requirements.design.components.animations,
      },
    };
  }

  private getBorderRadiusSize(radius: number): 'none' | 'small' | 'medium' | 'large' {
    if (radius === 0) return 'none';
    if (radius <= 4) return 'small';
    if (radius <= 8) return 'medium';
    return 'large';
  }

  private getFileExtension(framework: string): string {
    switch (framework) {
      case 'react':
        return 'jsx';
      case 'vue':
        return 'vue';
      case 'html-css':
        return 'html';
      case 'flutter':
        return 'dart';
      case 'react-native':
        return 'jsx';
      default:
        return 'txt';
    }
  }
}