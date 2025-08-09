import fs from 'fs-extra';
import path from 'path';
import { ImageAnalysisResult, UIElement } from './imageAnalyzer.js';

export interface GenerationOptions {
  includeStyles: boolean;
  responsive: boolean;
}

export class UIGenerator {
  async generateCode(
    analysis: ImageAnalysisResult,
    framework: string,
    options: GenerationOptions
  ): Promise<string> {
    switch (framework) {
      case 'react':
        return this.generateReactCode(analysis, options);
      case 'vue':
        return this.generateVueCode(analysis, options);
      case 'html-css':
        return this.generateHtmlCssCode(analysis, options);
      case 'flutter':
        return this.generateFlutterCode(analysis, options);
      case 'react-native':
        return this.generateReactNativeCode(analysis, options);
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  async saveCode(code: string, outputPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, code, 'utf-8');
  }

  private generateReactCode(analysis: ImageAnalysisResult, options: GenerationOptions): string {
    const { dimensions, elements, layout, colorPalette, typography, designSystem } = analysis;
    
    // Generate component JSX
    const componentJsx = this.generateReactElements(elements, options.responsive);
    
    // Generate styles
    const styles = options.includeStyles 
      ? this.generateReactStyles(analysis, options.responsive)
      : '';

    return `import React, { useState, useEffect } from 'react';
${options.includeStyles ? "import './Component.css';" : ''}

const GeneratedComponent = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Auto-detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={\`generated-container \${darkMode ? 'dark-theme' : 'light-theme'}\`}>
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {darkMode ? '🌞' : '🌙'}
      </button>
      
${componentJsx}
    </div>
  );
};

export default GeneratedComponent;

${options.includeStyles ? `\n/* Component.css */\n${styles}` : ''}`;
  }

  private generateReactElements(elements: UIElement[], responsive: boolean): string {
    return elements.map(element => {
      const className = `generated-${element.type}`;
      const style = this.generateInlineStyles(element.styles);
      
      switch (element.type) {
        case 'button':
          return `      <button className="${className}" style={${style}}>
        ${element.content || 'Button'}
      </button>`;
          
        case 'input':
          return `      <input 
        type="text" 
        className="${className}" 
        style={${style}}
        placeholder="${element.content || 'Enter text...'}"
      />`;
          
        case 'text':
          return `      <p className="${className}" style={${style}}>
        ${element.content || 'Text content'}
      </p>`;
          
        case 'image':
          return `      <img 
        src="/placeholder-image.jpg" 
        alt="Generated image" 
        className="${className}" 
        style={${style}}
      />`;
          
        case 'container':
          return `      <div className="${className}" style={${style}}>
        {/* Container content */}
      </div>`;
          
        case 'header':
          return `      <header className="${className}" style={${style}}>
        <h1>${element.content || 'Header Title'}</h1>
      </header>`;
          
        case 'footer':
          return `      <footer className="${className}" style={${style}}>
        <p>${element.content || 'Footer content'}</p>
      </footer>`;
          
        case 'navigation':
          return `      <nav className="${className}" style={${style}}>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>`;
          
        case 'card':
          return `      <div className="${className} card" style={${style}}>
        <h3>${element.content || 'Card Title'}</h3>
        <p>Card description goes here.</p>
      </div>`;
          
        default:
          return `      <div className="${className}" style={${style}}>
        ${element.content || 'Content'}
      </div>`;
      }
    }).join('\n');
  }

  private generateInlineStyles(styles: any): string {
    const styleObject = Object.entries(styles)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
        return `${key}: '${value}'`;
      })
      .join(', ');
    
