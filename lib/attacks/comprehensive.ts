// Comprehensive Attack System - Character, Word, and Sentence Level
import { AttackConfig, AttackResult } from './config';
import { HomoglyphAdvancedAttack } from './homoglyph-advanced';

export class ComprehensiveAttackEngine {
  // CHARACTER-LEVEL ATTACKS
  static async executeCharacterLevel(
    text: string, 
    config: AttackConfig
  ): Promise<AttackResult> {
    let result = text;
    let totalChanges = 0;
    const techniquesUsed: string[] = [];
    const startTime = performance.now();

    // 1. Homoglyph substitution (primary attack)
    if (config.techniques.includes('homoglyph') || config.techniques.length === 0) {
      const homoglyphResult = await HomoglyphAdvancedAttack.execute(result, config);
      result = homoglyphResult.result;
      totalChanges += homoglyphResult.metrics.changesMade;
      techniquesUsed.push(...homoglyphResult.techniquesUsed);
    }

    // 2. Invisible character insertion
    if (config.techniques.includes('invisible') || config.techniques.length === 0) {
      const invisibleResult = this.insertInvisibleChars(result, config);
      result = invisibleResult.result;
      totalChanges += invisibleResult.changes;
      if (!techniquesUsed.includes('invisible_characters')) {
        techniquesUsed.push('invisible_characters');
      }
    }

    // 3. Unicode normalization attacks
    if (config.techniques.includes('normalization') || config.techniques.length === 0) {
      const normResult = this.unicodeNormalizationAttack(result, config);
      result = normResult.result;
      totalChanges += normResult.changes;
      if (!techniquesUsed.includes('unicode_normalization')) {
        techniquesUsed.push('unicode_normalization');
      }
    }

    // 4. Bidirectional text manipulation
    if (config.techniques.includes('bidi') && config.intensity === 'evasion') {
      const bidiResult = this.bidirectionalAttack(result, config);
      result = bidiResult.result;
      totalChanges += bidiResult.changes;
      if (!techniquesUsed.includes('bidirectional')) {
        techniquesUsed.push('bidirectional');
      }
    }

    const processingTime = performance.now() - startTime;

    return {
      result,
      metrics: {
        evasionScore: this.calculateEvasionScore(totalChanges, text.length, config.intensity),
        humanReadability: this.calculateReadability(result, config),
        changesMade: totalChanges,
        processingTime
      },
      techniquesUsed,
      detectionDifficulty: this.getDifficultyLevel(config.intensity),
      explanation: this.generateExplanation('character', result, text, totalChanges, techniquesUsed)
    };
  }

  // WORD-LEVEL ATTACKS
  static async executeWordLevel(
    text: string,
    config: AttackConfig
  ): Promise<AttackResult> {
    let result = text;
    let totalChanges = 0;
    const techniquesUsed: string[] = [];
    const startTime = performance.now();

    // 1. Synonym replacement
    if (config.techniques.includes('synonym') || config.techniques.length === 0) {
      const synonymResult = this.synonymReplacement(result, config);
      result = synonymResult.result;
      totalChanges += synonymResult.changes;
      if (!techniquesUsed.includes('synonym_replacement')) {
        techniquesUsed.push('synonym_replacement');
      }
    }

    // 2. Common misspellings and typos
    if (config.techniques.includes('typo') || config.techniques.length === 0) {
      const typoResult = this.typoGeneration(result, config);
      result = typoResult.result;
      totalChanges += typoResult.changes;
      if (!techniquesUsed.includes('typo_generation')) {
        techniquesUsed.push('typo_generation');
      }
    }

    // 3. Case variation attacks
    if (config.techniques.includes('case') && config.intensity === 'high') {
      const caseResult = this.caseVariation(result, config);
      result = caseResult.result;
      totalChanges += caseResult.changes;
      if (!techniquesUsed.includes('case_variation')) {
        techniquesUsed.push('case_variation');
      }
    }

    const processingTime = performance.now() - startTime;

    return {
      result,
      metrics: {
        evasionScore: this.calculateEvasionScore(totalChanges, text.length, config.intensity),
        humanReadability: this.calculateReadability(result, config),
        changesMade: totalChanges,
        processingTime
      },
      techniquesUsed,
      detectionDifficulty: this.getDifficultyLevel(config.intensity),
      explanation: this.generateExplanation('word', result, text, totalChanges, techniquesUsed)
    };
  }

