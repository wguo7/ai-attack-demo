// SUPER STRONG HOMOGLYPH ATTACK using homoglyph library - EXTREME VERSION
import { AttackConfig, AttackResult } from './config';

// Type definition for homoglyph library
type HomoglyphLib = {
  homoglyphs?: Record<string, string[]>;
  get?: (char: string) => string[] | undefined;
} | Record<string, string[]>;

let homoglyphLib: HomoglyphLib | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  homoglyphLib = require('homoglyph') as HomoglyphLib;
} catch {
  // Library will be loaded at runtime
}

export class HomoglyphAdvancedAttack {
  private static getReplacementRate(intensity: string): number {
    // MUCH MORE AGGRESSIVE - make it obvious
    const rates: { [key: string]: number } = {
      low: 0.6,        // 60% - very visible
      medium: 0.85,    // 85% - extremely obvious
      high: 0.95,      // 95% - almost every character
      evasion: 0.98    // 98% - maximum
    };
    return rates[intensity] || 0.85;
  }

  private static calculateEvasionScore(changes: number, originalLength: number): number {
    if (originalLength === 0) return 0;
    const changeRate = changes / originalLength;
    const baseScore = Math.min(100, changeRate * 120);
    return Math.round(baseScore);
  }

  private static calculateReadability(text: string): number {
    const visibleChars = text.replace(/[\u200B-\u200D\uFEFF]/g, '').length;
    const totalLength = text.length;
    const visibilityRatio = totalLength > 0 ? visibleChars / totalLength : 1;
    let score = Math.round(visibilityRatio * 100);
    const modificationDensity = (totalLength - visibleChars) / Math.max(1, totalLength);
    score -= Math.round(modificationDensity * 20);
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

  static async execute(text: string, config: AttackConfig): Promise<AttackResult> {
    const startTime = performance.now();
    let changes = 0;
    const techniquesUsed: string[] = [];
    
    // Load library if not already loaded
    if (!homoglyphLib) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        homoglyphLib = require('homoglyph') as HomoglyphLib;
      } catch {
        return this.fallbackAttack(text, config, startTime);
      }
    }

    const replacementRate = this.getReplacementRate(config.intensity);
    let result = text;

    try {
      let homoglyphs: Record<string, string[]> = {};
      
      // Try to use the homoglyph library
      if (typeof homoglyphLib === 'object' && homoglyphLib !== null) {
  // Check various possible API structures
  if ('homoglyphs' in homoglyphLib && homoglyphLib.homoglyphs && !Array.isArray(homoglyphLib.homoglyphs)) {
    homoglyphs = homoglyphLib.homoglyphs;
  } else if ('get' in homoglyphLib && typeof homoglyphLib.get === 'function') {
    // Library might work like a Map - cast it
    homoglyphs = homoglyphLib as unknown as Record<string, string[]>;
  } else if (!Array.isArray(homoglyphLib)) {
    // Try to use the entire object as mapping - only if it's not an array
    homoglyphs = homoglyphLib as Record<string, string[]>;
  }
}

      // If library didn't work, use fallback
      if (Object.keys(homoglyphs).length === 0 && !this.hasMapping(homoglyphs)) {
        return this.fallbackAttack(text, config, startTime);
      }

      // Apply homoglyph replacements - AGGRESSIVE
      result = text.split('').map(char => {
        if (config.maxModifications && changes >= config.maxModifications) {
          return char;
        }

        // Try to get replacement from library
let replacement: string | null = null;

// Check if it has a get method (Map-like)
if ('get' in homoglyphs && typeof (homoglyphs as unknown as { get: (char: string) => string[] | undefined }).get === 'function') {
  const obj = homoglyphs as unknown as { get: (char: string) => string[] | undefined };
  const replacements = obj.get(char);
  if (replacements && replacements.length > 0) {
    replacement = replacements[Math.floor(Math.random() * replacements.length)] ?? null;
  }
} else if (homoglyphs[char]) {
  // Object/dictionary structure
  const replacements = Array.isArray(homoglyphs[char]) 
    ? homoglyphs[char] 
    : [homoglyphs[char]];
  if (replacements.length > 0) {
    replacement = replacements[Math.floor(Math.random() * replacements.length)] ?? null;
  }
}

        // Apply replacement if found and random check passes
        if (replacement && replacement !== char && Math.random() < replacementRate) {
          changes++;
          if (!techniquesUsed.includes('homoglyph_substitution')) {
            techniquesUsed.push('homoglyph_substitution');
          }
          return replacement;
        }

        return char;
      }).join('');

    } catch (error) {
      console.warn('homoglyph library error, using fallback:', error);
      return this.fallbackAttack(text, config, startTime);
    }

    // If no changes were made, force use fallback
    if (changes === 0) {
      return this.fallbackAttack(text, config, startTime);
    }

    const processingTime = performance.now() - startTime;

