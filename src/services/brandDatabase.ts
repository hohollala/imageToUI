import fs from 'fs-extra';
import path from 'path';

export interface BrandAssets {
  // 브랜드 기본 정보
  brand: {
    name: string;
    displayName: string;
    industry: string;
    country: string;
    website: string;
  };

  // 색상 시스템
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    gradients: Gradient[];
    darkMode?: ColorScheme;
  };

  // 타이포그래피 시스템
  typography: {
    fonts: {
      primary: BrandFont;
      secondary: BrandFont;
      monospace: BrandFont;
    };
    scale: TypeScale;
    weights: number[];
    lineHeights: number[];
    letterSpacing: number[];
  };

  // 레이아웃 시스템
  layout: {
    breakpoints: Breakpoint[];
    container: {
      maxWidth: number;
      padding: number;
    };
    grid: {
      columns: number;
      gutters: number;
    };
  };

  // 간격 시스템
  spacing: {
    baseUnit: number;
    scale: number[];
    sections: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };

  // 형태학 시스템
  shapes: {
    borderRadius: {
      none: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      full: number;
    };
    borders: {
      width: number[];
      style: string[];
    };
  };

  // 그림자 시스템
  shadows: {
    elevation: BoxShadow[];
    colored: BoxShadow[];
    inset: BoxShadow[];
  };

  // 애니메이션 시스템
  animations: {
    durations: {
      fast: number;
      normal: number;
      slow: number;
    };
    easings: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
    transitions: BrandTransition[];
  };

  // 컴포넌트 스타일
  components: {
    buttons: ButtonVariant[];
    inputs: InputVariant[];
    cards: CardVariant[];
    navigation: NavigationStyle;
  };

  // 아이콘 시스템
  icons: {
    style: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
    library: string;
    customIcons: CustomIcon[];
    sizes: number[];
  };

  // 브랜드별 특수 요소
  unique: {
    patterns: BrandPattern[];
    illustrations: IllustrationStyle;
    logoUsage: LogoGuideline;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface Gradient {
  name: string;
  colors: string[];
  direction: 'to-right' | 'to-bottom' | 'to-bottom-right' | string;
  stops?: number[];
}

export interface BrandFont {
  family: string;
  weights: number[];
  formats: string[];
  fallback: string[];
  webfontUrl?: string;
  localFiles?: string[];
}

export interface TypeScale {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export interface Breakpoint {
  name: string;
  min: number;
  max?: number;
}

export interface BoxShadow {
  name: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset?: boolean;
}

export interface BrandTransition {
  name: string;
  property: string;
  duration: number;
  timing: string;
  delay?: number;
}

export interface ButtonVariant {
  name: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  styles: {
    background: string;
    color: string;
    border: string;
    borderRadius: number;
    padding: { x: number; y: number };
    fontSize: number;
    fontWeight: number;
    hover: Partial<ButtonStyles>;
    active: Partial<ButtonStyles>;
    disabled: Partial<ButtonStyles>;
  };
}

export interface InputVariant {
  name: 'default' | 'filled' | 'outline' | 'underline';
  styles: {
    background: string;
    border: string;
    borderRadius: number;
    padding: { x: number; y: number };
    fontSize: number;
    placeholderColor: string;
    focusRing: string;
  };
}

export interface CardVariant {
  name: 'default' | 'elevated' | 'outline' | 'filled';
  styles: {
    background: string;
    border: string;
    borderRadius: number;
    padding: number;
    shadow: string;
  };
}

export interface NavigationStyle {
  type: 'tabs' | 'pills' | 'underline' | 'sidebar';
  activeIndicator: {
    type: 'background' | 'border' | 'underline';
    color: string;
    thickness?: number;
  };
}

export interface CustomIcon {
  name: string;
  svg: string;
  category: string;
}

export interface BrandPattern {
  name: string;
  type: 'geometric' | 'organic' | 'minimal' | 'decorative';
  svg: string;
  usage: string[];
}

export interface IllustrationStyle {
  style: 'flat' | 'outlined' | '3d' | 'hand-drawn';
  colorPalette: string[];
  strokeWidth?: number;
}

export interface LogoGuideline {
  minSize: number;
  clearSpace: number;
  variations: LogoVariation[];
  usage: {
    primary: string;
    secondary: string[];
    restrictions: string[];
  };
}

export interface LogoVariation {
  name: string;
  file: string;
  usage: string;
}

interface ButtonStyles {
  background: string;
  color: string;
  border: string;
  transform: string;
  boxShadow: string;
}

export class BrandDatabase {
  private brands: Map<string, BrandAssets> = new Map();
  private brandKeywords: Map<string, string[]> = new Map();
  private brandPatterns: Map<string, RegExp[]> = new Map();

  constructor() {
    this.initializeBrands();
    this.setupBrandDetection();
  }

  private initializeBrands() {
    // 토스 브랜드 자산
    this.brands.set('toss', {
      brand: {
        name: 'toss',
        displayName: 'Toss',
        industry: 'Fintech',
        country: 'South Korea',
        website: 'https://toss.im'
      },
      colors: {
        primary: '#0064FF',
        secondary: '#F5F7FA',
        accent: '#FF6B35',
        neutral: ['#1A1A1A', '#333333', '#666666', '#999999', '#CCCCCC', '#F0F0F0', '#FFFFFF'],
        semantic: {
          success: '#00C896',
          warning: '#FFB800',
          error: '#FF5722',
          info: '#2196F3'
        },
        gradients: [
          {
            name: 'primary',
            colors: ['#0064FF', '#4A90E2'],
            direction: 'to-bottom-right'
          },
          {
            name: 'accent',
            colors: ['#FF6B35', '#FF8C42'],
            direction: 'to-right'
          }
        ],
        darkMode: {
          primary: '#4A90E2',
          secondary: '#1A1D23',
          accent: '#FF8C42',
          background: '#0D0E0F',
          surface: '#1A1D23',
          text: '#FFFFFF',
          textSecondary: '#B0B8C1',
          border: '#2A2D31'
        }
      },
      typography: {
        fonts: {
          primary: {
            family: 'Toss Face',
            weights: [300, 400, 500, 600, 700],
            formats: ['woff2', 'woff'],
            fallback: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            webfontUrl: 'https://static.toss.im/fonts/TossFace.woff2'
          },
          secondary: {
            family: 'SF Pro Display',
            weights: [400, 500, 600],
            formats: ['woff2'],
            fallback: ['system-ui', '-apple-system', 'sans-serif']
          },
          monospace: {
            family: 'SF Mono',
            weights: [400, 500],
            formats: ['woff2'],
            fallback: ['Monaco', '"Cascadia Code"', '"Roboto Mono"', 'Consolas', 'monospace']
          }
        },
        scale: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36,
          '5xl': 48
        },
        weights: [300, 400, 500, 600, 700],
        lineHeights: [1.2, 1.4, 1.5, 1.6],
        letterSpacing: [-0.02, -0.01, 0, 0.01, 0.02]
      },
      layout: {
        breakpoints: [
          { name: 'sm', min: 640 },
          { name: 'md', min: 768 },
          { name: 'lg', min: 1024 },
          { name: 'xl', min: 1280 },
          { name: '2xl', min: 1536 }
        ],
        container: {
          maxWidth: 1200,
          padding: 24
        },
        grid: {
          columns: 12,
          gutters: 24
        }
      },
      spacing: {
        baseUnit: 4,
        scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96],
        sections: {
          xs: 16,
          sm: 24,
          md: 32,
          lg: 48,
          xl: 64
        }
      },
      shapes: {
        borderRadius: {
          none: 0,
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
          full: 9999
        },
        borders: {
          width: [1, 2],
          style: ['solid', 'dashed']
        }
      },
      shadows: {
        elevation: [
          { name: 'sm', x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.12)' },
          { name: 'md', x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)' },
          { name: 'lg', x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)' },
          { name: 'xl', x: 0, y: 25, blur: 50, spread: -12, color: 'rgba(0, 0, 0, 0.25)' }
        ],
        colored: [
          { name: 'primary', x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0, 100, 255, 0.3)' },
          { name: 'accent', x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(255, 107, 53, 0.3)' }
        ],
        inset: [
          { name: 'default', x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)', inset: true }
        ]
      },
      animations: {
        durations: {
          fast: 150,
          normal: 300,
          slow: 500
        },
        easings: {
          linear: 'linear',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        transitions: [
          { name: 'all', property: 'all', duration: 300, timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          { name: 'colors', property: 'background-color, border-color, color', duration: 200, timing: 'ease-in-out' },
          { name: 'transform', property: 'transform', duration: 300, timing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        ]
      },
      components: {
        buttons: [
          {
            name: 'primary',
            styles: {
              background: '#0064FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              padding: { x: 24, y: 16 },
              fontSize: 16,
              fontWeight: 600,
              hover: {
                background: '#0056D6',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 100, 255, 0.4)'
              },
              active: {
                transform: 'translateY(0)',
                boxShadow: '0 2px 4px rgba(0, 100, 255, 0.3)'
              },
              disabled: {
                background: '#CCCCCC',
                color: '#666666'
              }
            }
          },
          {
            name: 'secondary',
            styles: {
              background: 'transparent',
              color: '#0064FF',
              border: '2px solid #0064FF',
              borderRadius: 12,
              padding: { x: 22, y: 14 },
              fontSize: 16,
              fontWeight: 600,
              hover: {
                background: '#0064FF',
                color: '#FFFFFF'
              },
              active: {
                background: '#0056D6'
              },
              disabled: {
                border: '2px solid #CCCCCC',
                color: '#666666'
              }
            }
          }
        ],
        inputs: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #E1E8ED',
              borderRadius: 8,
              padding: { x: 16, y: 12 },
              fontSize: 16,
              placeholderColor: '#8B95A1',
              focusRing: '0 0 0 3px rgba(0, 100, 255, 0.1)'
            }
          }
        ],
        cards: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #F0F3F6',
              borderRadius: 16,
              padding: 24,
              shadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }
          }
        ],
        navigation: {
          type: 'underline',
          activeIndicator: {
            type: 'underline',
            color: '#0064FF',
            thickness: 2
          }
        }
      },
      icons: {
        style: 'outlined',
        library: 'heroicons',
        customIcons: [
          {
            name: 'toss-logo',
            svg: '<svg viewBox="0 0 24 24">...</svg>',
            category: 'brand'
          }
        ],
        sizes: [16, 20, 24, 32, 48]
      },
      unique: {
        patterns: [
          {
            name: 'dots',
            type: 'geometric',
            svg: '<pattern id="dots">...</pattern>',
            usage: ['background', 'decoration']
          }
        ],
        illustrations: {
          style: 'outlined',
          colorPalette: ['#0064FF', '#FF6B35', '#00C896', '#1A1A1A'],
          strokeWidth: 2
        },
        logoUsage: {
          minSize: 24,
          clearSpace: 16,
          variations: [
            {
              name: 'primary',
              file: 'toss-logo.svg',
              usage: 'Main logo for light backgrounds'
            },
            {
              name: 'white',
              file: 'toss-logo-white.svg',
              usage: 'Logo for dark backgrounds'
            }
          ],
          usage: {
            primary: 'toss-logo.svg',
            secondary: ['toss-logo-mono.svg'],
            restrictions: ['Do not stretch', 'Do not change colors', 'Maintain minimum size']
          }
        }
      }
    });

    // 카카오 브랜드 자산
    this.brands.set('kakao', {
      brand: {
        name: 'kakao',
        displayName: 'Kakao',
        industry: 'Technology',
        country: 'South Korea',
        website: 'https://www.kakaocorp.com'
      },
      colors: {
        primary: '#FEE500',
        secondary: '#191919',
        accent: '#FF6B35',
        neutral: ['#000000', '#191919', '#333333', '#666666', '#999999', '#CCCCCC', '#F5F5F5', '#FFFFFF'],
        semantic: {
          success: '#00C73C',
          warning: '#FF8A00',
          error: '#E53935',
          info: '#1976D2'
        },
        gradients: [
          {
            name: 'kakao',
            colors: ['#FEE500', '#FFD700'],
            direction: 'to-bottom'
          }
        ],
        darkMode: {
          primary: '#FEE500',
          secondary: '#191919',
          accent: '#FF8A65',
          background: '#000000',
          surface: '#191919',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
          border: '#333333'
        }
      },
      typography: {
        fonts: {
          primary: {
            family: 'KakaoRegular',
            weights: [400, 500, 700],
            formats: ['woff2', 'woff'],
            fallback: ['-apple-system', 'BlinkMacSystemFont', '"Malgun Gothic"', 'sans-serif']
          },
          secondary: {
            family: 'AppleSDGothicNeo',
            weights: [400, 500, 600],
            formats: ['woff2'],
            fallback: ['system-ui', 'sans-serif']
          },
          monospace: {
            family: 'D2Coding',
            weights: [400],
            formats: ['woff2'],
            fallback: ['Monaco', 'monospace']
          }
        },
        scale: {
          xs: 11,
          sm: 13,
          base: 15,
          lg: 17,
          xl: 19,
          '2xl': 22,
          '3xl': 28,
          '4xl': 34,
          '5xl': 44
        },
        weights: [400, 500, 700],
        lineHeights: [1.3, 1.4, 1.5, 1.6],
        letterSpacing: [-0.01, 0, 0.01]
      },
      layout: {
        breakpoints: [
          { name: 'mobile', min: 320 },
          { name: 'tablet', min: 768 },
          { name: 'desktop', min: 1024 }
        ],
        container: {
          maxWidth: 1024,
          padding: 20
        },
        grid: {
          columns: 8,
          gutters: 20
        }
      },
      spacing: {
        baseUnit: 4,
        scale: [4, 8, 12, 16, 20, 24, 28, 32, 40, 48],
        sections: {
          xs: 12,
          sm: 20,
          md: 28,
          lg: 40,
          xl: 56
        }
      },
      shapes: {
        borderRadius: {
          none: 0,
          sm: 2,
          md: 6,
          lg: 10,
          xl: 14,
          full: 9999
        },
        borders: {
          width: [1],
          style: ['solid']
        }
      },
      shadows: {
        elevation: [
          { name: 'sm', x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
          { name: 'md', x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.12)' },
          { name: 'lg', x: 0, y: 8, blur: 16, spread: 0, color: 'rgba(0, 0, 0, 0.15)' }
        ],
        colored: [
          { name: 'yellow', x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(254, 229, 0, 0.3)' }
        ],
        inset: []
      },
      animations: {
        durations: {
          fast: 200,
          normal: 400,
          slow: 600
        },
        easings: {
          linear: 'linear',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out'
        },
        transitions: [
          { name: 'smooth', property: 'all', duration: 400, timing: 'ease-in-out' }
        ]
      },
      components: {
        buttons: [
          {
            name: 'primary',
            styles: {
              background: '#FEE500',
              color: '#191919',
              border: 'none',
              borderRadius: 6,
              padding: { x: 20, y: 12 },
              fontSize: 15,
              fontWeight: 500,
              hover: {
                background: '#E8CE00'
              },
              active: {
                background: '#D4B800'
              },
              disabled: {
                background: '#F5F5F5',
                color: '#999999'
              }
            }
          }
        ],
        inputs: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #DDDDDD',
              borderRadius: 4,
              padding: { x: 14, y: 10 },
              fontSize: 15,
              placeholderColor: '#999999',
              focusRing: '0 0 0 2px rgba(254, 229, 0, 0.5)'
            }
          }
        ],
        cards: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #F0F0F0',
              borderRadius: 8,
              padding: 20,
              shadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }
          }
        ],
        navigation: {
          type: 'tabs',
          activeIndicator: {
            type: 'background',
            color: '#FEE500'
          }
        }
      },
      icons: {
        style: 'filled',
        library: 'kakao-icons',
        customIcons: [],
        sizes: [14, 18, 22, 28, 36]
      },
      unique: {
        patterns: [],
        illustrations: {
          style: 'flat',
          colorPalette: ['#FEE500', '#191919', '#FF6B35']
        },
        logoUsage: {
          minSize: 20,
          clearSpace: 12,
          variations: [],
          usage: {
            primary: 'kakao-logo.svg',
            secondary: [],
            restrictions: ['Do not modify the yellow color']
          }
        }
      }
    });

    // 네이버 브랜드 자산
    this.brands.set('naver', {
      brand: {
        name: 'naver',
        displayName: 'NAVER',
        industry: 'Technology',
        country: 'South Korea',
        website: 'https://www.navercorp.com'
      },
      colors: {
        primary: '#03C75A',
        secondary: '#F7F9FA',
        accent: '#1EC800',
        neutral: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#F2F2F2', '#FFFFFF'],
        semantic: {
          success: '#03C75A',
          warning: '#FF6D00',
          error: '#E53935',
          info: '#0277BD'
        },
        gradients: [
          {
            name: 'naver',
            colors: ['#03C75A', '#1EC800'],
            direction: 'to-right'
          }
        ]
      },
      typography: {
        fonts: {
          primary: {
            family: 'Noto Sans KR',
            weights: [400, 500, 700],
            formats: ['woff2'],
            fallback: ['"Malgun Gothic"', '"Apple SD Gothic Neo"', 'sans-serif']
          },
          secondary: {
            family: 'Noto Sans',
            weights: [400, 500, 600],
            formats: ['woff2'],
            fallback: ['system-ui', 'sans-serif']
          },
          monospace: {
            family: 'Source Code Pro',
            weights: [400, 500],
            formats: ['woff2'],
            fallback: ['Monaco', 'monospace']
          }
        },
        scale: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 32,
          '4xl': 40,
          '5xl': 56
        },
        weights: [400, 500, 700],
        lineHeights: [1.4, 1.5, 1.6, 1.7],
        letterSpacing: [-0.01, 0, 0.01]
      },
      layout: {
        breakpoints: [
          { name: 'sm', min: 576 },
          { name: 'md', min: 768 },
          { name: 'lg', min: 992 },
          { name: 'xl', min: 1200 }
        ],
        container: {
          maxWidth: 1140,
          padding: 16
        },
        grid: {
          columns: 12,
          gutters: 16
        }
      },
      spacing: {
        baseUnit: 4,
        scale: [4, 8, 16, 24, 32, 48, 64],
        sections: {
          xs: 16,
          sm: 24,
          md: 32,
          lg: 48,
          xl: 64
        }
      },
      shapes: {
        borderRadius: {
          none: 0,
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
          full: 50
        },
        borders: {
          width: [1, 2],
          style: ['solid']
        }
      },
      shadows: {
        elevation: [
          { name: 'sm', x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
          { name: 'md', x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)' },
          { name: 'lg', x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)' }
        ],
        colored: [
          { name: 'green', x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(3, 199, 90, 0.25)' }
        ],
        inset: []
      },
      animations: {
        durations: {
          fast: 150,
          normal: 300,
          slow: 450
        },
        easings: {
          linear: 'linear',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        transitions: [
          { name: 'default', property: 'all', duration: 300, timing: 'ease' }
        ]
      },
      components: {
        buttons: [
          {
            name: 'primary',
            styles: {
              background: '#03C75A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              padding: { x: 16, y: 8 },
              fontSize: 14,
              fontWeight: 500,
              hover: {
                background: '#02B351'
              },
              active: {
                background: '#029F48'
              },
              disabled: {
                background: '#CCCCCC',
                color: '#666666'
              }
            }
          }
        ],
        inputs: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #DADCE0',
              borderRadius: 4,
              padding: { x: 12, y: 8 },
              fontSize: 14,
              placeholderColor: '#9AA0A6',
              focusRing: '0 0 0 2px rgba(3, 199, 90, 0.2)'
            }
          }
        ],
        cards: [
          {
            name: 'default',
            styles: {
              background: '#FFFFFF',
              border: '1px solid #E8EAED',
              borderRadius: 8,
              padding: 16,
              shadow: '0 1px 3px rgba(60, 64, 67, 0.3)'
            }
          }
        ],
        navigation: {
          type: 'underline',
          activeIndicator: {
            type: 'underline',
            color: '#03C75A',
            thickness: 2
          }
        }
      },
      icons: {
        style: 'outlined',
        library: 'material-icons',
        customIcons: [],
        sizes: [16, 20, 24, 32, 40]
      },
      unique: {
        patterns: [],
        illustrations: {
          style: 'outlined',
          colorPalette: ['#03C75A', '#1EC800', '#333333']
        },
        logoUsage: {
          minSize: 24,
          clearSpace: 16,
          variations: [],
          usage: {
            primary: 'naver-logo.svg',
            secondary: [],
            restrictions: ['Maintain green color identity']
          }
        }
      }
    });

    // 더 많은 브랜드들을 계속 추가할 수 있음...
  }

  private setupBrandDetection() {
    // 브랜드별 키워드 설정
    this.brandKeywords.set('toss', [
      'toss', '토스', 'viva republica', '비바리퍼블리카',
      '송금', '간편결제', '토스페이', 'toss pay',
      '투자', '증권', '주식', 'stock', 'securities'
    ]);

    this.brandKeywords.set('kakao', [
      'kakao', '카카오', 'kakaobank', '카카오뱅크',
      'kakaotalk', '카카오톡', 'kakaopay', '카카오페이'
    ]);

    this.brandKeywords.set('naver', [
      'naver', '네이버', 'line', '라인',
      'naver pay', '네이버페이', 'webtoon', '웹툰'
    ]);

    // 브랜드별 정규 표현식 패턴
    this.brandPatterns.set('toss', [
      /toss/gi,
      /토스/g,
      /viva.?republica/gi,
      /#0064ff/gi, // 토스 브랜드 컬러
      /toss.?face/gi // 토스 폰트
    ]);

    this.brandPatterns.set('kakao', [
      /kakao/gi,
      /카카오/g,
      /#fee500/gi, // 카카오 브랜드 컬러
      /kakaoregular/gi
    ]);

    this.brandPatterns.set('naver', [
      /naver/gi,
      /네이버/g,
      /#03c75a/gi, // 네이버 브랜드 컬러
      /noto.?sans/gi
    ]);
  }

  // 브랜드 감지 메서드
  detectBrand(text: string, colorPalette: string[] = []): { brand: string | null; confidence: number } {
    const scores: Map<string, number> = new Map();
    
    // 각 브랜드에 대해 점수 계산
    for (const [brandName, keywords] of this.brandKeywords) {
      let score = 0;
      
      // 키워드 매칭
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length * 10;
        }
      });
      
      // 정규표현식 패턴 매칭
      const patterns = this.brandPatterns.get(brandName) || [];
      patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length * 15;
        }
      });
      
      // 색상 팔레트 매칭
      if (colorPalette.length > 0) {
        const brandAssets = this.brands.get(brandName);
        if (brandAssets) {
          const brandColors = [
            brandAssets.colors.primary.toLowerCase(),
            brandAssets.colors.secondary.toLowerCase(),
            brandAssets.colors.accent.toLowerCase()
          ];
          
          colorPalette.forEach(color => {
            if (brandColors.includes(color.toLowerCase())) {
              score += 25;
            }
          });
        }
      }
      
      if (score > 0) {
        scores.set(brandName, score);
      }
    }
    
    // 가장 높은 점수의 브랜드 선택
    if (scores.size === 0) {
      return { brand: null, confidence: 0 };
    }
    
    const sortedScores = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const topBrand = sortedScores[0];
    const maxScore = 100; // 최대 예상 점수
    const confidence = Math.min(topBrand[1] / maxScore, 1);
    
    return {
      brand: confidence > 0.3 ? topBrand[0] : null,
      confidence
    };
  }

  // 브랜드 자산 가져오기
  getBrandAssets(brandName: string): BrandAssets | null {
    return this.brands.get(brandName.toLowerCase()) || null;
  }

  // 모든 브랜드 목록
  getAllBrands(): string[] {
    return Array.from(this.brands.keys());
  }

  // 브랜드별 색상 팔레트 가져오기
  getBrandColors(brandName: string): string[] {
    const brand = this.brands.get(brandName.toLowerCase());
    if (!brand) return [];
    
    return [
      brand.colors.primary,
      brand.colors.secondary,
      brand.colors.accent,
      ...brand.colors.neutral,
      ...Object.values(brand.colors.semantic)
    ];
  }

  // 새 브랜드 추가
  addBrand(brandName: string, assets: BrandAssets) {
    this.brands.set(brandName.toLowerCase(), assets);
  }

  // 브랜드 자산 업데이트
  updateBrand(brandName: string, updates: Partial<BrandAssets>) {
    const existing = this.brands.get(brandName.toLowerCase());
    if (existing) {
      this.brands.set(brandName.toLowerCase(), { ...existing, ...updates });
    }
  }

  // 브랜드 데이터베이스를 파일로 저장
  async saveToFile(filePath: string) {
    const data = {
      brands: Object.fromEntries(this.brands),
      keywords: Object.fromEntries(this.brandKeywords),
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeJSON(filePath, data, { spaces: 2 });
  }

  // 파일에서 브랜드 데이터베이스 로드
  async loadFromFile(filePath: string) {
    try {
      const data = await fs.readJSON(filePath);
      
      if (data.brands) {
        this.brands = new Map(Object.entries(data.brands));
      }
      
      if (data.keywords) {
        this.brandKeywords = new Map(Object.entries(data.keywords));
      }
      
      console.log('브랜드 데이터베이스 로드 완료');
    } catch (error) {
      console.warn('브랜드 데이터베이스 파일 로드 실패, 기본 데이터 사용');
    }
  }
}