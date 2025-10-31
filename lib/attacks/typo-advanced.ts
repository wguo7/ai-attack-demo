// EXTREME Typo Attack - SUPER AGGRESSIVE
import { AttackConfig, AttackResult } from './config';

export class TypoAdvancedAttack {
  private static getIntensityThreshold(intensity: string): number {
    // More realistic rates - focus on word-level typos, not character gibberish
    const rates: { [key: string]: number } = {
      low: 0.15,       // 15% - subtle
      medium: 0.25,   // 25% - noticeable
      high: 0.35,     // 35% - obvious
      evasion: 0.5    // 50% - very obvious
    };
    return rates[intensity] || 0.25;
  }

  static async execute(text: string, config: AttackConfig): Promise<AttackResult> {
    const startTime = performance.now();
    let result = text;
    let changes = 0;
    const techniquesUsed: string[] = [];

    const threshold = this.getIntensityThreshold(config.intensity);

    // Keyboard distance typos (QWERTY layout)
    const keyboardMap: { [key: string]: string[] } = {
      'q': ['w', 'a'], 'w': ['q', 'e', 's'], 'e': ['w', 'r', 'd'],
      'r': ['e', 't', 'f'], 't': ['r', 'y', 'g'], 'y': ['t', 'u', 'h'],
      'u': ['y', 'i', 'j'], 'i': ['u', 'o', 'k'], 'o': ['i', 'p', 'l'],
      'p': ['o', 'l'], 'a': ['q', 's', 'z'], 's': ['a', 'd', 'w', 'x'],
      'd': ['s', 'f', 'e', 'c'], 'f': ['d', 'g', 'r', 'v'], 'g': ['f', 'h', 't', 'b'],
      'h': ['g', 'j', 'y', 'n'], 'j': ['h', 'k', 'u', 'm'], 'k': ['j', 'l', 'i'],
      'l': ['k', 'o'], 'z': ['a', 'x'], 'x': ['z', 'c', 's'], 'c': ['x', 'v', 'd'],
      'v': ['c', 'b', 'f'], 'b': ['v', 'n', 'g'], 'n': ['b', 'm', 'h'], 'm': ['n', 'j']
    };

    // Common autocorrect errors - REALISTIC WORD-LEVEL TYPOS
    const autocorrectMap: { [key: string]: string } = {
      'the': 'teh', 'and': 'adn', 'you': 'yuo', 'are': 'aer', 'your': 'yoru',
      'their': 'thier', 'there': 'ther', 'where': 'wher', 'what': 'waht',
      'that': 'taht', 'with': 'wih', 'this': 'tis', 'from': 'form',
      'have': 'hav', 'been': 'ben', 'will': 'wil', 'would': 'wold',
      'could': 'cud', 'should': 'shud', 'because': 'becuz', 'through': 'thru',
      'is': 'is', 'it': 'it', 'to': 'to', 'of': 'of', 'a': 'a',
      // Common word typos
      'text': 'txt', 'used': 'usd', 'design': 'desgin', 'called': 'calld',
      'also': 'aslo', 'tool': 'tol', 'helps': 'helsp', 'visual': 'visula',
      'elements': 'elemnts', 'document': 'documnt', 'presentation': 'presntation',
      'mostly': 'mostyl', 'part': 'prt', 'words': 'wrods', 'letters': 'leters',
      'changed': 'chagned', 'deliberately': 'delibaretly', 'render': 'rendr',
      'content': 'contnet', 'nonsensical': 'nonsensial', 'genuine': 'genuien',
      'correct': 'corect', 'comprehensible': 'comprehesible', 'anymore': 'anyomore',
      'while': 'whiel', 'still': 'stil', 'resembles': 'resmbles', 'classical': 'clasical',
      'actually': 'actuallly', 'meaning': 'meanign', 'whatsoever': 'whatsover',
      'contain': 'contian', 'inserted': 'insrted', 'randomly': 'randmly',
      'mimic': 'mimik', 'typographic': 'typograhpic', 'appearance': 'appearnce',
      'languages': 'langauges', 'found': 'foud', 'original': 'origianl'
    };

    // 1. Autocorrect errors - WORD-LEVEL ONLY (not character gibberish)
    const words = result.split(/(\s+)/);
    result = words.map(word => {
      if (config.maxModifications && changes >= config.maxModifications) {
        return word;
      }
      // Preserve punctuation and case
      const cleanWord = word.toLowerCase().trim().replace(/[.,!?;:]/g, '');
      const punctuation = word.match(/[.,!?;:]/g)?.join('') || '';
      
      if (autocorrectMap[cleanWord] && autocorrectMap[cleanWord] !== cleanWord && Math.random() < threshold) {
        changes++;
        if (!techniquesUsed.includes('Autocorrect Errors')) {
          techniquesUsed.push('Autocorrect Errors');
        }
        // Preserve original case and punctuation
        const isCapitalized = word[0] === word[0]?.toUpperCase();
        const typo = autocorrectMap[cleanWord];
        const replacement = isCapitalized 
          ? typo.charAt(0).toUpperCase() + typo.slice(1) + punctuation
          : typo + punctuation;
        return word.replace(cleanWord + punctuation, replacement);
      }
      return word;
    }).join('');

    // 2. Occasional single character keyboard typos (very limited)
    if (config.intensity === 'high' || config.intensity === 'evasion') {
      // Only apply to 1-2% of characters max to avoid gibberish
      result = result.split('').map((char, index) => {
        if (config.maxModifications && changes >= config.maxModifications) {
          return char;
        }
        const lower = char.toLowerCase();
        // Very rare character substitutions (only for high intensity, and only 5% of the time)
        if (keyboardMap[lower] && /[a-z]/.test(lower) && Math.random() < 0.05 && index % 10 === 0) {
          changes++;
          if (!techniquesUsed.includes('Keyboard Distance')) {
            techniquesUsed.push('Keyboard Distance');
          }
          const replacement = keyboardMap[lower][Math.floor(Math.random() * keyboardMap[lower].length)] || lower;
          return this.preserveCase(char, replacement);
        }
        return char;
      }).join('');
    }

    // 3. Phonetic replacements (word-level patterns only)
    if (config.intensity === 'evasion') {
      // Only apply to word endings, not everywhere
      const phoneticWordPatterns: { [key: string]: string } = {
        'tion': 'shun', // Only at word boundaries
      };
      
      for (const [pattern, replacement] of Object.entries(phoneticWordPatterns)) {
        const regex = new RegExp(`\\b(\\w+)${pattern}\\b`, 'gi');
        if (regex.test(result) && Math.random() < threshold * 0.3) {
          changes++;
          if (!techniquesUsed.includes('Phonetic Errors')) {
            techniquesUsed.push('Phonetic Errors');
          }
          result = result.replace(regex, `$1${replacement}`);
        }
      }
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

  private static preserveCase(original: string, replacement: string): string {
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (original[0]?.toUpperCase() === original[0]) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  private static calculateEvasionScore(changes: number, originalLength: number): number {
    if (originalLength === 0) return 0;
    const changeRate = changes / originalLength;
    return Math.min(100, Math.round(changeRate * 110));
  }

  private static calculateReadability(text: string): number {
    // Typos reduce readability
    return Math.max(60, 95 - (text.length / 10));
  }

  private static getDifficultyLevel(intensity: string): 'low' | 'medium' | 'high' | 'extreme' {
    const mapping: { [key: string]: 'low' | 'medium' | 'high' | 'extreme' } = {
      low: 'medium',
      medium: 'high',
      high: 'high',
      evasion: 'extreme'
    };
    return mapping[intensity] || 'high';
  }

  private static generateExplanation(changes: number) {
    const examples: string[] = [
      `"the quick brown" → "${this.transformExample('the quick brown')}"`,
      `"you are welcome" → "${this.transformExample('you are welcome')}"`,
      `"this is important" → "${this.transformExample('this is important')}"`,
    ];

    return {
      description: `Applied ${changes} typo modifications using keyboard distance substitutions, autocorrect errors, and phonetic replacements. These mimic real-world typing mistakes.`,
      detectionTips: [
        'Use fuzzy string matching (Levenshtein distance)',
        'Implement spell-checking before analysis',
        'Normalize common typos to standard forms',
        'Train models on typo variations',
        'Use character n-grams instead of exact matches'
      ],
      examples,
      riskLevel: 'medium' as const
    };
  }

  private static transformExample(text: string): string {
    const autocorrect: { [key: string]: string } = {
      'the': 'teh', 'you': 'yuo', 'are': 'aer', 'quick': 'kwik'
    };
    return text.split(' ').map(w => {
      const lower = w.toLowerCase();
      return autocorrect[lower] || w;
    }).join(' ');
  }
}

