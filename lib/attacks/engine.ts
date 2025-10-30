// Production-Grade Adversarial Attack Engine
import { AttackResult, AttackDefinition, AttackIntensity } from './types';
import { HomoglyphAttack } from './homoglyph';
import { InvisibleCharacterAttack } from './invisible';
import { TypoAttack } from './typo';
import { SemanticAttack } from './semantic';
import { MultiVectorAttack } from './multiVector';

export * from './types';

export const attackDefinitions: AttackDefinition[] = [
  {
    id: 'homoglyphs',
    name: 'Homoglyph Attack',
    category: 'character',
    description: 'Replace characters with visually similar Unicode glyphs using homoglyph library',
    riskLevel: 'high',
    icon: '🔤'
  },
  {
    id: 'character',
    name: 'Character-Level Attack',
    category: 'character',
    description: 'Comprehensive character-level attacks (homoglyph, invisible chars, normalization)',
    riskLevel: 'high',
    icon: '🔤'
  },
  {
    id: 'word',
    name: 'Word-Level Attack',
    category: 'word',
    description: 'Word-level attacks (synonyms, typos, case variation)',
    riskLevel: 'medium',
    icon: '📝'
  },
  {
    id: 'sentence',
    name: 'Sentence-Level Attack',
    category: 'sentence',
    description: 'Sentence-level attacks (word order, punctuation, whitespace)',
    riskLevel: 'medium',
    icon: '📄'
  },
  {
    id: 'invisible-chars',
    name: 'Invisible Characters',
    category: 'character', 
    description: 'Insert zero-width spaces, bidirectional overrides, and normalization-breaking sequences',
    riskLevel: 'medium',
    icon: '👻'
  },
  {
    id: 'typo',
    name: 'Advanced Typo Attack',
    category: 'character',
    description: 'Keyboard distance substitutions, phonetic errors, and autocorrect mistakes',
    riskLevel: 'low',
    icon: '⌨️'
  },
  {
    id: 'semantic',
    name: 'Semantic Attack',
    category: 'semantic',
    description: 'Context-aware synonym replacement, sentence paraphrasing, and style transfer',
    riskLevel: 'low',
    icon: '🔄'
  },
  {
    id: 'multi-vector',
    name: 'Multi-Vector Combined',
    category: 'multi-vector',
    description: 'Chain multiple attack types for maximum evasion capabilities',
    riskLevel: 'critical',
    icon: '⚡'
  }
];

export class AttackEngine {
  static async executeAttack(
    text: string, 
    attackType: string,
    intensity: AttackIntensity = 'medium'
  ): Promise<AttackResult> {
    const startTime = performance.now();
    
    let result = text;
    let changes = 0;
    let techniques: string[] = [];

    // Execute the appropriate attack
    switch (attackType) {
      case 'homoglyphs':
        const homoglyphResult = HomoglyphAttack.execute(text, intensity);
        result = homoglyphResult.result;
        changes = homoglyphResult.changes;
        techniques = homoglyphResult.techniques;
        break;

      case 'invisible-chars':
        const invisibleResult = InvisibleCharacterAttack.execute(text, intensity);
        result = invisibleResult.result;
        changes = invisibleResult.changes;
        techniques = invisibleResult.techniques;
        break;

      case 'typo':
        const typoResult = TypoAttack.execute(text, intensity);
        result = typoResult.result;
        changes = typoResult.changes;
        techniques = typoResult.techniques;
        break;

      case 'semantic':
        const semanticResult = SemanticAttack.execute(text, intensity);
        result = semanticResult.result;
        changes = semanticResult.changes;
        techniques = semanticResult.techniques;
        break;

      case 'multi-vector':
        const multiVectorResult = MultiVectorAttack.execute(text, intensity);
        result = multiVectorResult.result;
        changes = multiVectorResult.changes;
        techniques = multiVectorResult.techniques;
        break;

      default:
        result = text;
    }

    const processingTime = performance.now() - startTime;
    const originalLength = text.length;
    
    // Calculate metrics
    const similarityScore = originalLength > 0 
      ? Math.max(0, 1 - (changes / originalLength)) 
      : 1;
    
    const evasionScore = this.calculateEvasionScore(attackType, intensity, changes, originalLength);
    const humanReadability = this.calculateHumanReadability(result, text, attackType);
    const detectionDifficulty = this.calculateDetectionDifficulty(evasionScore);

    return {
      result,
      metrics: {
        evasionScore,
        humanReadability,
        changesMade: changes,
        processingTime,
        charactersChanged: changes,
        wordsChanged: Math.ceil(changes / 5),
        similarityScore
      },
      techniquesUsed: techniques,
      detectionDifficulty,
      explanation: this.getExplanation(attackType, changes, intensity)
    };
  }

  private static calculateEvasionScore(
    attackType: string,
    intensity: string,
    changes: number,
    originalLength: number
  ): number {
    let baseScore = 0;
    
    // Base score by attack type
    switch (attackType) {
      case 'homoglyphs': baseScore = 75; break;
      case 'invisible-chars': baseScore = 65; break;
      case 'typo': baseScore = 40; break;
      case 'semantic': baseScore = 30; break;
      case 'multi-vector': baseScore = 95; break;
      default: baseScore = 50;
    }

    // Intensity multiplier
    const intensityMultiplier: { [key: string]: number } = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.3,
      'evasion': 1.5
    };
    