  // SENTENCE-LEVEL ATTACKS
  static async executeSentenceLevel(
    text: string,
    config: AttackConfig
  ): Promise<AttackResult> {
    let result = text;
    let totalChanges = 0;
    const techniquesUsed: string[] = [];
    const startTime = performance.now();

    // 1. Word order randomization (apply based on intensity, not just evasion)
    if (config.techniques.includes('word_order') || config.techniques.length === 0) {
      if (config.intensity === 'high' || config.intensity === 'evasion') {
        const orderResult = this.wordOrderRandomization(result, config);
        result = orderResult.result;
        totalChanges += orderResult.changes;
        if (!techniquesUsed.includes('word_order')) {
          techniquesUsed.push('word_order');
        }
      }
    }

    // 2. Punctuation manipulation (apply more aggressively)
    if (config.techniques.includes('punctuation') || config.techniques.length === 0) {
      const punctResult = this.punctuationManipulation(result, config);
      result = punctResult.result;
      totalChanges += punctResult.changes;
      if (!techniquesUsed.includes('punctuation')) {
        techniquesUsed.push('punctuation');
      }
    }

    // 3. Whitespace variation (apply more aggressively)
    if (config.techniques.includes('whitespace') || config.techniques.length === 0) {
      const wsResult = this.whitespaceVariation(result, config);
      result = wsResult.result;
      totalChanges += wsResult.changes;
      if (!techniquesUsed.includes('whitespace')) {
        techniquesUsed.push('whitespace');
      }
    }

    const processingTime = performance.now() - startTime;

    return {
      result,
      metrics: {
        evasionScore: this.calculateEvasionScore(totalChanges, text.length, config.intensity),
        humanReadability: this.calculateReadability(result, config),
        changesMade: totalChanges,
        processingTime
      },
      techniquesUsed,
      detectionDifficulty: this.getDifficultyLevel(config.intensity),
      explanation: this.generateExplanation('sentence', result, text, totalChanges, techniquesUsed)
    };
  }

  private static generateExplanation(
    level: string,
    result: string,
    original: string,
    changes: number,
    techniques: string[]
  ) {
    const examples: string[] = [];
    
    if (level === 'character') {
      examples.push(
        `"hello world" → "${this.applyCharacterAttack('hello world')}"`,
        `"paypal.com" → "${this.applyCharacterAttack('paypal.com')}"`,
        `"test string" → "${this.applyCharacterAttack('test string')}"`
      );
    } else if (level === 'word') {
      examples.push(
        `"This is good" → "${this.applyWordAttack('This is good')}"`,
        `"Very important" → "${this.applyWordAttack('Very important')}"`,
        `"The quick fox" → "${this.applyWordAttack('The quick fox')}"`
      );
    } else {
      examples.push(
        `"Hello world!" → "${result.substring(0, 20)}..."`,
        `${changes} modifications applied using: ${techniques.join(', ')}`
      );
    }

    return {
      description: `${changes} modifications were applied using ${level}-level attack techniques. ${techniques.join(', ')} were used to transform your text.`,
      detectionTips: [
        'Use Unicode normalization before processing',
        'Implement script detection for mixed scripts',
        'Strip zero-width characters',
        'Use semantic analysis instead of keyword matching'
      ],
      examples,
      riskLevel: 'high' as const
    };
  }

  private static applyCharacterAttack(text: string): string {
    const map: { [key: string]: string } = {
      'a': 'а', 'e': 'е', 'o': 'о', 'c': 'с', 'p': 'р',
      'A': 'А', 'E': 'Е', 'O': 'О', 'C': 'С'
    };
    // Apply homoglyphs AND invisible chars to make it obvious
    let result = text.split('').map((c, i) => {
      if (map[c] && i % 2 === 0) return map[c];
      return c;
    }).join('');
    // Add zero-width space every 3rd character
    result = result.split('').map((c, i) => {
      if (i % 3 === 0 && c !== ' ') return c + '\u200B';
      return c;
    }).join('');
    return result;
  }