    return `{${styleObject}}`;
  }

  private generateReactStyles(analysis: ImageAnalysisResult, responsive: boolean): string {
    const { colorPalette, typography, designSystem } = analysis;

    return `:root {
  /* Light Theme */
  --bg-primary: ${colorPalette[0] || '#ffffff'};
  --bg-secondary: ${colorPalette[2] || '#f8f9fa'};
  --text-primary: ${colorPalette[1] || '#000000'};
  --text-secondary: ${colorPalette[3] || '#666666'};
  --accent-primary: ${colorPalette[2] || '#007bff'};
  --accent-secondary: ${colorPalette[4] || '#6c757d'};
  --border-color: ${colorPalette[3] || '#ddd'};
  --shadow: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"], .dark-theme {
  /* Dark Theme */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --accent-primary: #4dabf7;
  --accent-secondary: #868e96;
  --border-color: #404040;
  --shadow: rgba(0, 0, 0, 0.3);
}

.generated-container {
  font-family: ${typography.primaryFont};
  font-size: ${typography.bodySize}px;
  line-height: ${typography.lineHeight};
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
  ${responsive ? `
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;` : ''}
}

/* Theme Toggle Button */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  ${designSystem.shadows ? 'box-shadow: 0 4px 12px var(--shadow);' : ''}
}

.theme-toggle:hover {
  transform: scale(1.1);
  background: var(--accent-secondary);
}

.generated-button {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  padding: 12px 24px;
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  font-size: ${typography.bodySize}px;
  cursor: pointer;
  transition: all 0.3s ease;
  ${designSystem.shadows ? 'box-shadow: 0 2px 4px var(--shadow);' : ''}
}

.generated-button:hover {
  background-color: var(--accent-secondary);
  transform: translateY(-2px);
}

.generated-input {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  font-size: ${typography.bodySize}px;
  width: 100%;
  max-width: 300px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  ${designSystem.shadows ? 'box-shadow: inset 0 1px 3px var(--shadow);' : ''}
}

.generated-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
}

.generated-text {
  margin: 16px 0;
  font-size: ${typography.bodySize}px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.generated-container div,
.generated-header,
.generated-footer {
  margin: 16px 0;
}

.generated-header {
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  padding: 20px;
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  transition: all 0.3s ease;
}

.generated-footer {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 20px;
  text-align: center;
  margin-top: 40px;
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  transition: all 0.3s ease;
}

.generated-navigation ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

.generated-navigation a {
  text-decoration: none;
  color: var(--accent-primary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.generated-navigation a:hover {
  color: var(--accent-secondary);
}

.generated-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  padding: 20px;
  transition: all 0.3s ease;
  ${designSystem.shadows ? 'box-shadow: 0 2px 8px var(--shadow);' : ''}
}

.generated-card:hover {
  transform: translateY(-2px);
  ${designSystem.shadows ? 'box-shadow: 0 4px 16px var(--shadow);' : ''}
}

.generated-image {
  max-width: 100%;
  height: auto;
  border-radius: ${this.getBorderRadius(designSystem.borderRadius)};
  transition: all 0.3s ease;
}

${responsive ? `
@media (max-width: 768px) {
  .generated-container {
    padding: 16px;
  }
  
  .generated-navigation ul {
    flex-direction: column;
    gap: 12px;
  }
  
  .generated-button,
  .generated-input {
    width: 100%;
  }
}` : ''}`;
  }

  private generateVueCode(analysis: ImageAnalysisResult, options: GenerationOptions): string {
    const componentElements = this.generateVueElements(analysis.elements);
    const styles = options.includeStyles ? this.generateVueStyles(analysis, options.responsive) : '';

    return `<template>
  <div :class="['generated-container', darkMode ? 'dark-theme' : 'light-theme']">
    <!-- Theme Toggle Button -->
    <button 
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      {{ darkMode ? '🌞' : '🌙' }}
    </button>
    
${componentElements}
  </div>
</template>

<script>
export default {
  name: 'GeneratedComponent',
  data() {
    return {
      darkMode: false
    }
  },
  mounted() {
    // Auto-detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = mediaQuery.matches;
    
    mediaQuery.addListener(this.handleThemeChange);
  },
  beforeDestroy() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.removeListener(this.handleThemeChange);
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
    },
    handleThemeChange(e) {
      this.darkMode = e.matches;
    }
  }
}
</script>

<style scoped>
${styles}
</style>`;
  }

  private generateVueElements(elements: UIElement[]): string {
    return elements.map(element => {
      const className = `generated-${element.type}`;
      
      switch (element.type) {
        case 'button':
          return `    <button class="${className}">
      ${element.content || 'Button'}
    </button>`;
          
        case 'input':
          return `    <input 
      type="text" 
      class="${className}" 
      :placeholder="'${element.content || 'Enter text...'}'"
    />`;
          
        case 'text':
          return `    <p class="${className}">
      ${element.content || 'Text content'}
    </p>`;
          
        default:
          return `    <div class="${className}">
      ${element.content || 'Content'}
    </div>`;
      }
    }).join('\n');
  }

  private generateVueStyles(analysis: ImageAnalysisResult, responsive: boolean): string {
    return this.generateReactStyles(analysis, responsive); // 같은 CSS 변수 시스템 사용
  }

  private generateHtmlCssCode(analysis: ImageAnalysisResult, options: GenerationOptions): string {
    const htmlElements = this.generateHtmlElements(analysis.elements);
    const styles = options.includeStyles ? this.generateReactStyles(analysis, options.responsive) : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated UI with Theme Toggle</title>
    <style>
${styles}
    </style>
</head>
<body>
    <div class="generated-container light-theme" id="mainContainer">
        <!-- Theme Toggle Button -->
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
            <span id="themeIcon">🌙</span>
        </button>
        
${htmlElements}
    </div>

    <script>
        // Theme toggle functionality
        let isDarkMode = false;
        const container = document.getElementById('mainContainer');
        const themeIcon = document.getElementById('themeIcon');
        
        // Auto-detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            isDarkMode = true;
            updateTheme();
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            isDarkMode = e.matches;
            updateTheme();
        });
        
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            updateTheme();
        }
        
        function updateTheme() {
            if (isDarkMode) {
                container.classList.remove('light-theme');
                container.classList.add('dark-theme');
                themeIcon.textContent = '🌞';
            } else {
                container.classList.remove('dark-theme');
                container.classList.add('light-theme');
                themeIcon.textContent = '🌙';
            }
        }
    </script>