    baseScore *= intensityMultiplier[intensity] || 1.0;

    // Change rate modifier (more changes can be easier to detect)
    const changeRate = originalLength > 0 ? changes / originalLength : 0;
    if (changeRate > 0.5) {
      baseScore *= 0.9; // Too many changes can be suspicious
    }

    return Math.min(100, Math.max(0, Math.round(baseScore)));
  }

  private static calculateHumanReadability(attacked: string, original: string, attackType: string): number {
    let score = 100;

    // Guard against undefined
    if (!attacked || !original) {
      return 70;
    }

    // Invisible characters don't affect visual readability much
    if (attackType === 'invisible-chars') {
      score = 95;
    } else if (attackType === 'homoglyphs') {
      // Homoglyphs are visually identical but may break some systems
      score = 90;
    } else if (attackType === 'typo') {
      // Typos reduce readability
      score = 70;
    } else if (attackType === 'semantic') {
      // Semantic changes maintain readability
      score = 95;
    } else if (attackType === 'multi-vector') {
      // Combined attacks reduce readability
      score = 65;
    }

    // Check for obvious issues (only if both strings exist)
    if (attacked && original && attacked.length !== original.length && attackType !== 'semantic') {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  private static calculateDetectionDifficulty(evasionScore: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (evasionScore >= 90) return 'extreme';
    if (evasionScore >= 70) return 'high';
    if (evasionScore >= 50) return 'medium';
    return 'low';
  }

  private static getExplanation(attackType: string, changes: number, intensity: string) {
    const explanations: { [key: string]: AttackResult['explanation'] } = {
      homoglyphs: {
        description: 'Uses Unicode TR39 confusables database to replace characters with visually identical glyphs from different scripts (Latin → Cyrillic, Greek, Mathematical). Bypasses visual text filters and mitigates AI character-level detection.',
        detectionTips: [
          'Use Unicode script detection (UCD Script property)',
          'Normalize to NFC/NFD and check script mixing',
          'Implement confusables detection libraries',
          'Validate character set against expected scripts'
        ],
        examples: [
          'paypal.com → рaypal.com (Cyrillic р)',
          'apple → аррle (mixed scripts)',
          'microsoft → microsoft (Cyrillic с)'

        ],
        riskLevel: 'high' as const
      },
      'invisible-chars': {
        description: 'Inserts zero-width characters, bidirectional overrides (RLO/LRO), and Unicode normalization-breaking sequences. Invisible to humans but breaks text processing pipelines.',
        detectionTips: [
          'Strip all zero-width characters before processing',
          'Check string length vs visible character count',
          'Detect bidirectional control characters',
          'Normalize all Unicode before analysis'
        ],
        examples: [
          'hello world → he​l​lo wo​rld (zero-width spaces)',
          'admin → \u202Enimda\u202D (bidirectional override)',
          'password → p‌a‌s‌s‌w‌o‌r‌d (zero-width joiners)'
        ],
        riskLevel: 'medium' as const
      },
      typo: {
        description: 'Keyboard distance-based substitutions, phonetic misspellings, and common autocorrect errors. Mimics real-world typing mistakes.',
        detectionTips: [
          'Use fuzzy string matching (Levenshtein distance)',
          'Implement spell-checking before analysis',
          'Normalize common typos',
          'Train models on typo variations'
        ],
        examples: [
          'the → teh (keyboard distance)',
          'quick → kwik (phonetic)',
          'you → yuo (autocorrect error)'
        ],
        riskLevel: 'low' as const
      },
      semantic: {
        description: 'Context-aware synonym replacement and sentence structure paraphrasing. Preserves meaning while evading keyword-based detection.',
        detectionTips: [
          'Use semantic embeddings instead of keywords',
          'Implement BERT/RoBERTa-based semantic similarity',
          'Train models on synonym variations',
          'Use context-aware detection models'
        ],
        examples: [
          'good → excellent (synonym)',
          'He is happy → He appears joyful (paraphrase)',
          'important → crucial (context-aware replacement)'
        ],
        riskLevel: 'low' as const
      },
      'multi-vector': {
        description: 'Combines multiple attack vectors sequentially for maximum evasion. Chains semantic, typo, homoglyph, and invisible character attacks.',
        detectionTips: [
          'Combine all detection strategies',
          'Use multi-stage detection pipelines',
          'Implement ensemble detection models',
          'Apply all normalization and validation steps'
        ],
        examples: [
          'Combined semantic + homoglyph + invisible chars',
          'Multi-stage attack with adaptive intensity',
          'Maximum evasion configuration'
        ],
        riskLevel: 'critical' as const
      }
    };

    return explanations[attackType] || {
      description: 'Attack executed successfully.',
      detectionTips: ['No specific detection tips available.'],
      examples: [],
      riskLevel: 'medium' as const
    };
  }
}