  private static applyWordAttack(text: string): string {
    const synonyms: { [key: string]: string } = {
      'good': 'excellent', 'important': 'crucial', 'is': 'appears to be',
      'very': 'extremely', 'quick': 'rapid'
    };
    return text.split(' ').map(w => {
      const lower = w.toLowerCase().replace(/[.,!?]/g, '');
      return synonyms[lower] ? w.replace(lower, synonyms[lower]) : w;
    }).join(' ');
  }

  // Helper methods for individual attacks
  private static insertInvisibleChars(text: string, config: AttackConfig): { result: string; changes: number } {
    const invisibleChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    const rate = config.intensity === 'evasion' ? 0.3 : config.intensity === 'high' ? 0.2 : 0.1;
    let changes = 0;

    const result = text.split('').map(char => {
      if (Math.random() < rate && char === ' ') {
        changes++;
        return char + invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
      }
      return char;
    }).join('');

    return { result, changes };
  }

  private static unicodeNormalizationAttack(text: string, config: AttackConfig): { result: string; changes: number } {
    const combiningChars = ['\u0301', '\u0300', '\u0302', '\u0308'];
    const rate = config.intensity === 'evasion' ? 0.2 : 0.1;
    let changes = 0;

    const result = text.split('').map(char => {
      if (/[aeiouAEIOU]/.test(char) && Math.random() < rate) {
        changes++;
        return char + combiningChars[Math.floor(Math.random() * combiningChars.length)];
      }
      return char;
    }).join('');

    return { result, changes };
  }

  private static bidirectionalAttack(text: string, config: AttackConfig): { result: string; changes: number } {
    const bidiChars = ['\u202E', '\u202D', '\u200F'];
    const words = text.split(' ');
    let changes = 0;

    const result = words.map((word, index) => {
      if (index % 3 === 0 && Math.random() < 0.3) {
        changes++;
        return bidiChars[0] + word + bidiChars[1];
      }
      return word;
    }).join(' ');

    return { result, changes };
  }