</body>
</html>`;
  }

  private generateHtmlElements(elements: UIElement[]): string {
    return elements.map(element => {
      const className = `generated-${element.type}`;
      
      switch (element.type) {
        case 'button':
          return `        <button class="${className}">
            ${element.content || 'Button'}
        </button>`;
          
        case 'input':
          return `        <input 
            type="text" 
            class="${className}" 
            placeholder="${element.content || 'Enter text...'}"
        />`;
          
        case 'text':
          return `        <p class="${className}">
            ${element.content || 'Text content'}
        </p>`;
          
        case 'header':
          return `        <header class="${className}">
            <h1>${element.content || 'Header Title'}</h1>
        </header>`;
          
        case 'footer':
          return `        <footer class="${className}">
            <p>${element.content || 'Footer content'}</p>
        </footer>`;
          
        default:
          return `        <div class="${className}">
            ${element.content || 'Content'}
        </div>`;
      }
    }).join('\n');
  }

  private generateFlutterCode(analysis: ImageAnalysisResult, options: GenerationOptions): string {
    const { colorPalette, typography } = analysis;
    
    return `import 'package:flutter/material.dart';

class GeneratedWidget extends StatefulWidget {
  @override
  _GeneratedWidgetState createState() => _GeneratedWidgetState();
}

class _GeneratedWidgetState extends State<GeneratedWidget> {
  bool isDarkMode = false;

  @override
  void initState() {
    super.initState();
    // Auto-detect system theme preference
    var brightness = WidgetsBinding.instance.window.platformBrightness;
    isDarkMode = brightness == Brightness.dark;
  }

