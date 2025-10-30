// EXTREME Invisible Character Attack - SUPER AGGRESSIVE
import { AttackConfig, AttackResult } from './config';

export class InvisibleCharacterAdvancedAttack {
  private static getIntensityThreshold(intensity: string): number {
    const rates: { [key: string]: number } = {
      low: 0.4,        // 40% - very visible
      medium: 0.7,     // 70% - extremely obvious
      high: 0.9,       // 90% - almost everywhere
      evasion: 0.95    // 95% - maximum
    };
    return rates[intensity] || 0.7;
  }

  static async execute(text: string, config: AttackConfig): Promise<AttackResult> {
    const startTime = performance.now();
    let result = text;
    let changes = 0;
    const techniquesUsed: string[] = [];

    const threshold = this.getIntensityThreshold(config.intensity);

    // Zero-width characters
    const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    
    // Bidirectional override characters
    const bidiChars = {
      rlo: '\u202E', // Right-to-Left Override
      lro: '\u202D', // Left-to-Right Override
      pdf: '\u202C', // Pop Directional Formatting
      rlm: '\u200F', // Right-to-Left Mark
      lrm: '\u200E', // Left-to-Right Mark
    };

    // Combining diacritical marks
    const combiningMarks = [
      '\u0301', '\u0300', '\u0302', '\u0303', '\u0304', '\u0305',
      '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
    ];

    // 1. Zero-width space insertion - AGGRESSIVE
    result = result.split('').map((char, index) => {
      if (config.maxModifications && changes >= config.maxModifications) {
        return char;
      }

      // Insert after spaces
      if (char === ' ' && Math.random() < threshold) {
        changes++;
        if (!techniquesUsed.includes('Zero-Width Spaces')) {
          techniquesUsed.push('Zero-Width Spaces');
        }
        return char + zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
      }
      
      // Insert after characters (every 2nd-3rd character)
      if (char !== ' ' && /[a-zA-Z0-9]/.test(char) && index % 3 !== 0 && Math.random() < threshold * 0.6) {
        changes++;
        if (!techniquesUsed.includes('Zero-Width Joiners')) {
          techniquesUsed.push('Zero-Width Joiners');
        }
        return char + zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
      }
      return char;
    }).join('');

    // 2. Bidirectional override - SUPER AGGRESSIVE
    if (config.intensity === 'high' || config.intensity === 'evasion') {
      const words = result.split(/(\s+)/);
      result = words.map((word, index) => {
        if (word.trim().length > 2 && Math.random() < threshold * 0.5) {
          changes++;
          if (!techniquesUsed.includes('Bidirectional Override')) {
            techniquesUsed.push('Bidirectional Override');
          }
          // Wrap word with RLO and PDF to reverse it
          return bidiChars.rlo + word + bidiChars.pdf;
        }
        return word;
      }).join('');
    }

    // 3. Combining marks for invisible modifications
    if (config.intensity !== 'low') {
      result = result.split('').map(char => {
        if (config.maxModifications && changes >= config.maxModifications) {
          return char;
        }
        if (/[aeiouAEIOU]/.test(char) && Math.random() < threshold * 0.4) {
          changes++;
          if (!techniquesUsed.includes('Combining Diacritics')) {
            techniquesUsed.push('Combining Diacritics');
          }
          return char + combiningMarks[Math.floor(Math.random() * combiningMarks.length)];
        }
        return char;
      }).join('');
    }

    // 4. Unicode normalization breaking sequences
    if (config.intensity === 'evasion') {
      const breakingSequences = ['\u200B\u200C', '\u200C\u200D', '\uFEFF\u200B'];
      const words = result.split(' ');
      result = words.map((word, index) => {
        if (word.length > 3 && Math.random() < 0.3) {
          changes++;
          if (!techniquesUsed.includes('Normalization Breaking')) {
            techniquesUsed.push('Normalization Breaking');
          }
          return word + breakingSequences[Math.floor(Math.random() * breakingSequences.length)];
        }
        return word;
      }).join(' ');
    }

    const processingTime = performance.now() - startTime;

    return {
      result,
      metrics: {
        evasionScore: this.calculateEvasionScore(changes, text.length),
        humanReadability: this.calculateReadability(result),
        changesMade: changes,
        processingTime
      },
      techniquesUsed,
      detectionDifficulty: this.getDifficultyLevel(config.intensity),
      explanation: this.generateExplanation(changes)
    };
  }

  private static calculateEvasionScore(changes: number, originalLength: number): number {
    if (originalLength === 0) return 0;
    const changeRate = changes / originalLength;
    const baseScore = Math.min(100, changeRate * 130);
    return Math.round(baseScore);
  }

  private static calculateReadability(text: string): number {
    const visibleChars = text.replace(/[\u200B-\u200D\uFEFF]/g, '').length;
    const totalLength = text.length;
    const visibilityRatio = totalLength > 0 ? visibleChars / totalLength : 1;
    let score = Math.round(visibilityRatio * 100);
    const modificationDensity = (totalLength - visibleChars) / Math.max(1, totalLength);
    score -= Math.round(modificationDensity * 15);
    return Math.max(0, Math.min(100, score));
  }

  private static getDifficultyLevel(intensity: string): 'low' | 'medium' | 'high' | 'extreme' {
    const mapping: { [key: string]: 'low' | 'medium' | 'high' | 'extreme' } = {
      low: 'medium',
      medium: 'high',
      high: 'extreme',
      evasion: 'extreme'
    };
    return mapping[intensity] || 'high';
  }

  private static generateExplanation(changes: number) {
    // Generate REAL examples with actual Unicode characters
    const examples: string[] = [
      `"hello world" → "${this.transformExample('hello world', 'zwsp')}" (zero-width spaces)`,
      `"admin" → "${this.transformExample('admin', 'bidi')}" (bidirectional override)`,
      `"password" → "${this.transformExample('password', 'zwj')}" (zero-width joiners)`,
    ];

    return {
      description: `Inserted ${changes} invisible Unicode characters (zero-width spaces, bidirectional overrides, combining marks). These characters are invisible to humans but can break text processing systems.`,
      detectionTips: [
        'Strip all zero-width characters before processing',
        'Check string length vs visible character count',
        'Detect bidirectional control characters (U+202E, U+202D)',
        'Normalize all Unicode to NFC/NFD before analysis',
        'Use hex dump to inspect hidden characters'
      ],
      examples,
      riskLevel: 'high' as const
    };
  }

  private static transformExample(text: string, type: string): string {
    if (type === 'zwsp') {
      // Zero-width space example
      return text.split('').map((c, i) => {
        if (c === ' ') return c;
        if (i % 2 === 0 && c !== ' ') return c + '\u200B';
        return c;
      }).join('');
    } else if (type === 'bidi') {
      // Bidirectional override example - reverse the word
      return '\u202E' + text.split('').reverse().join('') + '\u202C';
    } else if (type === 'zwj') {
      // Zero-width joiner example
      return text.split('').join('\u200D');
    }
    return text;
  }
}