    return {
      result,
      metrics: {
        evasionScore: this.calculateEvasionScore(changes, text.length),
        humanReadability: config.preserveReadability 
          ? this.calculateReadability(result)
          : this.calculateReadability(result) * 0.8,
        changesMade: changes,
        processingTime
      },
      techniquesUsed,
      detectionDifficulty: this.getDifficultyLevel(config.intensity),
      explanation: this.generateExplanation(result, text, changes)
    };
  }

  private static hasMapping(obj: unknown): boolean {
    if (!obj || typeof obj !== 'object') return false;
    const keys = Object.keys(obj);
    return keys.length > 0 && keys.some(key => /[a-zA-Z]/.test(key));
  }

  private static fallbackAttack(text: string, config: AttackConfig, startTime: number): AttackResult {
    // EXTREME fallback - very aggressive and obvious
    const replacementRate = this.getReplacementRate(config.intensity);
    const fallbackHomoglyphs: { [key: string]: string[] } = {
      // Lowercase - extensive mappings
      'a': ['а', 'α'],  // Cyrillic а, Greek α
      'e': ['е', 'ε'],  // Cyrillic е, Greek ε  
      'o': ['о', 'ο'],  // Cyrillic о, Greek ο
      'c': ['с', 'ϲ'],  // Cyrillic с, Greek ϲ
      'p': ['р', 'ρ'],  // Cyrillic р, Greek ρ
      'x': ['х', 'χ'],  // Cyrillic х, Greek χ
      'y': ['у'],       // Cyrillic у
      'i': ['і', 'ι'],  // Cyrillic і, Greek ι
      'n': ['п'],       // Cyrillic п (looks different but common)
      'r': ['г'],       // Cyrillic г
      'm': ['м', 'μ'],  // Cyrillic м, Greek μ
      // Uppercase
      'A': ['А', 'Α'],  // Cyrillic А, Greek Α
      'B': ['В'],       // Cyrillic В (identical!)
      'C': ['С', 'Ϲ'],  // Cyrillic С, Greek Ϲ
      'E': ['Е', 'Ε'],  // Cyrillic Е, Greek Ε
      'H': ['Н', 'Η'],  // Cyrillic Н, Greek Η
      'K': ['К', 'Κ'],  // Cyrillic К, Greek Κ
      'M': ['М', 'Μ'],  // Cyrillic М, Greek Μ
      'O': ['О', 'Ο'],  // Cyrillic О, Greek Ο
      'P': ['Р'],       // Cyrillic Р
      'T': ['Т', 'Τ'],  // Cyrillic Т, Greek Τ
      'X': ['Х', 'Χ'],  // Cyrillic Х, Greek Χ
      'Y': ['У', 'Υ'],  // Cyrillic У, Greek Υ
    };

    let changes = 0;
    const techniquesUsed: string[] = ['homoglyph_substitution_fallback'];
    
    // AGGRESSIVE replacement - apply to almost every character
    const result = text.split('').map(char => {
      if (config.maxModifications && changes >= config.maxModifications) {
        return char;
      }

      const replacements = fallbackHomoglyphs[char];
      if (replacements && replacements.length > 0 && Math.random() < replacementRate) {
        changes++;
        return replacements[Math.floor(Math.random() * replacements.length)];
      }
      return char;
    }).join('');

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
      explanation: this.generateExplanation(result, text, changes)
    };
  }

  private static generateExplanation(result: string, original: string, changes: number) {
    // Generate REAL examples by actually transforming sample text
    const examples: string[] = [
      `"hello" → "${this.transformExample('hello')}"`,
      `"paypal.com" → "${this.transformExample('paypal.com')}"`,
      `"microsoft" → "${this.transformExample('microsoft')}"`,
    ];

    return {
      description: `This attack replaces Latin characters with visually identical characters from different Unicode scripts (Cyrillic, Greek). ${changes} characters were replaced in your text.`,
      detectionTips: [
        'Use Unicode script detection to identify mixed scripts',
        'Normalize text to NFC/NFD before processing',
        'Implement confusables detection libraries',
        'Validate character set against expected scripts'
      ],
      examples,
      riskLevel: 'high' as const
    };
  }

  private static transformExample(text: string): string {
    const homoglyphs: { [key: string]: string[] } = {
      'a': ['а'], 'e': ['е'], 'o': ['о'], 'c': ['с'], 'p': ['р'],
      'x': ['х'], 'y': ['у'], 'A': ['А'], 'B': ['В'], 'C': ['С'],
      'E': ['Е'], 'H': ['Н'], 'K': ['К'], 'M': ['М'], 'O': ['О'],
      'P': ['Р'], 'T': ['Т'], 'X': ['Х'], 'Y': ['У']
    };

    return text.split('').map(char => {
      const replacements = homoglyphs[char];
      if (replacements && replacements.length > 0) {
        return replacements[0]; // Use first replacement for consistent examples
      }
      return char;
    }).join('');
  }
}
