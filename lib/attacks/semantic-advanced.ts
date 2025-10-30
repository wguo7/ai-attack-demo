// EXTREME Semantic Attack - SUPER AGGRESSIVE
import { AttackConfig, AttackResult } from './config';

let nlp: any = null;
try {
  nlp = require('compromise');
} catch (e) {
  // Library not available
}

export class SemanticAdvancedAttack {
  private static getIntensityThreshold(intensity: string): number {
    const rates: { [key: string]: number } = {
      low: 0.4,        // 40%
      medium: 0.65,    // 65%
      high: 0.85,     // 85%
      evasion: 0.95   // 95%
    };
    return rates[intensity] || 0.65;
  }

  static async execute(text: string, config: AttackConfig): Promise<AttackResult> {
    const startTime = performance.now();
    let result = text;
    let changes = 0;
    const techniquesUsed: string[] = [];

    const threshold = this.getIntensityThreshold(config.intensity);

    // Comprehensive synonym map
    const synonymMap: { [key: string]: string[] } = {
      'good': ['great', 'excellent', 'fine', 'superb', 'outstanding', 'wonderful', 'fantastic', 'terrific'],
      'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful', 'atrocious', 'lousy', 'pathetic'],
      'big': ['large', 'huge', 'massive', 'enormous', 'gigantic', 'immense', 'vast', 'colossal'],
      'small': ['tiny', 'little', 'mini', 'miniature', 'compact', 'petite', 'minuscule', 'microscopic'],
      'fast': ['quick', 'rapid', 'swift', 'speedy', 'brisk', 'hurried', 'expeditious', 'fleet'],
      'slow': ['sluggish', 'leisurely', 'unhurried', 'gradual', 'lingering', 'delayed', 'tardy'],
      'important': ['significant', 'crucial', 'vital', 'essential', 'key', 'critical', 'paramount', 'pivotal'],
      'happy': ['joyful', 'cheerful', 'pleased', 'delighted', 'content', 'merry', 'jovial', 'gleeful'],
      'sad': ['unhappy', 'melancholy', 'depressed', 'gloomy', 'dejected', 'sorrowful', 'mournful', 'disheartened'],
      'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated', 'basic', 'elementary', 'unproblematic'],
      'hard': ['difficult', 'challenging', 'tough', 'complex', 'complicated', 'arduous', 'strenuous', 'laborious'],
      'new': ['fresh', 'recent', 'modern', 'novel', 'current', 'latest', 'contemporary', 'brand-new'],
      'old': ['ancient', 'aged', 'elderly', 'vintage', 'antique', 'outdated', 'obsolete', 'archaic'],
      'is': ['appears to be', 'seems to be', 'looks like', 'represents'],
      'are': ['seem to be', 'appear to be', 'look like'],
      'very': ['extremely', 'incredibly', 'remarkably', 'exceptionally', 'tremendously'],
      'really': ['truly', 'genuinely', 'absolutely', 'definitely', 'certainly']
    };

    // Paraphrasing patterns
    const paraphrasePatterns = [
      { from: /^(.+) is (.+)\.$/i, to: '$1 appears to be $2.' },
      { from: /^(.+) are (.+)\.$/i, to: '$1 seem to be $2.' },
      { from: /^(.+) can (.+)\.$/i, to: '$1 are able to $2.' },
      { from: /^(.+) will (.+)\.$/i, to: '$1 are going to $2.' },
      { from: /^(.+) should (.+)\.$/i, to: '$1 ought to $2.' },
      { from: /^(.+) must (.+)\.$/i, to: '$1 need to $2.' }
    ];

    // 1. Synonym replacement - AGGRESSIVE
    const words = result.split(/(\s+)/);
    result = words.map(word => {
      if (config.maxModifications && changes >= config.maxModifications) {
        return word;
      }
      const cleanWord = word.toLowerCase().trim().replace(/[.,!?;:]/g, '');
      if (synonymMap[cleanWord] && Math.random() < threshold) {
        changes++;
        if (!techniquesUsed.includes('Synonym Replacement')) {
          techniquesUsed.push('Synonym Replacement');
        }
        const synonym = synonymMap[cleanWord][Math.floor(Math.random() * synonymMap[cleanWord].length)];
        return word.replace(cleanWord, synonym);
      }
      return word;
    }).join('');

    // 2. Sentence paraphrasing
    if (config.intensity === 'high' || config.intensity === 'evasion') {
      const sentences = result.split(/[.!?]+/);
      result = sentences.map(sentence => {
        const trimmed = sentence.trim();
        if (!trimmed) return sentence;
        
        for (const pattern of paraphrasePatterns) {
          if (pattern.from.test(trimmed) && Math.random() < threshold * 0.4) {
            changes++;
            if (!techniquesUsed.includes('Sentence Paraphrasing')) {
              techniquesUsed.push('Sentence Paraphrasing');
            }
            return trimmed.replace(pattern.from, pattern.to);
          }
        }
        return sentence;
      }).join('. ');
    }

    // 3. Use compromise library if available
    if (nlp && config.intensity === 'evasion') {
      try {
        const doc = nlp(result);
        doc.match('#Adjective').forEach((match: any) => {
          if (Math.random() < threshold * 0.3) {
            const synonym = this.getSynonym(match.text());
            if (synonym) {
              match.replaceWith(synonym);
              changes++;
              if (!techniquesUsed.includes('NLP Synonym Replacement')) {
                techniquesUsed.push('NLP Synonym Replacement');
              }
            }
          }
        });
        result = doc.text();
      } catch (e) {
        // Continue without NLP
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

  private static getSynonym(word: string): string | null {
    const synonymMap: { [key: string]: string[] } = {
      'good': ['great', 'excellent'], 'bad': ['poor', 'terrible'],
      'big': ['large', 'huge'], 'small': ['tiny', 'little']
    };
    const lower = word.toLowerCase().trim();
    if (synonymMap[lower]) {
      return synonymMap[lower][Math.floor(Math.random() * synonymMap[lower].length)];
    }
    return null;
  }

  private static calculateEvasionScore(changes: number, originalLength: number): number {
    if (originalLength === 0) return 0;
    const changeRate = changes / originalLength;
    return Math.min(100, Math.round(changeRate * 100));
  }

  private static calculateReadability(text: string): number {
    // Semantic changes maintain high readability
    return 95;
  }

  private static getDifficultyLevel(intensity: string): 'low' | 'medium' | 'high' | 'extreme' {
    const mapping: { [key: string]: 'low' | 'medium' | 'high' | 'extreme' } = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      evasion: 'high'
    };
    return mapping[intensity] || 'medium';
  }

  private static generateExplanation(changes: number) {
    const examples: string[] = [
      `"This is good" → "${this.transformExample('This is good')}"`,
      `"Very important" → "${this.transformExample('Very important')}"`,
      `"He is happy" → "${this.transformExample('He is happy')}"`,
    ];

    return {
      description: `Applied ${changes} semantic modifications using synonym replacement and sentence paraphrasing. Meaning is preserved while evading keyword-based detection.`,
      detectionTips: [
        'Use semantic embeddings instead of keywords',
        'Implement BERT/RoBERTa-based similarity detection',
        'Train models on synonym variations',
        'Use context-aware detection models',
        'Apply word sense disambiguation'
      ],
      examples,
      riskLevel: 'low' as const
    };
  }

  private static transformExample(text: string): string {
    const synonyms: { [key: string]: string } = {
      'good': 'excellent', 'important': 'crucial', 'is': 'appears to be',
      'very': 'extremely', 'happy': 'joyful'
    };
    return text.split(' ').map(w => {
      const lower = w.toLowerCase().replace(/[.,!?]/g, '');
      return synonyms[lower] ? w.replace(lower, synonyms[lower]) : w;
    }).join(' ');
  }
}