  void toggleTheme() {
    setState(() {
      isDarkMode = !isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        brightness: isDarkMode ? Brightness.dark : Brightness.light,
        primarySwatch: Colors.blue,
        backgroundColor: isDarkMode ? Color(0xFF1a1a1a) : Color(0xFFffffff),
        scaffoldBackgroundColor: isDarkMode ? Color(0xFF1a1a1a) : Color(0xFFffffff),
        textTheme: TextTheme(
          bodyText1: TextStyle(
            fontFamily: '${typography.primaryFont}',
            fontSize: ${typography.bodySize}.0,
            color: isDarkMode ? Colors.white : Colors.black,
          ),
        ),
      ),
      home: Scaffold(
        body: Container(
          padding: EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Theme Toggle Button
              Align(
                alignment: Alignment.topRight,
                child: FloatingActionButton(
                  mini: true,
                  onPressed: toggleTheme,
                  child: Icon(isDarkMode ? Icons.wb_sunny : Icons.nightlight_round),
                  backgroundColor: isDarkMode ? Colors.amber : Colors.indigo,
                ),
              ),
              SizedBox(height: 20),
              
              // Generated content based on analysis
              Text(
                'Generated UI',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode ? Colors.white : Colors.black,
                ),
              ),
              SizedBox(height: 16),
              
              ElevatedButton(
                onPressed: () {},
                child: Text('Sample Button'),
                style: ElevatedButton.styleFrom(
                  primary: isDarkMode ? Colors.blue[400] : Colors.blue,
                  onPrimary: Colors.white,
                ),
              ),
              SizedBox(height: 16),
              
              TextField(
                decoration: InputDecoration(
                  hintText: 'Enter text...',
                  border: OutlineInputBorder(),
                  fillColor: isDarkMode ? Colors.grey[800] : Colors.grey[100],
                  filled: true,
                ),
                style: TextStyle(
                  color: isDarkMode ? Colors.white : Colors.black,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                color: isDarkMode ? Colors.grey[850] : Colors.white,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Generated content card',
                    style: TextStyle(
                      color: isDarkMode ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`;
  }

  private generateReactNativeCode(analysis: ImageAnalysisResult, options: GenerationOptions): string {
    const { colorPalette, typography } = analysis;
    
    return `import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Appearance,
  useColorScheme
} from 'react-native';

const GeneratedComponent = () => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    
    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '${colorPalette[0] || '#ffffff'}',
    text: isDarkMode ? '#ffffff' : '${colorPalette[1] || '#000000'}',
    accent: isDarkMode ? '#4dabf7' : '${colorPalette[2] || '#007bff'}',
    secondary: isDarkMode ? '#2d2d2d' : '${colorPalette[3] || '#f8f9fa'}',
    border: isDarkMode ? '#404040' : '${colorPalette[4] || '#ddd'}',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Theme Toggle Button */}
      <TouchableOpacity 
        style={[styles.themeToggle, { backgroundColor: theme.accent }]}
        onPress={toggleTheme}
      >
        <Text style={styles.themeToggleText}>
          {isDarkMode ? '🌞' : '🌙'}
        </Text>
      </TouchableOpacity>

      {/* Generated Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Generated UI
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Sample Button</Text>
        </TouchableOpacity>
        
        <View style={[styles.card, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Text style={[styles.cardText, { color: theme.text }]}>
            Generated content card
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeToggleText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingTop: 80,
  },
  title: {
    fontSize: ${typography.bodySize + 8 || 24},
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: ${typography.bodySize || 16},
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardText: {
    fontSize: ${typography.bodySize || 16},
    lineHeight: ${(typography.lineHeight || 1.5) * (typography.bodySize || 16)},
  },
});

export default GeneratedComponent;`;
  }

  private getBorderRadius(size: string): string {
    switch (size) {
      case 'none': return '0px';
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '16px';
      default: return '8px';
    }
  }

  private darkenColor(color: string): string {
    // Simple color darkening - in a real implementation, use a proper color library
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = -20;
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    return color;
  }
}