  private static synonymReplacement(text: string, config: AttackConfig): { result: string; changes: number } {
    const synonymMap: { [key: string]: string[] } = {
      'good': ['great', 'excellent', 'fine', 'superb', 'outstanding', 'wonderful'],
      'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful', 'atrocious'],
      'big': ['large', 'huge', 'massive', 'enormous', 'gigantic', 'immense'],
      'small': ['tiny', 'little', 'mini', 'miniature', 'compact', 'petite'],
      'fast': ['quick', 'rapid', 'swift', 'speedy', 'brisk', 'hurried'],
      'important': ['significant', 'crucial', 'vital', 'essential', 'key', 'critical'],
      'happy': ['joyful', 'cheerful', 'pleased', 'delighted', 'content', 'merry'],
      'sad': ['unhappy', 'melancholy', 'depressed', 'gloomy', 'dejected', 'sorrowful'],
      'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated', 'basic', 'elementary'],
      'hard': ['difficult', 'challenging', 'tough', 'complex', 'complicated', 'arduous'],
      'new': ['fresh', 'recent', 'modern', 'novel', 'current', 'latest'],
      'old': ['ancient', 'aged', 'elderly', 'vintage', 'antique', 'outdated']
    };

    // MUCH MORE AGGRESSIVE - replace most words
    const rate = config.intensity === 'evasion' ? 0.8 : config.intensity === 'high' ? 0.6 : config.intensity === 'medium' ? 0.4 : 0.2;
    let changes = 0;

    const words = text.split(/(\s+)/);
    const result = words.map(word => {
      const cleanWord = word.toLowerCase().trim();
      if (synonymMap[cleanWord] && Math.random() < rate) {
        changes++;
        const synonym = synonymMap[cleanWord][Math.floor(Math.random() * synonymMap[cleanWord].length)];
        return word.replace(cleanWord, synonym);
      }
      return word;
    }).join('');

    return { result, changes };
  }

  private static typoGeneration(text: string, config: AttackConfig): { result: string; changes: number } {
    const typoMap: { [key: string]: string } = {
      'the': 'teh',
      'and': 'adn',
      'you': 'yuo',
      'are': 'aer',
      'your': 'yoru',
      'their': 'thier',
      'there': 'ther',
      'where': 'wher',
      'what': 'waht',
      'that': 'taht',
      'with': 'wih',
      'this': 'tis',
      'from': 'form',
      'have': 'hav',
      'been': 'ben',
      'will': 'wil',
      'would': 'wold'
    };

    // MUCH MORE AGGRESSIVE - apply to most words
    const rate = config.intensity === 'evasion' ? 0.7 : config.intensity === 'high' ? 0.5 : config.intensity === 'medium' ? 0.3 : 0.15;
    let changes = 0;

    const words = text.split(/(\s+)/);
    const result = words.map(word => {
      const lower = word.toLowerCase().trim();
      if (typoMap[lower] && Math.random() < rate) {
        changes++;
        return word.replace(lower, typoMap[lower]);
      }
      return word;
    }).join('');

    return { result, changes };
  }

  private static caseVariation(text: string, config: AttackConfig): { result: string; changes: number } {
    const rate = 0.2;
    let changes = 0;

    const result = text.split('').map((char, index) => {
      if (/[a-z]/.test(char) && Math.random() < rate && index % 5 === 0) {
        changes++;
        return char.toUpperCase();
      }
      return char;
    }).join('');

    return { result, changes };
  }

  private static wordOrderRandomization(text: string, config: AttackConfig): { result: string; changes: number } {
    // More aggressive randomization based on intensity
    const rate = config.intensity === 'evasion' ? 0.5 : config.intensity === 'high' ? 0.4 : 0.2;
    const sentences = text.split(/[.!?]+/);
    let changes = 0;

    const result = sentences.map(sentence => {
      const words = sentence.trim().split(/\s+/);
      if (words.length > 2 && Math.random() < rate) {
        // Swap adjacent words more aggressively
        for (let i = 0; i < words.length - 1; i += 2) {
          if (Math.random() < rate) {
            [words[i], words[i + 1]] = [words[i + 1], words[i]];
            changes++;
          }
        }
      }
      return words.join(' ');
    }).join('. ');

    return { result, changes };
  }

  private static punctuationManipulation(text: string, config: AttackConfig): { result: string; changes: number } {
    const punctMap: { [key: string]: string } = {
      '.': '．',
      ',': '，',
      '!': '！',
      '?': '？'
    };

    // More aggressive based on intensity
    const rate = config.intensity === 'evasion' ? 0.6 : config.intensity === 'high' ? 0.5 : config.intensity === 'medium' ? 0.3 : 0.2;
    let changes = 0;

    const result = text.split('').map(char => {
      if (punctMap[char] && Math.random() < rate) {
        changes++;
        return punctMap[char];
      }
      return char;
    }).join('');

    return { result, changes };
  }

  private static whitespaceVariation(text: string, config: AttackConfig): { result: string; changes: number } {
    const wsChars = ['\u2000', '\u2001', '\u2002', '\u2003', '\u00A0'];
    // More aggressive based on intensity
    const rate = config.intensity === 'evasion' ? 0.7 : config.intensity === 'high' ? 0.5 : config.intensity === 'medium' ? 0.3 : 0.2;
    let changes = 0;

    const result = text.split(' ').map((word, index) => {
      if (index > 0 && Math.random() < rate) {
        changes++;
        return wsChars[Math.floor(Math.random() * wsChars.length)] + word;
      }
      return word;
    }).join(' ');

    return { result, changes };
  }

  // Metrics calculation
  private static calculateEvasionScore(changes: number, originalLength: number, intensity: string): number {
    if (originalLength === 0) return 0;
    const changeRate = changes / originalLength;
    const intensityMultiplier: { [key: string]: number } = {
      low: 0.7,
      medium: 1.0,
      high: 1.3,
      evasion: 1.5
    };
    const baseScore = changeRate * 100 * (intensityMultiplier[intensity] || 1.0);
    return Math.min(100, Math.round(baseScore));
  }

  private static calculateReadability(text: string, config: AttackConfig): number {
    if (!config.preserveReadability) return 50;
    
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
      low: 'low',
      medium: 'medium',
      high: 'high',
      evasion: 'extreme'
    };
    return mapping[intensity] || 'medium';
  }
}

