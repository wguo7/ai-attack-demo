// Production-Grade Configuration-Driven Attack Engine
import { ComprehensiveAttackEngine } from './comprehensive';
import { AttackConfig, AttackResult, DEFAULT_CONFIG } from './config';
import { HomoglyphAdvancedAttack } from './homoglyph-advanced';
import { InvisibleCharacterAdvancedAttack } from './invisible-advanced';
import { SemanticAdvancedAttack } from './semantic-advanced';
import { TypoAdvancedAttack } from './typo-advanced';

export class AttackEngineV2 {
  static async executeAttack(
    text: string,
    attackType: string,
    config?: Partial<AttackConfig>
  ): Promise<AttackResult> {
    const fullConfig: AttackConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      techniques: config?.techniques || [],
      // FORCE higher intensity for visibility
      intensity: config?.intensity || 'high', // Default to 'high' instead of 'medium'
    };

    let result: AttackResult;

    switch (attackType) {
      case 'homoglyphs':
      case 'homoglyph':
        result = await HomoglyphAdvancedAttack.execute(text, fullConfig);
        break;

      case 'invisible-chars':
      case 'invisible':
        result = await InvisibleCharacterAdvancedAttack.execute(text, fullConfig);
        break;

      case 'typo':
      case 'typos':
        result = await TypoAdvancedAttack.execute(text, fullConfig);
        break;

      case 'semantic':
        result = await SemanticAdvancedAttack.execute(text, fullConfig);
        break;

      case 'character':
      case 'character-level':
        result = await ComprehensiveAttackEngine.executeCharacterLevel(text, fullConfig);
        break;

      case 'word':
      case 'word-level':
        result = await ComprehensiveAttackEngine.executeWordLevel(text, fullConfig);
        break;

      case 'sentence':
      case 'sentence-level':
        result = await ComprehensiveAttackEngine.executeSentenceLevel(text, fullConfig);
        break;

      case 'comprehensive':
      case 'multi-vector':
        // Use dedicated MultiVectorAttack class
        const MultiVectorAttackModule = await import('./multiVector');
        result = await MultiVectorAttackModule.MultiVectorAttack.execute(text, {
          ...fullConfig,
          intensity: 'evasion'
        });
        break;

      default:
        // Default to homoglyph attack with high intensity
        result = await HomoglyphAdvancedAttack.execute(text, {
          ...fullConfig,
          intensity: 'high'
        });
        break;
    }

    // Ensure explanation has real examples
    if (!result.explanation) {
      result.explanation = this.generateExplanation(attackType, result.result, text, result.metrics.changesMade);
    }

    return result;
  }

  private static generateExplanation(
    attackType: string, 
    result: string, 
    original: string, 
    changes: number
  ): AttackResult['explanation'] {
    const baseExamples: { [key: string]: string[] } = {
      'homoglyphs': [
        `"hello" → "${this.transformText('hello', 'homoglyph')}"`,
        `"paypal.com" → "${this.transformText('paypal.com', 'homoglyph')}"`,
        `"microsoft" → "${this.transformText('microsoft', 'homoglyph')}"`
      ],
      'character': [
        `"hello world" → "${this.transformText('hello world', 'character')}"`,
        `"test string" → "${this.transformText('test string', 'character')}"`,
      ],
      'word': [
        `"This is good" → "${this.transformText('This is good', 'word')}"`,
        `"Very important" → "${this.transformText('Very important', 'word')}"`,
      ],
      'sentence': [
        `"Hello world!" → "${this.transformText('Hello world!', 'sentence')}"`,
      ]
    };

    return {
      description: `${changes} modifications were applied using ${attackType} attack techniques. The text has been transformed to demonstrate adversarial capabilities.`,
      detectionTips: [
        'Use Unicode normalization before processing',
        'Implement script detection for mixed scripts',
        'Strip zero-width characters',
        'Use semantic analysis instead of keyword matching'
      ],
      examples: baseExamples[attackType] || [
        `Original: "${original.substring(0, 20)}..." → Modified: "${result.substring(0, 20)}..."`
      ],
      riskLevel: 'high' as const
    };
  }

  private static transformText(text: string, type: string): string {
    if (type === 'homoglyph') {
      const map: { [key: string]: string } = {
        'a': 'а', 'e': 'е', 'o': 'о', 'c': 'с', 'p': 'р',
        'x': 'х', 'y': 'у', 'A': 'А', 'B': 'В', 'C': 'С',
        'E': 'Е', 'H': 'Н', 'K': 'К', 'M': 'М', 'O': 'О'
      };
      return text.split('').map(c => map[c] || c).join('');
    } else if (type === 'character') {
      const map: { [key: string]: string } = { 'a': 'а', 'e': 'е', 'o': 'о' };
      return text.split('').map((c, i) => {
        if (map[c.toLowerCase()] && i % 2 === 0) {
          return map[c.toLowerCase()] || c;
        }
        return c;
      }).join('') + '\u200B';
    } else if (type === 'word') {
      const synonyms: { [key: string]: string } = {
        'good': 'excellent', 'important': 'crucial', 'is': 'appears to be'
      };
      return text.split(' ').map(w => {
        const lower = w.toLowerCase().replace(/[.,!?]/g, '');
        return synonyms[lower] ? w.replace(lower, synonyms[lower]) : w;
      }).join(' ');
    }
    return text;
  }

  static createConfig(
    intensity: 'low' | 'medium' | 'high' | 'evasion' = 'high', // Default to high
    techniques: string[] = [],
    preserveReadability: boolean = true
  ): AttackConfig {
    return {
      intensity,
      techniques,
      preserveReadability,
      maxModifications: undefined,
    };
  }
}
